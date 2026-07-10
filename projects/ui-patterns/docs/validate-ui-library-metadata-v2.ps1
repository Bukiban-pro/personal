param(
  [string]$UiLabRoot = (Join-Path $PSScriptRoot ".."),
  [string]$RegistryPath = (Join-Path $PSScriptRoot "..\configs\ui-lab-registry.json"),
  [string]$ComponentMetadataPath = (Join-Path $PSScriptRoot "..\configs\ui-library-component-metadata-v2.json"),
  [string]$ComponentRankingsPath = (Join-Path $PSScriptRoot "..\configs\ui-library-component-rankings-v2.json"),
  [string]$ManualReviewOverridesPath = (Join-Path $PSScriptRoot "..\configs\ui-library-manual-review-overrides.json")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-Condition {
  param(
    [Parameter(Mandatory = $true)][bool]$Condition,
    [Parameter(Mandatory = $true)][string]$Message
  )

  if (-not $Condition) {
    throw $Message
  }
}

function Assert-ScoreRange {
  param(
    [Parameter(Mandatory = $true)][object]$Value,
    [Parameter(Mandatory = $true)][string]$Path
  )

  Assert-Condition -Condition ($null -ne $Value) -Message "Missing score field: $Path"
  Assert-Condition -Condition ($Value.PSObject.Properties.Name -contains 'score') -Message "Missing score property: $Path.score"
  Assert-Condition -Condition ($Value.score -is [int] -or $Value.score -is [long]) -Message "Score is not numeric: $Path.score"
  Assert-Condition -Condition ($Value.score -ge 1 -and $Value.score -le 5) -Message "Score out of range 1-5: $Path.score"
  Assert-Condition -Condition ($Value.PSObject.Properties.Name -contains 'anchor') -Message "Missing anchor text: $Path.anchor"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$Value.anchor)) -Message "Empty anchor text: $Path.anchor"
}

function Get-CriticalityAnchor {
  param([Parameter(Mandatory = $true)][int]$CriticalityScore)

  switch ($CriticalityScore) {
    1 { return 'Very low critique burden; safe in broad default use' }
    2 { return 'Low critique burden; still has a few guardrails' }
    3 { return 'Moderate critique burden; use deliberately' }
    4 { return 'High critique burden; needs explicit justification' }
    5 { return 'Severe critique burden; do not use casually' }
    default { return 'Moderate critique burden; use deliberately' }
  }
}

function Get-FileTextCached {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][hashtable]$Cache
  )

  if (-not $Cache.ContainsKey($Path)) {
    Assert-Condition -Condition (Test-Path -LiteralPath $Path) -Message "Expected generated file missing: $Path"
    $Cache[$Path] = Get-Content -Raw -LiteralPath $Path
  }

  return [string]$Cache[$Path]
}

function Get-ExpectedExactExportSnippet {
  param([Parameter(Mandatory = $true)][psobject]$Component)

  switch ([string]$Component.exactNameExportKind) {
    'named' { return ('export {{ {0} }} from ' -f $Component.name) }
    'alias' { return ('export {{ {0} as {1} }} from ' -f $Component.exactNameSourceExport, $Component.name) }
    'namespace' { return ('export * as {0} from ' -f $Component.name) }
    'defaultAlias' { return ('export {{ default as {0} }} from ' -f $Component.name) }
    default { return $null }
  }
}

Assert-Condition -Condition (Test-Path -LiteralPath $RegistryPath) -Message "Registry not found: $RegistryPath"
Assert-Condition -Condition (Test-Path -LiteralPath $ComponentMetadataPath) -Message "Component metadata not found: $ComponentMetadataPath"
Assert-Condition -Condition (Test-Path -LiteralPath $ComponentRankingsPath) -Message "Component rankings not found: $ComponentRankingsPath"

$workspaceRoot = (Resolve-Path -LiteralPath (Join-Path $UiLabRoot '..')).Path

