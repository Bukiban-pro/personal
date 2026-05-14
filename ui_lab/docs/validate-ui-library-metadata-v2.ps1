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

Assert-Condition -Condition (Test-Path -LiteralPath $RegistryPath) -Message "Registry not found: $RegistryPath"
Assert-Condition -Condition (Test-Path -LiteralPath $ComponentMetadataPath) -Message "Component metadata not found: $ComponentMetadataPath"
Assert-Condition -Condition (Test-Path -LiteralPath $ComponentRankingsPath) -Message "Component rankings not found: $ComponentRankingsPath"

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
  Assert-Condition -Condition ($null -ne $layers.criticalReview) -Message "Missing layers.criticalReview for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.criticalReview.reviewMethod)) -Message "Missing criticalReview.reviewMethod for $($component.name)"
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
  } else {
    Assert-Condition -Condition ($layers.provenance.manualReviewed -eq $false) -Message "Non-manual component incorrectly marked manualReviewed for $($component.name)"
    Assert-Condition -Condition ($layers.criticalReview.reviewMethod -eq 'inferred_readthrough') -Message "Non-manual component has non-inferred reviewMethod for $($component.name)"
    Assert-Condition -Condition ($null -eq $layers.provenance.manualDecision) -Message "Non-manual component should not have manualDecision for $($component.name)"
  }
  Assert-Condition -Condition ($layers.criticalReview.reviewedBy -in @('GitHub Copilot', 'GitHub Copilot manual readthrough')) -Message "criticalReview.reviewedBy mismatch for $($component.name)"
  Assert-Condition -Condition ($layers.criticalReview.criticalityScore -ge 1 -and $layers.criticalReview.criticalityScore -le 5) -Message "criticalityScore out of range for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.criticalReview.hardVerdict)) -Message "Missing criticalReview.hardVerdict for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$layers.criticalReview.pushbackSummary)) -Message "Missing critical pushback summary for $($component.name)"
  Assert-Condition -Condition ($layers.criticalReview.specificPushback.Count -gt 0) -Message "Missing criticalReview.specificPushback for $($component.name)"

  Assert-Condition -Condition ($null -ne $meta.minimumSchema) -Message "Missing minimumSchema for $($component.name)"
  Assert-Condition -Condition ($meta.minimumSchema.name -eq $component.name) -Message "minimumSchema.name mismatch for $($component.name)"
  Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$component.reviewMethod)) -Message "Missing reviewMethod for $($component.name)"
  Assert-Condition -Condition ($component.reviewMethod -in @('inferred_readthrough', 'manual_readthrough')) -Message "reviewMethod mismatch for $($component.name)"
  if ($manualReviewLookup.ContainsKey($component.name)) {
    Assert-Condition -Condition ($component.reviewMethod -eq 'manual_readthrough') -Message "manual reviewMethod mismatch for $($component.name)"
    Assert-Condition -Condition ($component.manualReviewed -eq $true) -Message "manualReviewed mismatch for $($component.name)"
  }
  Assert-Condition -Condition ($component.reviewedBy -in @('GitHub Copilot', 'GitHub Copilot manual readthrough')) -Message "reviewedBy mismatch for $($component.name)"
  Assert-Condition -Condition ($component.reviewNotes.Count -gt 0) -Message "Missing reviewNotes for $($component.name)"
  Assert-Condition -Condition ($null -ne $component.ranking) -Message "Missing ranking for $($component.name)"
  Assert-Condition -Condition ($component.ranking.globalRank -is [int] -or $component.ranking.globalRank -is [long]) -Message "Invalid globalRank for $($component.name)"
  Assert-Condition -Condition ($component.ranking.globalRank -ge 1 -and $component.ranking.globalRank -le $components.Count) -Message "globalRank out of range for $($component.name)"
  Assert-Condition -Condition ($globalRanks.Add([int]$component.ranking.globalRank)) -Message "Duplicate globalRank detected for $($component.name)"
  Assert-Condition -Condition ($component.ranking.selectionScore -ge 1 -and $component.ranking.selectionScore -le 5) -Message "selectionScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.riskAdjustedSelectionScore -ge 1 -and $component.ranking.riskAdjustedSelectionScore -le 5) -Message "riskAdjustedSelectionScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.trustScore -ge 1 -and $component.ranking.trustScore -le 5) -Message "trustScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.efficiencyScore -ge 1 -and $component.ranking.efficiencyScore -le 5) -Message "efficiencyScore out of range for $($component.name)"
  Assert-Condition -Condition ($component.ranking.safetyScore -ge 1 -and $component.ranking.safetyScore -le 5) -Message "safetyScore out of range for $($component.name)"

  $validated += 1
}

foreach ($manualReviewOverride in $manualReviewOverrides) {
  Assert-Condition -Condition ($validatedManualOverrides.Contains([string]$manualReviewOverride.name)) -Message "Manual override does not map to a component in registry: $($manualReviewOverride.name)"
}

Write-Host "Validated metadata v2 for $validated components in $RegistryPath"
