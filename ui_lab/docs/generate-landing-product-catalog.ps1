param(
  [string]$HandoffPath = (Join-Path $PSScriptRoot "..\HANDOFF_UI_MINING_2026-05-06.md"),
  [string]$ComponentsPath = (Join-Path $PSScriptRoot "..\components"),
  [string]$GuideOutputPath = (Join-Path $PSScriptRoot "LANDING_PRODUCT_LIBRARY_GUIDE.md"),
  [string]$RegistryOutputPath = (Join-Path $PSScriptRoot "..\configs\landing-product-registry.json")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Convert-ToSlug {
  param([Parameter(Mandatory = $true)][string]$Text)

  $slug = $Text.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
  return $slug.Trim("-")
}

function Join-CodeList {
  param([string[]]$Items)

  if (-not $Items -or $Items.Count -eq 0) {
    return "None"
  }

  return (($Items | ForEach-Object { "``$_``" }) -join ", ")
}

function Assert-Condition {
  param(
    [Parameter(Mandatory = $true)][bool]$Condition,
    [Parameter(Mandatory = $true)][string]$Message
  )

  if (-not $Condition) {
    throw $Message
  }
}

$lines = Get-Content -LiteralPath $HandoffPath

$snapshotTotalComponents = 0
$snapshotLandingComponents = 0

foreach ($line in $lines) {
  if ($line -match "^- Components folder total files: (\d+)$") {
    $snapshotTotalComponents = [int]$Matches[1]
  }

  if ($line -match "^- LandingProduct components: (\d+)$") {
    $snapshotLandingComponents = [int]$Matches[1]
  }
}

Assert-Condition -Condition ($snapshotTotalComponents -gt 0) -Message "Could not find total component count in handoff."
Assert-Condition -Condition ($snapshotLandingComponents -gt 0) -Message "Could not find LandingProduct component count in handoff."

$waves = [System.Collections.Generic.List[object]]::new()
$currentWave = $null
$inWaveInventory = $false

foreach ($line in $lines) {
  if ($line -eq "## What Was Added In Recent Waves") {
    $inWaveInventory = $true
    continue
  }

  if (-not $inWaveInventory) {
    continue
  }

  if ($line -like "## Validation State*") {
    break
  }

  if ($line -match "^### (.+)$") {
    if ($null -ne $currentWave) {
      $waves.Add([pscustomobject]@{
        key = $currentWave.key
        label = $currentWave.label
        components = @($currentWave.components)
      })
    }

    $currentWave = @{
      key = Convert-ToSlug -Text $Matches[1]
      label = $Matches[1]
      components = [System.Collections.Generic.List[string]]::new()
    }

    continue
  }

  if (($null -ne $currentWave) -and $line -match "^- (LandingProduct.+)\.tsx$") {
    $currentWave.components.Add($Matches[1])
  }
}

if ($null -ne $currentWave) {
  $waves.Add([pscustomobject]@{
    key = $currentWave.key
    label = $currentWave.label
    components = @($currentWave.components)
  })
}

Assert-Condition -Condition ($waves.Count -gt 0) -Message "No LandingProduct wave inventory could be parsed from the handoff."

$allComponentFiles = @(Get-ChildItem -LiteralPath $ComponentsPath -File)
$landingFiles = @(Get-ChildItem -LiteralPath $ComponentsPath -File -Filter "LandingProduct*.tsx")

Assert-Condition -Condition ($allComponentFiles.Count -eq $snapshotTotalComponents) -Message "Total component count mismatch. Handoff says $snapshotTotalComponents but components folder has $($allComponentFiles.Count)."
Assert-Condition -Condition ($landingFiles.Count -eq $snapshotLandingComponents) -Message "LandingProduct count mismatch. Handoff says $snapshotLandingComponents but components folder has $($landingFiles.Count)."

$inventoryComponentNames = @($waves | ForEach-Object { $_.components })
$inventoryUnique = @($inventoryComponentNames | Sort-Object -Unique)
$fileUnique = @($landingFiles.BaseName | Sort-Object -Unique)

Assert-Condition -Condition ($inventoryComponentNames.Count -eq $snapshotLandingComponents) -Message "Wave inventory count mismatch. Parsed $($inventoryComponentNames.Count) LandingProduct items but snapshot says $snapshotLandingComponents."
Assert-Condition -Condition ($inventoryUnique.Count -eq $fileUnique.Count) -Message "Unique LandingProduct count mismatch between wave inventory and file system."

$missingFromInventory = @(Compare-Object -ReferenceObject $fileUnique -DifferenceObject $inventoryUnique | Where-Object { $_.SideIndicator -eq "<=" } | Select-Object -ExpandProperty InputObject)
$missingFromDisk = @(Compare-Object -ReferenceObject $fileUnique -DifferenceObject $inventoryUnique | Where-Object { $_.SideIndicator -eq "=>" } | Select-Object -ExpandProperty InputObject)

Assert-Condition -Condition ($missingFromInventory.Count -eq 0) -Message "LandingProduct files missing from wave inventory: $($missingFromInventory -join ", ")"
Assert-Condition -Condition ($missingFromDisk.Count -eq 0) -Message "Wave inventory references files not found on disk: $($missingFromDisk -join ", ")"

$waveLookup = @{}
foreach ($wave in $waves) {
  $waveLookup[$wave.key] = $wave
}

$chapterBlueprints = @(
  @{
    key = "conversion-proof"
    label = "Conversion and Proof"
    description = "Start here for sane landing pages: proof, comparison, metrics, pricing, objections, and direct conversion scaffolding."
    waveKeys = @(
      "landing-product-legacy-foundation",
      "landing-product-core-expansion",
      "landing-product-conversion-layer",
      "landing-product-trust-objection-layer",
      "post-handoff-conversion-expansion"
    )
    highlights = @(
      "LandingProductProof",
      "LandingProductComparison",
      "LandingProductMetrics",
      "LandingProductFeatureMatrix",
      "LandingProductSocialProof",
      "LandingProductPricingComparison",
      "LandingProductCTAStack",
      "LandingProductComparisonChecklist"
    )
  },
  @{
    key = "enterprise-buying"
    label = "Enterprise Buying"
    description = "Use this chapter when the page has to survive procurement, security review, rollout friction, and buyer-committee scrutiny."
    waveKeys = @(
      "post-handoff-buyer-ops-expansion",
      "post-handoff-enterprise-edge-expansion",
      "post-handoff-all-aspects-expansion",
      "post-handoff-threshold-expansion"
    )
    highlights = @(
      "LandingProductTechnicalValidation",
      "LandingProductGovernanceModel",
      "LandingProductBusinessCaseBuilder",
      "LandingProductExecutiveReviewPack",
      "LandingProductRegionalRollout",
      "LandingProductCustomerReferenceProgram",
      "LandingProductEnterpriseReadiness",
      "LandingProductEvaluationCriteria"
    )
  },
  @{
    key = "adoption-operations"
    label = "Adoption and Operations"
    description = "Pull from this chapter for onboarding, enablement, QBR, renewal, account planning, change management, and operating rhythm."
    waveKeys = @(
      "post-handoff-retention-enablement-expansion",
      "post-handoff-ops-depth-expansion",
      "post-handoff-design-depth-expansion"
    )
    highlights = @(
      "LandingProductOnboardingChecklist",
      "LandingProductEnablementTracks",
      "LandingProductAdoptionMilestones",
      "LandingProductQBRFramework",
      "LandingProductCustomerHealth",
      "LandingProductAccountPlanning",
      "LandingProductGovernanceCalendar",
      "LandingProductOperatingRhythm"
    )
  },
  @{
    key = "narrative-systems"
    label = "Narrative Systems"
    description = "This is the bridge from ordinary SaaS sections into operating-model, storyline, topology, and executive-systems language."
    waveKeys = @(
      "post-handoff-narrative-systems-expansion",
      "post-handoff-orchestration-systems-expansion",
      "post-handoff-architecture-systems-expansion",
      "post-handoff-radical-systems-expansion",
      "post-handoff-control-surface-expansion",
      "post-handoff-topology-control-expansion",
      "post-handoff-system-wave-expansion"
    )
    highlights = @(
      "LandingProductExecutiveNarrative",
      "LandingProductOperatingModel",
      "LandingProductStoryArchitecture",
      "LandingProductOperatingCanvas",
      "LandingProductNarrativeBriefing",
      "LandingProductTrustCommandCenter",
      "LandingProductExecutionAtlas",
      "LandingProductOperatingSystem"
    )
  },
  @{
    key = "runtime-frontier"
    label = "Runtime Frontier"
    description = "Treat this as a specialized layer. It is powerful, but it should be used intentionally after the page already has clear business structure."
    waveKeys = @(
      "post-handoff-protocol-primitives-expansion",
      "post-handoff-harsher-primitives-expansion",
      "post-handoff-runtime-frontier-expansion",
      "post-handoff-compiler-systems-expansion",
      "post-handoff-interpreter-runtime-expansion",
      "post-handoff-extreme-systems-expansion",
      "post-handoff-protocol-pressure-expansion"
    )
    highlights = @(
      "LandingProductTrustProtocol",
      "LandingProductRecoveryWorkbench",
      "LandingProductProtocolEngine",
      "LandingProductDecisionCompiler",
      "LandingProductOperatingRuntime",
      "LandingProductTrustCompiler",
      "LandingProductInfluenceProtocol",
      "LandingProductConfidenceRuntime"
    )
  },
  @{
    key = "ritual-finale"
    label = "Ritual Finale"
    description = "These are the sharpest page-scale surfaces: command rooms, archives, bridges, cartography, councils, dossiers, ceremony, and boardroom systems."
    waveKeys = @(
      "post-handoff-control-breakout-expansion",
      "post-handoff-command-surface-expansion",
      "post-handoff-structural-breakout-expansion",
      "post-handoff-cartography-terminal-expansion",
      "post-handoff-ritual-systems-finale"
    )
    highlights = @(
      "LandingProductCommandSurface",
      "LandingProductTrustRegistry",
      "LandingProductExecutiveBridge",
      "LandingProductProofCartography",
      "LandingProductDecisionTerminal",
      "LandingProductBoardroomSystem",
      "LandingProductTrustDossier",
      "LandingProductStoryCeremony"
    )
  }
)

$assignedWaveKeys = @($chapterBlueprints | ForEach-Object { $_.waveKeys })
$duplicateAssignments = @($assignedWaveKeys | Group-Object | Where-Object { $_.Count -gt 1 } | Select-Object -ExpandProperty Name)
$unassignedWaveKeys = @((Compare-Object -ReferenceObject ($waves.key | Sort-Object) -DifferenceObject ($assignedWaveKeys | Sort-Object -Unique) | Where-Object { $_.SideIndicator -eq "<=" } | Select-Object -ExpandProperty InputObject))

Assert-Condition -Condition ($duplicateAssignments.Count -eq 0) -Message "Chapter mapping assigns the same wave more than once: $($duplicateAssignments -join ", ")"
Assert-Condition -Condition ($unassignedWaveKeys.Count -eq 0) -Message "Chapter mapping is missing waves: $($unassignedWaveKeys -join ", ")"

$chapters = foreach ($chapter in $chapterBlueprints) {
  $chapterWaves = foreach ($waveKey in $chapter.waveKeys) {
    Assert-Condition -Condition ($waveLookup.ContainsKey($waveKey)) -Message "Chapter '$($chapter.label)' references unknown wave '$waveKey'."
    $waveLookup[$waveKey]
  }

  $chapterComponents = @($chapterWaves | ForEach-Object { $_.components })
  $chapterUniqueComponents = @($chapterComponents | Sort-Object -Unique)
  $invalidHighlights = @($chapter.highlights | Where-Object { $_ -notin $chapterUniqueComponents })

  Assert-Condition -Condition ($invalidHighlights.Count -eq 0) -Message "Chapter '$($chapter.label)' has highlights outside its own component set: $($invalidHighlights -join ", ")"

  [pscustomobject]@{
    key = $chapter.key
    label = $chapter.label
    description = $chapter.description
    waveKeys = @($chapter.waveKeys)
    waveLabels = @($chapterWaves | ForEach-Object { $_.label })
    count = $chapterUniqueComponents.Count
    highlights = @($chapter.highlights)
    components = @($chapterUniqueComponents)
  }
}

$starterKitBlueprints = @(
  @{
    key = "fast-proof-page"
    label = "Fast Proof Page"
    useWhen = "You need a credible first-pass landing page without drifting into ornamental systems language."
    chapterKey = "conversion-proof"
    caution = "Keep this lean. Six to eight sections is enough for a first useful composition."
    components = @(
      "LandingProductProof",
      "LandingProductComparison",
      "LandingProductMetrics",
      "LandingProductFeatureMatrix",
      "LandingProductSocialProof",
      "LandingProductPricingComparison",
      "LandingProductCTAStack",
      "LandingProductFAQColumns"
    )
  },
  @{
    key = "enterprise-deal-room"
    label = "Enterprise Deal Room"
    useWhen = "You need one page that can support procurement, security, technical validation, and executive review at the same time."
    chapterKey = "enterprise-buying"
    caution = "Do not ship every enterprise block. Pick the pressure points that actually block the deal."
    components = @(
      "LandingProductSecurityCompliance",
      "LandingProductTechnicalValidation",
      "LandingProductBusinessCaseBuilder",
      "LandingProductProcurementPack",
      "LandingProductGovernanceModel",
      "LandingProductExecutiveReviewPack",
      "LandingProductDecisionBoard",
      "LandingProductProofCartography"
    )
  },
  @{
    key = "adoption-expansion-loop"
    label = "Adoption and Expansion Loop"
    useWhen = "You need a customer-facing or internal success narrative that connects onboarding, adoption, renewal, and expansion."
    chapterKey = "adoption-operations"
    caution = "Resist adding buyer-stage sections here. This kit should feel post-sale and operational."
    components = @(
      "LandingProductOnboardingChecklist",
      "LandingProductEnablementTracks",
      "LandingProductAdoptionDashboard",
      "LandingProductQBRFramework",
      "LandingProductRenewalSignals",
      "LandingProductExpansionScorecard",
      "LandingProductCustomerHealth",
      "LandingProductAdvocacyLoop"
    )
  },
  @{
    key = "operating-system-page"
    label = "Operating System Page"
    useWhen = "You want the product to read like an operating model, not just a feature list."
    chapterKey = "narrative-systems"
    caution = "Use one governing metaphor. Mixing too many system metaphors makes the page feel self-impressed."
    components = @(
      "LandingProductOperatingModel",
      "LandingProductDecisionLedger",
      "LandingProductOwnershipGrid",
      "LandingProductOperatingCanvas",
      "LandingProductSignalStudio",
      "LandingProductExecutionBoard",
      "LandingProductTrustCommandCenter",
      "LandingProductOperatingSystem"
    )
  },
  @{
    key = "boardroom-finale"
    label = "Boardroom Finale"
    useWhen = "You need a high-conviction executive page and you are willing to be selective and disciplined with theatrical surfaces."
    chapterKey = "ritual-finale"
    caution = "This is the sharpest aesthetic layer. Use it only after the underlying buying story is already clear."
    components = @(
      "LandingProductExecutiveBridge",
      "LandingProductCommandBriefing",
      "LandingProductBoardroomSystem",
      "LandingProductDecisionCouncil",
      "LandingProductTrustDossier",
      "LandingProductSignalChamber",
      "LandingProductStoryBoardroom",
      "LandingProductStoryCeremony"
    )
  }
)

$allInventoryNames = @($waves | ForEach-Object { $_.components })
$starterKits = foreach ($starterKit in $starterKitBlueprints) {
  $unknownComponents = @($starterKit.components | Where-Object { $_ -notin $allInventoryNames })

  Assert-Condition -Condition ($unknownComponents.Count -eq 0) -Message "Starter kit '$($starterKit.label)' references unknown components: $($unknownComponents -join ", ")"
  Assert-Condition -Condition (($chapters.key) -contains $starterKit.chapterKey) -Message "Starter kit '$($starterKit.label)' references unknown chapter '$($starterKit.chapterKey)'."

  [pscustomobject]@{
    key = $starterKit.key
    label = $starterKit.label
    useWhen = $starterKit.useWhen
    chapterKey = $starterKit.chapterKey
    caution = $starterKit.caution
    components = @($starterKit.components)
  }
}

$registry = [pscustomobject]@{
  generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
  source = [pscustomobject]@{
    handoff = "ui_lab/HANDOFF_UI_MINING_2026-05-06.md"
    components = "ui_lab/components"
    generator = "ui_lab/docs/generate-landing-product-catalog.ps1"
  }
  stats = [pscustomobject]@{
    totalComponents = $snapshotTotalComponents
    landingProductComponents = $snapshotLandingComponents
    waveCount = $waves.Count
    chapterCount = $chapters.Count
    starterKitCount = $starterKits.Count
  }
  qa = [pscustomobject]@{
    snapshotMatchesFileSystem = $true
    waveInventoryMatchesFileSystem = $true
    everyWaveAssignedToOneChapter = $true
    starterKitsReferenceExistingComponents = $true
  }
  waves = @($waves | ForEach-Object {
    [pscustomobject]@{
      key = $_.key
      label = $_.label
      count = $_.components.Count
      components = @($_.components)
    }
  })
  chapters = @($chapters)
  starterKits = @($starterKits)
}

$registryDirectory = Split-Path -Parent $RegistryOutputPath
if (-not (Test-Path -LiteralPath $registryDirectory)) {
  New-Item -ItemType Directory -Path $registryDirectory -Force | Out-Null
}

$registry | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $RegistryOutputPath -Encoding utf8

$guideLines = [System.Collections.Generic.List[string]]::new()
$guideLines.Add("# LandingProduct Library Guide")
$guideLines.Add("")
$guideLines.Add("This file turns the LandingProduct archive into a usable library. Start here, not in the raw components folder.")
$guideLines.Add("")
$guideLines.Add("## Current Snapshot")
$guideLines.Add("- Total component files: $snapshotTotalComponents")
$guideLines.Add("- LandingProduct components: $snapshotLandingComponents")
$guideLines.Add('- Parent guide: `ui_lab/docs/UI_LAB_LIBRARY_GUIDE.md`')
$guideLines.Add('- Repo-level registry: `ui_lab/configs/ui-lab-registry.json`')
$guideLines.Add('- Source of truth: `ui_lab/HANDOFF_UI_MINING_2026-05-06.md`')
$guideLines.Add('- Machine-readable registry: `ui_lab/configs/landing-product-registry.json`')
$guideLines.Add('- Generator: `ui_lab/docs/generate-landing-product-catalog.ps1`')
$guideLines.Add("")
$guideLines.Add("## Operating Rules")
$guideLines.Add("1. Do not start in the runtime frontier unless the page already has a clean business story.")
$guideLines.Add("2. Pick one chapter first, then pull a starter kit, then add only the few extra sections the page really earns.")
$guideLines.Add("3. Keep one governing metaphor per page. Mixing boardroom, compiler, theater, radar, and atlas language all at once weakens the page.")
$guideLines.Add("4. Cap the first composition at 6-8 sections. A library becomes a pile the moment every page tries to show off everything.")
$guideLines.Add("")
$guideLines.Add("## Starter Kits")

foreach ($starterKit in $starterKits) {
  $guideLines.Add("")
  $guideLines.Add("### $($starterKit.label)")
  $guideLines.Add("- Use when: $($starterKit.useWhen)")
  $guideLines.Add([string]::Format('- Chapter: `{0}`', $starterKit.chapterKey))
  $guideLines.Add("- Components: $(Join-CodeList -Items $starterKit.components)")
  $guideLines.Add("- Caution: $($starterKit.caution)")
}

$guideLines.Add("")
$guideLines.Add("## Library Chapters")

foreach ($chapter in $chapters) {
  $guideLines.Add("")
  $guideLines.Add("### $($chapter.label) ($($chapter.count))")
  $guideLines.Add("- Description: $($chapter.description)")
  $guideLines.Add("- Waves: $(Join-CodeList -Items $chapter.waveLabels)")
  $guideLines.Add("- Good first picks: $(Join-CodeList -Items $chapter.highlights)")
}

$guideLines.Add("")
$guideLines.Add("## QA Status")
$guideLines.Add('- Snapshot counts match the actual `ui_lab/components` folder.')
$guideLines.Add('- Every `LandingProduct*.tsx` file is represented in the wave inventory.')
$guideLines.Add("- Every wave is assigned to exactly one top-level chapter.")
$guideLines.Add("- Every starter kit references existing components only.")
$guideLines.Add("")
$guideLines.Add("## Refresh Command")
$guideLines.Add('```powershell')
$guideLines.Add("Set-Location 'c:\Users\Bukanto\Downloads\pp\personal'")
$guideLines.Add(".\ui_lab\docs\generate-landing-product-catalog.ps1")
$guideLines.Add('```')

$guideDirectory = Split-Path -Parent $GuideOutputPath
if (-not (Test-Path -LiteralPath $guideDirectory)) {
  New-Item -ItemType Directory -Path $guideDirectory -Force | Out-Null
}

$guideLines | Set-Content -LiteralPath $GuideOutputPath -Encoding utf8

Write-Host "Generated registry: $RegistryOutputPath"
Write-Host "Generated guide: $GuideOutputPath"