$registry = Get-Content -Raw -LiteralPath $RegistryPath | ConvertFrom-Json
$componentMetadata = Get-Content -Raw -LiteralPath $ComponentMetadataPath | ConvertFrom-Json
$componentRankings = Get-Content -Raw -LiteralPath $ComponentRankingsPath | ConvertFrom-Json
$manualReviewOverrides = @()
if (Test-Path -LiteralPath $ManualReviewOverridesPath) {
  $manualReviewOverridesRaw = Get-Content -Raw -LiteralPath $ManualReviewOverridesPath | ConvertFrom-Json
  if ($manualReviewOverridesRaw -is [System.Array]) {
    $manualReviewOverrides = $manualReviewOverridesRaw
  } elseif ($null -ne $manualReviewOverridesRaw) {
    $manualReviewOverrides = @($manualReviewOverridesRaw)
  }
}

$manualReviewLookup = @{}
foreach ($manualReviewOverride in $manualReviewOverrides) {
  $manualReviewLookup[$manualReviewOverride.name] = $manualReviewOverride
}

$components = @($registry.componentLookup)
Assert-Condition -Condition ($components.Count -gt 0) -Message "Registry componentLookup is empty"
Assert-Condition -Condition ($componentMetadata.Count -eq $components.Count) -Message "Component metadata count mismatch: registry=$($components.Count) componentMetadata=$($componentMetadata.Count)"
Assert-Condition -Condition ($componentRankings.Count -eq $components.Count) -Message "Component rankings count mismatch: registry=$($components.Count) componentRankings=$($componentRankings.Count)"

$allowedAutonomy = @('auto_select', 'suggest_only', 'human_review_required', 'restricted')
$allowedLifecycle = @('candidate', 'supported', 'deprecated', 'retired')
$allowedReviewMethods = @('heuristic_profile_inference', 'manual_readthrough')
$allowedReviewedBy = @('GitHub Copilot heuristic synthesis', 'GitHub Copilot manual readthrough')
$generatedFileCache = @{}
$byNameBarrelPath = Join-Path $UiLabRoot 'library\by-name\index.ts'
$componentRankingLookup = @{}
foreach ($rankingEntry in $componentRankings) {
  $componentRankingLookup[[string]$rankingEntry.name] = $rankingEntry
}

$validated = 0
$globalRanks = [System.Collections.Generic.HashSet[int]]::new()
$validatedManualOverrides = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($component in $components) {
  Assert-Condition -Condition ($component.PSObject.Properties.Name -contains 'decisionMetadataV2') -Message "Missing decisionMetadataV2 for $($component.name)"
  $meta = $component.decisionMetadataV2

  Assert-Condition -Condition ($meta.schemaVersion -eq 'ui-library-metadata-v2') -Message "Unexpected schemaVersion for $($component.name): $($meta.schemaVersion)"

  $layers = $meta.layers
  Assert-Condition -Condition ($null -ne $layers.identity) -Message "Missing identity layer for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.intent) -Message "Missing intent layer for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.eligibility) -Message "Missing eligibility layer for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.readiness) -Message "Missing readiness layer for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.operationalCost) -Message "Missing operationalCost layer for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.behavioralCharacter) -Message "Missing behavioralCharacter layer for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.provenance) -Message "Missing provenance layer for $($component.name)"

  Assert-Condition -Condition ($layers.eligibility.allowedContexts.Count -gt 0) -Message "No allowedContexts for $($component.name)"
  Assert-Condition -Condition ($layers.eligibility.disallowedContexts.Count -gt 0) -Message "No disallowedContexts for $($component.name)"
  Assert-Condition -Condition ($allowedAutonomy -contains $layers.eligibility.autonomyAllowance) -Message "Invalid autonomyAllowance for $($component.name)"
  Assert-Condition -Condition ($layers.identity.aliases.Count -gt 0) -Message "Missing identity.aliases for $($component.name)"
  Assert-Condition -Condition (@($layers.identity.aliases | Where-Object { [string]$_ -in @('*', 'default') }).Count -eq 0) -Message "identity.aliases contains invalid pseudo-export alias for $($component.name)"
  Assert-Condition -Condition ($layers.identity.relatedComponents.Count -gt 0) -Message "Missing identity.relatedComponents for $($component.name)"
  Assert-Condition -Condition (-not ($layers.identity.relatedComponents -contains $component.name)) -Message "identity.relatedComponents includes self for $($component.name)"

  Assert-Condition -Condition ($allowedLifecycle -contains $layers.readiness.lifecycle) -Message "Invalid lifecycle for $($component.name)"
  Assert-Condition -Condition ($layers.readiness.evidenceType.Count -gt 0) -Message "No evidenceType for $($component.name)"

  Assert-ScoreRange -Value $layers.readiness.stability -Path "$($component.name).layers.readiness.stability"
  Assert-ScoreRange -Value $layers.readiness.accessibilityConfidence -Path "$($component.name).layers.readiness.accessibilityConfidence"
  Assert-ScoreRange -Value $layers.readiness.internationalizationConfidence -Path "$($component.name).layers.readiness.internationalizationConfidence"
  Assert-ScoreRange -Value $layers.readiness.analyticsConfidence -Path "$($component.name).layers.readiness.analyticsConfidence"
  Assert-ScoreRange -Value $layers.readiness.failureCost -Path "$($component.name).layers.readiness.failureCost"

  Assert-ScoreRange -Value $layers.operationalCost.performanceBudgetFit -Path "$($component.name).layers.operationalCost.performanceBudgetFit"
  Assert-ScoreRange -Value $layers.operationalCost.implementationComplexity -Path "$($component.name).layers.operationalCost.implementationComplexity"
  Assert-ScoreRange -Value $layers.operationalCost.dependencyBurden -Path "$($component.name).layers.operationalCost.dependencyBurden"
  Assert-ScoreRange -Value $layers.operationalCost.designTokenDependencyLevel -Path "$($component.name).layers.operationalCost.designTokenDependencyLevel"
  Assert-ScoreRange -Value $layers.operationalCost.contentAuthoringBurden -Path "$($component.name).layers.operationalCost.contentAuthoringBurden"

  Assert-ScoreRange -Value $layers.behavioralCharacter.opinionation -Path "$($component.name).layers.behavioralCharacter.opinionation"
  Assert-ScoreRange -Value $layers.behavioralCharacter.expressiveness -Path "$($component.name).layers.behavioralCharacter.expressiveness"
  Assert-ScoreRange -Value $layers.behavioralCharacter.formality -Path "$($component.name).layers.behavioralCharacter.formality"
  Assert-ScoreRange -Value $layers.behavioralCharacter.interactionIntensity -Path "$($component.name).layers.behavioralCharacter.interactionIntensity"
  Assert-ScoreRange -Value $layers.behavioralCharacter.visualDominance -Path "$($component.name).layers.behavioralCharacter.visualDominance"
  Assert-ScoreRange -Value $layers.behavioralCharacter.densityFeel -Path "$($component.name).layers.behavioralCharacter.densityFeel"

  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.provenance.owner)) -Message "Missing owner in provenance for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.provenance.lastReviewed)) -Message "Missing lastReviewed in provenance for $($component.name)"
  Assert-Condition -Condition ($layers.provenance.linkedExamples.Count -gt 0) -Message "Missing provenance.linkedExamples for $($component.name)"
  Assert-Condition -Condition (@($layers.provenance.linkedExamples | Where-Object { ([string]$_) -like 'projects/ui-patterns/library/by-name#*' }).Count -gt 0) -Message "provenance.linkedExamples missing by-name anchor for $($component.name)"
  Assert-Condition -Condition (@($layers.provenance.linkedExamples | Where-Object { ([string]$_) -like ("projects/ui-patterns/library/shelves/{0}/components#*" -f $component.shelfKey) }).Count -gt 0) -Message "provenance.linkedExamples missing shelf component anchor for $($component.name)"
  Assert-Condition -Condition (@($layers.provenance.linkedExamples | Where-Object { ([string]$_) -like '*#*' -and ([string]$_) -notlike '*#' -and ([string]$_) -notlike '*#*#*' }).Count -eq $layers.provenance.linkedExamples.Count) -Message "provenance.linkedExamples contains malformed anchors for $($component.name)"
  Assert-Condition -Condition (@($layers.provenance.linkedExamples | Where-Object { ([string]$_) -like '*#*' -and ([string]$_).EndsWith('#*') }).Count -eq 0) -Message "provenance.linkedExamples contains wildcard anchor for $($component.name)"
  Assert-Condition -Condition (@($layers.provenance.linkedExamples | Where-Object { ([string]$_).EndsWith('#default') }).Count -eq 0) -Message "provenance.linkedExamples contains default anchor for $($component.name)"
  Assert-Condition -Condition ($layers.provenance.sourceLinks.Count -gt 0) -Message "Missing provenance.sourceLinks for $($component.name)"
  Assert-Condition -Condition ($layers.provenance.sourceLinks -contains [string]$component.sourcePath) -Message "provenance.sourceLinks missing component sourcePath for $($component.name)"
  Assert-Condition -Condition ($layers.provenance.sourceLinks -contains 'projects/ui-patterns/docs/UI_LIBRARY_METADATA_V2.md') -Message "provenance.sourceLinks missing metadata spec link for $($component.name)"
  Assert-Condition -Condition ($layers.provenance.PSObject.Properties.Name -contains 'heuristicInputs') -Message "Missing provenance.heuristicInputs for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.provenance.heuristicInputs) -Message "Null provenance.heuristicInputs for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.provenance.heuristicInputs.relativeComponentPath)) -Message "Missing heuristicInputs.relativeComponentPath for $($component.name)"
  Assert-Condition -Condition ($null -ne $layers.criticalReview) -Message "Missing layers.criticalReview for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.criticalReview.reviewMethod)) -Message "Missing criticalReview.reviewMethod for $($component.name)"
  Assert-Condition -Condition ($allowedReviewMethods -contains $layers.criticalReview.reviewMethod) -Message "Unexpected criticalReview.reviewMethod for $($component.name): $($layers.criticalReview.reviewMethod)"
  Assert-Condition -Condition ($layers.provenance.PSObject.Properties.Name -contains 'manualReviewed') -Message "Missing provenance.manualReviewed for $($component.name)"
  Assert-Condition -Condition ($layers.provenance.manualReviewed -is [bool]) -Message "provenance.manualReviewed must be boolean for $($component.name)"
  $manualReviewOverride = $null
  if ($manualReviewLookup.ContainsKey($component.name)) {
    [void]$validatedManualOverrides.Add([string]$component.name)
    $manualReviewOverride = $manualReviewLookup[$component.name]
    Assert-Condition -Condition ($layers.provenance.manualReviewed -eq $true) -Message "Manual override not marked manualReviewed for $($component.name)"
    Assert-Condition -Condition ($layers.criticalReview.reviewMethod -eq 'manual_readthrough') -Message "Manual override reviewMethod mismatch for $($component.name)"
    Assert-Condition -Condition ($null -ne $layers.provenance.manualDecision) -Message "Missing provenance.manualDecision for $($component.name)"
    Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.provenance.manualDecision.stance)) -Message "Missing manualDecision.stance for $($component.name)"
    Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.provenance.manualDecision.whyNow)) -Message "Missing manualDecision.whyNow for $($component.name)"
    Assert-Condition -Condition ($layers.provenance.manualDecision.mustProve.Count -gt 0) -Message "Missing manualDecision.mustProve for $($component.name)"
    Assert-Condition -Condition ($layers.provenance.manualDecision.killSwitch.Count -gt 0) -Message "Missing manualDecision.killSwitch for $($component.name)"
    Assert-Condition -Condition ($layers.provenance.manualDecision.evidenceRefs.Count -gt 0) -Message "Missing manualDecision.evidenceRefs for $($component.name)"
    Assert-Condition -Condition ($layers.readiness.evidenceType -contains 'manual_readthrough') -Message "Manual-reviewed component missing manual_readthrough evidence type for $($component.name)"
    foreach ($evidenceRef in $layers.provenance.manualDecision.evidenceRefs) {
      if ([string]$evidenceRef -like 'projects/ui-patterns/*') {
        $evidenceRefPath = Join-Path $workspaceRoot ([string]$evidenceRef).Replace('/', '\\')
        Assert-Condition -Condition (Test-Path -LiteralPath $evidenceRefPath) -Message "Manual evidenceRef does not exist for $($component.name): $evidenceRef"
      }
    }
  } else {
    Assert-Condition -Condition ($layers.provenance.manualReviewed -eq $false) -Message "Non-manual component incorrectly marked manualReviewed for $($component.name)"
    Assert-Condition -Condition ($layers.criticalReview.reviewMethod -eq 'heuristic_profile_inference') -Message "Non-manual component has non-heuristic reviewMethod for $($component.name)"
    Assert-Condition -Condition ($null -eq $layers.provenance.manualDecision) -Message "Non-manual component should not have manualDecision for $($component.name)"
    Assert-Condition -Condition ($layers.readiness.evidenceType -contains 'taxonomy_inferred') -Message "Non-manual component missing taxonomy_inferred evidence type for $($component.name)"
    Assert-Condition -Condition ($layers.readiness.evidenceType -contains 'generator_heuristic') -Message "Non-manual component missing generator_heuristic evidence type for $($component.name)"
  }
  Assert-Condition -Condition ($layers.criticalReview.reviewedBy -in $allowedReviewedBy) -Message "criticalReview.reviewedBy mismatch for $($component.name)"
  Assert-Condition -Condition ($layers.criticalReview.criticalityScore -ge 1 -and $layers.criticalReview.criticalityScore -le 5) -Message "criticalityScore out of range for $($component.name)"
  Assert-Condition -Condition ($layers.criticalReview.criticalityAnchor -eq (Get-CriticalityAnchor -CriticalityScore ([int]$layers.criticalReview.criticalityScore))) -Message "criticalityAnchor mismatch for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.criticalReview.hardVerdict)) -Message "Missing criticalReview.hardVerdict for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.criticalReview.pushbackSummary)) -Message "Missing critical pushback summary for $($component.name)"
  Assert-Condition -Condition ($layers.criticalReview.specificPushback.Count -gt 0) -Message "Missing criticalReview.specificPushback for $($component.name)"
  Assert-Condition -Condition ($meta.reviewedBy -eq $layers.criticalReview.reviewedBy) -Message "decisionMetadataV2.reviewedBy mismatch for $($component.name)"

  Assert-Condition -Condition ($null -ne $meta.minimumSchema) -Message "Missing minimumSchema for $($component.name)"
  Assert-Condition -Condition ($meta.minimumSchema.name -eq $component.name) -Message "minimumSchema.name mismatch for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$component.reviewMethod)) -Message "Missing reviewMethod for $($component.name)"
  Assert-Condition -Condition ($component.reviewMethod -in $allowedReviewMethods) -Message "reviewMethod mismatch for $($component.name)"
  Assert-Condition -Condition ($component.exactNameExportKind -in @('named', 'alias', 'namespace', 'defaultAlias')) -Message "Unexpected exactNameExportKind for $($component.name): $($component.exactNameExportKind)"
  if ($component.exactNameExportKind -eq 'named') {
    Assert-Condition -Condition ([string]$component.exactNameSourceExport -ceq [string]$component.name) -Message "named exactName export must match component name exactly for $($component.name)"
  }
  if ($component.exactNameExportKind -eq 'alias') {
    Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$component.exactNameSourceExport)) -Message "alias exactName export missing source export for $($component.name)"
    Assert-Condition -Condition ([string]$component.exactNameSourceExport -notin @('*', 'default')) -Message "alias exactName export cannot use pseudo source for $($component.name)"
  }
  if ($component.exactNameExportKind -eq 'namespace') {
    Assert-Condition -Condition ([string]$component.exactNameSourceExport -eq '*') -Message "namespace exactName export must use '*' source for $($component.name)"
  }
  if ($component.exactNameExportKind -eq 'defaultAlias') {
    Assert-Condition -Condition ([string]$component.exactNameSourceExport -eq 'default') -Message "defaultAlias exactName export must use 'default' source for $($component.name)"
  }

  $expectedExactExportSnippet = Get-ExpectedExactExportSnippet -Component $component
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace($expectedExactExportSnippet)) -Message "Missing expected exact export snippet for $($component.name)"

  $byNameBarrelText = Get-FileTextCached -Path $byNameBarrelPath -Cache $generatedFileCache
  Assert-Condition -Condition ($byNameBarrelText.Contains($expectedExactExportSnippet)) -Message "by-name barrel missing expected export snippet for $($component.name)"

  $shelfComponentsPath = Join-Path $UiLabRoot ("library\shelves\{0}\components.ts" -f $component.shelfKey)
  $shelfComponentsText = Get-FileTextCached -Path $shelfComponentsPath -Cache $generatedFileCache
  Assert-Condition -Condition ($shelfComponentsText.Contains($expectedExactExportSnippet)) -Message "shelf components barrel missing expected export snippet for $($component.name)"

  foreach ($starterLaneKey in @($component.starterLaneKeys)) {
    $starterComponentsPath = Join-Path $UiLabRoot ("library\starter-lanes\{0}\components.ts" -f [string]$starterLaneKey)
    $starterComponentsText = Get-FileTextCached -Path $starterComponentsPath -Cache $generatedFileCache
    Assert-Condition -Condition ($starterComponentsText.Contains($expectedExactExportSnippet)) -Message "starter-lane components barrel missing expected export snippet for $($component.name) in $starterLaneKey"
  }

  if ($manualReviewLookup.ContainsKey($component.name)) {
    Assert-Condition -Condition ($component.reviewMethod -eq 'manual_readthrough') -Message "manual reviewMethod mismatch for $($component.name)"
    Assert-Condition -Condition ($component.manualReviewed -eq $true) -Message "manualReviewed mismatch for $($component.name)"
    Assert-Condition -Condition ($layers.eligibility.autonomyAllowance -ne 'auto_select') -Message "Manual-reviewed component should not be auto_select for $($component.name)"

    switch ([string]$layers.provenance.manualDecision.stance) {
      'do_not_default' {
        Assert-Condition -Condition ($layers.eligibility.autonomyAllowance -eq 'restricted') -Message "do_not_default must force restricted autonomy for $($component.name)"
        Assert-Condition -Condition ($layers.readiness.lifecycle -eq 'candidate') -Message "do_not_default must force candidate lifecycle for $($component.name)"
        Assert-Condition -Condition ($layers.eligibility.disallowedContexts -contains 'default_library_recommendations') -Message "do_not_default must disallow default_library_recommendations for $($component.name)"
      }
      'pilot_only' {
        Assert-Condition -Condition ($layers.eligibility.autonomyAllowance -eq 'restricted') -Message "pilot_only must force restricted autonomy for $($component.name)"
        Assert-Condition -Condition ($layers.readiness.lifecycle -eq 'candidate') -Message "pilot_only must force candidate lifecycle for $($component.name)"
      }
      'ship_guarded' {
        Assert-Condition -Condition ($layers.eligibility.autonomyAllowance -eq 'human_review_required') -Message "ship_guarded must require human review for $($component.name)"
      }
    }
  }
  Assert-Condition -Condition ($component.reviewedBy -in $allowedReviewedBy) -Message "reviewedBy mismatch for $($component.name)"
  Assert-Condition -Condition ($component.reviewedBy -eq $layers.criticalReview.reviewedBy) -Message "Top-level reviewedBy mismatch for $($component.name)"
  Assert-Condition -Condition ($component.reviewNotes.Count -gt 0) -Message "Missing reviewNotes for $($component.name)"

  $identityReviewSignals = @($layers.identity.reviewSignals | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
  Assert-Condition -Condition ($identityReviewSignals.Count -gt 0) -Message "Missing identity.reviewSignals for $($component.name)"
  $usageHints = @($layers.provenance.heuristicInputs.usageHints | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
  $sourceSignals = @($layers.provenance.heuristicInputs.sourceSignals | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

  if ($usageHints.Count -gt 0) {
    Assert-Condition -Condition ($identityReviewSignals -contains 'usage_hints') -Message "usageHints present without usage_hints review signal for $($component.name)"
  }

  if ($sourceSignals.Count -gt 0) {
    Assert-Condition -Condition ($identityReviewSignals -contains 'source_analysis') -Message "sourceSignals present without source_analysis review signal for $($component.name)"
  }

  if ($identityReviewSignals -contains 'usage_hints') {
    Assert-Condition -Condition ($usageHints.Count -gt 0) -Message "usage_hints review signal missing structured usageHints for $($component.name)"
  }

  if ($identityReviewSignals -contains 'source_analysis') {
    Assert-Condition -Condition ($sourceSignals.Count -gt 0) -Message "source_analysis review signal missing structured sourceSignals for $($component.name)"
  }

  $signalSummaryNote = @($component.reviewNotes | Where-Object { ([string]$_) -like 'Signals detected:*' } | Select-Object -First 1)
  Assert-Condition -Condition ($signalSummaryNote.Count -gt 0) -Message "Missing signal summary note for $($component.name)"

  if ($signalSummaryNote.Count -gt 0) {
    $signalSummaryValue = ([string]$signalSummaryNote[0]).Substring('Signals detected: '.Length).Trim()
    $expectedSignalSet = if ($signalSummaryValue -eq 'shelf_profile_only') {
      @('shelf_profile_only')
    } elseif ([string]::IsNullOrWhiteSpace($signalSummaryValue)) {
      @()
    } else {
      @($signalSummaryValue -split ',\s*')
    }

    $expectedSignalSet = @($expectedSignalSet | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
    Assert-Condition -Condition (($expectedSignalSet -join '|') -eq ($identityReviewSignals -join '|')) -Message "identity.reviewSignals mismatch reviewNotes summary for $($component.name)"
  }

  Assert-Condition -Condition ($null -ne $component.ranking) -Message "Missing ranking for $($component.name)"
  Assert-Condition -Condition ($component.ranking.globalRank -is [int] -or $component.ranking.globalRank -is [long]) -Message "Invalid globalRank for $($component.name)"
  Assert-Condition -Condition ($component.ranking.globalRank -ge 1 -and $component.ranking.globalRank -le $components.Count) -Message "globalRank out of range for $($component.name)"
  Assert-Condition -Condition ($globalRanks.Add([int]$component.ranking.globalRank)) -Message "Duplicate globalRank detected for $($component.name)"
  Assert-Condition -Condition ($component.ranking.selectionScore -ge 1 -and $component.ranking.selectionScore -le 5) -Message "selectionScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.riskAdjustedSelectionScore -ge 1 -and $component.ranking.riskAdjustedSelectionScore -le 5) -Message "riskAdjustedSelectionScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.trustScore -ge 1 -and $component.ranking.trustScore -le 5) -Message "trustScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.efficiencyScore -ge 1 -and $component.ranking.efficiencyScore -le 5) -Message "efficiencyScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.safetyScore -ge 1 -and $component.ranking.safetyScore -le 5) -Message "safetyScore out of range for $($component.name)"

  Assert-Condition -Condition ($componentRankingLookup.ContainsKey([string]$component.name)) -Message "Missing ranking summary entry for $($component.name)"
  $rankingSummary = $componentRankingLookup[[string]$component.name]
  Assert-Condition -Condition ($rankingSummary.globalRank -eq $component.ranking.globalRank) -Message "Ranking summary globalRank mismatch for $($component.name)"
  Assert-Condition -Condition ($rankingSummary.shelfRank -eq $component.ranking.shelfRank) -Message "Ranking summary shelfRank mismatch for $($component.name)"
  Assert-Condition -Condition ($rankingSummary.reviewedBy -eq $component.reviewedBy) -Message "Ranking summary reviewedBy mismatch for $($component.name)"

  $validated += 1
}

foreach ($manualReviewOverride in $manualReviewOverrides) {
  Assert-Condition -Condition ($validatedManualOverrides.Contains([string]$manualReviewOverride.name)) -Message "Manual override does not map to a component in registry: $($manualReviewOverride.name)"
}

Write-Host "Validated metadata v2 for $validated components in $RegistryPath"
