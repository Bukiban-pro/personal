param(
  [string]$UiLabRoot = (Join-Path $PSScriptRoot ".."),
  [string]$GuideOutputPath = (Join-Path $PSScriptRoot "UI_LAB_LIBRARY_GUIDE.md"),
  [string]$QueueOutputPath = (Join-Path $PSScriptRoot "UI_LAB_CURATION_QUEUE.md"),
  [string]$RegistryOutputPath = (Join-Path $PSScriptRoot "..\configs\ui-lab-registry.json"),
  [string]$MetadataProfilesOutputPath = (Join-Path $PSScriptRoot "..\configs\ui-library-metadata-v2-profiles.json"),
  [string]$ComponentMetadataOutputPath = (Join-Path $PSScriptRoot "..\configs\ui-library-component-metadata-v2.json"),
  [string]$ComponentRankingsOutputPath = (Join-Path $PSScriptRoot "..\configs\ui-library-component-rankings-v2.json"),
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

function Join-CodeList {
  param([string[]]$Items)

  if (-not $Items -or $Items.Count -eq 0) {
    return "None"
  }

  return (($Items | ForEach-Object { "``$_``" }) -join ", ")
}

function New-GuideLine {
  param(
    [Parameter(Mandatory = $true)][string]$Template,
    [Parameter(ValueFromRemainingArguments = $true)][object[]]$Arguments
  )

  return [string]::Format($Template, $Arguments)
}

function Merge-ObjectProperties {
  param(
    [Parameter(Mandatory = $true)][object]$Target,
    [Parameter(Mandatory = $true)][object]$Source
  )

  foreach ($property in $Source.PSObject.Properties) {
    if ($Target -is [hashtable]) {
      $Target[$property.Name] = $property.Value
    } elseif ($Target.PSObject.Properties.Name -contains $property.Name) {
      $Target.$($property.Name) = $property.Value
    } else {
      $Target | Add-Member -NotePropertyName $property.Name -NotePropertyValue $property.Value -Force
    }
  }
}

function Convert-ToPascalCase {
  param([Parameter(Mandatory = $true)][string]$Text)

  return (($Text -split '[^A-Za-z0-9]+') | Where-Object { $_ } | ForEach-Object {
    if ($_.Length -eq 1) { $_.ToUpperInvariant() } else { $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1) }
  }) -join ''
}

function Get-NamingRecommendation {
  param([Parameter(Mandatory = $true)][string]$Signal)

  switch ($Signal) {
    'Component' {
      return [pscustomobject]@{
        priority = 'High'
        action = 'Prefer a sharper semantic name or document the exact split between the generic and specific variant.'
        rationale = 'The Component suffix adds almost no meaning and is the easiest way for a library to feel generic.'
      }
    }
    'Explorer' {
      return [pscustomobject]@{
        priority = 'High'
        action = 'Document the explorer as the full interactive variant and keep the base name for the simpler tree surface only.'
        rationale = 'Explorer implies a materially richer interaction model than a plain tree.'
      }
    }
    'Bar' {
      return [pscustomobject]@{
        priority = 'High'
        action = 'Treat the bar as an explicit scroll-progress variant, not as another alias of the base component.'
        rationale = 'Bar and indicator variants should read as one family with explicit roles.'
      }
    }
    'Indicator' {
      return [pscustomobject]@{
        priority = 'High'
        action = 'Treat the indicator as an explicit variant and keep its API and docs separate from the base progress primitive.'
        rationale = 'Indicator is a semantic role, not a cosmetic suffix.'
      }
    }
    'Effect' {
      return [pscustomobject]@{
        priority = 'Medium'
        action = 'Keep the base component as primary and document the effect file as a more decorative or specialized sibling.'
        rationale = 'Effect variants are valid, but they need explicit positioning so they do not compete with the base primitive.'
      }
    }
    'Mockup' {
      return [pscustomobject]@{
        priority = 'Medium'
        action = 'Reserve the mockup variant for framed showcase use and keep the base name for the underlying renderer.'
        rationale = 'Mockup signals packaging and presentation, not the same usage tier as the base component.'
      }
    }
    'Collapsible' {
      return [pscustomobject]@{
        priority = 'Medium'
        action = 'Keep both only if the interaction model is materially different; otherwise this pair is a consolidation candidate.'
        rationale = 'A behavior suffix must earn its existence through real interaction differences.'
      }
    }
    'Band' {
      return [pscustomobject]@{
        priority = 'Medium'
        action = 'Document the band variant as a narrower layout treatment of the same content family.'
        rationale = 'Band implies a layout constraint rather than a different conceptual primitive.'
      }
    }
    'OnScroll' {
      return [pscustomobject]@{
        priority = 'Medium'
        action = 'Keep the trigger-specific variant only if scroll activation is the actual product difference, not just the implementation detail.'
        rationale = 'Trigger-based naming should map to a meaningful usage distinction.'
      }
    }
    default {
      return [pscustomobject]@{
        priority = 'Medium'
        action = 'Document the distinction explicitly or consolidate the pair if the split is weak.'
        rationale = 'Naming variants should create clarity, not extra guesswork.'
      }
    }
  }
}

function Get-TopLevelNamedExport {
  param([Parameter(Mandatory = $true)][string]$FilePath)

  $content = Get-Content -LiteralPath $FilePath -Raw
  $constMatch = [regex]::Match($content, 'export\s+const\s+([A-Za-z0-9_]+)\s*=')
  if ($constMatch.Success) {
    return $constMatch.Groups[1].Value
  }

  $functionMatch = [regex]::Match($content, 'export\s+function\s+([A-Za-z0-9_]+)\s*\(')
  if ($functionMatch.Success) {
    return $functionMatch.Groups[1].Value
  }

  return $null
}

function Get-TopLevelNamedExports {
  param([Parameter(Mandatory = $true)][string]$FilePath)

  $content = Get-Content -LiteralPath $FilePath -Raw
  $exports = [System.Collections.Generic.List[string]]::new()

  $addExport = {
    param([string]$Name)

    if ([string]::IsNullOrWhiteSpace($Name)) {
      return
    }

    if (-not $exports.Contains($Name)) {
      $exports.Add($Name)
    }
  }

  $patterns = @(
    'export\s+const\s+([A-Za-z0-9_]+)(?:\s*:[^=]+)?\s*=',
    'export\s+function\s+([A-Za-z0-9_]+)(?:\s*<[^\(]+>)?\s*\(',
    'export\s+class\s+([A-Za-z0-9_]+)\s+',
    'export\s+default\s+function\s+([A-Za-z0-9_]+)(?:\s*<[^\(]+>)?\s*\(',
    'export\s+default\s+class\s+([A-Za-z0-9_]+)\s+'
  )

  foreach ($pattern in $patterns) {
    foreach ($match in [regex]::Matches($content, $pattern)) {
      & $addExport $match.Groups[1].Value
    }
  }

  foreach ($match in [regex]::Matches($content, 'export\s*\{([^}]+)\}')) {
    $members = $match.Groups[1].Value -split ','
    foreach ($member in $members) {
      $candidate = $member.Trim()
      if (-not $candidate -or $candidate -match '^type\s+') {
        continue
      }

      if ($candidate -match '^(?<source>[A-Za-z0-9_]+)\s+as\s+(?<alias>[A-Za-z0-9_]+)$') {
        & $addExport $matches['alias']
        continue
      }

      if ($candidate -match '^[A-Za-z0-9_]+$') {
        & $addExport $candidate
      }
    }
  }

  return @($exports)
}

function Resolve-PrimaryNamedExport {
  param(
    [Parameter(Mandatory = $true)][string]$FileBaseName,
    [AllowEmptyCollection()][string[]]$NamedExports
  )

  foreach ($name in $NamedExports) {
    if ($name -ieq $FileBaseName) {
      return $name
    }
  }

  if ($NamedExports.Count -eq 1) {
    return $NamedExports[0]
  }

  return $null
}

function Get-IdentifierTokens {
  param([Parameter(Mandatory = $true)][string]$Text)

  $spaced = [regex]::Replace($Text, '([A-Z]+)([A-Z][a-z])', '$1 $2')
  $spaced = [regex]::Replace($spaced, '([a-z0-9])([A-Z])', '$1 $2')

  return @(($spaced -split '[^A-Za-z0-9]+') | Where-Object { $_ } | ForEach-Object { $_.ToLowerInvariant() })
}

function Get-ExportRelevanceScore {
  param(
    [Parameter(Mandatory = $true)][string]$FileBaseName,
    [Parameter(Mandatory = $true)][string]$ExportName
  )

  if ($ExportName -ieq $FileBaseName) {
    return 1000
  }

  $baseTokens = @(Get-IdentifierTokens -Text $FileBaseName)
  $exportTokens = @(Get-IdentifierTokens -Text $ExportName)
  $overlapCount = @(@($exportTokens | Where-Object { $baseTokens -contains $_ }) | Select-Object -Unique).Count
  $score = $overlapCount * 10

  if ($overlapCount -gt 0 -and $overlapCount -eq $baseTokens.Count) {
    $score += 20
  }

  if ($ExportName -cmatch '^[a-z]') {
    $score -= 15
  }

  return $score
}

function Get-NormalizedRelativePath {
  param(
    [Parameter(Mandatory = $true)][string]$BasePath,
    [Parameter(Mandatory = $true)][string]$TargetPath
  )

  $resolvedBasePath = [System.IO.Path]::GetFullPath($BasePath)
  $resolvedTargetPath = [System.IO.Path]::GetFullPath($TargetPath)

  if (-not $resolvedBasePath.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $resolvedBasePath += [System.IO.Path]::DirectorySeparatorChar
  }

  $baseUri = New-Object System.Uri($resolvedBasePath)
  $targetUri = New-Object System.Uri($resolvedTargetPath)
  $relativePath = [System.Uri]::UnescapeDataString($baseUri.MakeRelativeUri($targetUri).ToString())

  return ($relativePath -replace '\\', '/')
}

function Get-RelativeImportPath {
  param(
    [Parameter(Mandatory = $true)][string]$FromDirectory,
    [Parameter(Mandatory = $true)][string]$ToFilePath
  )

  $targetModulePath = [System.IO.Path]::ChangeExtension([System.IO.Path]::GetFullPath($ToFilePath), $null)
  $relativePath = Get-NormalizedRelativePath -BasePath $FromDirectory -TargetPath $targetModulePath

  if ($relativePath -match '^\.\.?/') {
    return $relativePath
  }

  return "./$relativePath"
}

function Get-PrimaryBarrelLines {
  param(
    [Parameter(Mandatory = $true)][AllowEmptyCollection()][object[]]$ComponentInfos,
    [Parameter(Mandatory = $true)][string]$BarrelDirectory
  )

  $lines = [System.Collections.Generic.List[string]]::new()

  foreach ($info in ($ComponentInfos | Sort-Object file)) {
    $modulePath = Get-RelativeImportPath -FromDirectory $BarrelDirectory -ToFilePath $info.sourceFilePath

    if ($info.resolvedPrimaryNamedExport) {
      $lines.Add((New-GuideLine 'export {{ {0} }} from "{1}";' $info.resolvedPrimaryNamedExport $modulePath))

      if ($info.resolvedPrimaryNamedExport -ne $info.file) {
        $lines.Add((New-GuideLine 'export {{ {0} as {1} }} from "{2}";' $info.resolvedPrimaryNamedExport $info.file $modulePath))
      }
      continue
    }

    if ($info.namedExports.Count -gt 0) {
      foreach ($namedExport in $info.namedExports) {
        if ($namedExport -eq $info.file) {
          $lines.Add((New-GuideLine 'export {{ {0} }} from "{1}";' $namedExport $modulePath))
        } else {
          $lines.Add((New-GuideLine 'export {{ {0} }} from "{1}";' $namedExport $modulePath))
        }
      }
      $lines.Add((New-GuideLine 'export * as {0} from "{1}";' $info.file $modulePath))
      continue
    }

    if ($info.hasDefaultExport) {
      $lines.Add((New-GuideLine 'export {{ default as {0} }} from "{1}";' $info.file $modulePath))
      continue
    }

    $lines.Add((New-GuideLine '// No primary export detected for {0}; import from "{1}" directly if needed.' $info.file $modulePath))
  }

  return @($lines)
}

function Get-ExactNameExportInfo {
  param(
    [Parameter(Mandatory = $true)][psobject]$ComponentInfo,
    [Parameter(Mandatory = $true)][string]$BarrelDirectory
  )

  $modulePath = Get-RelativeImportPath -FromDirectory $BarrelDirectory -ToFilePath $ComponentInfo.sourceFilePath

  if ($ComponentInfo.resolvedPrimaryNamedExport) {
    if ($ComponentInfo.resolvedPrimaryNamedExport -eq $ComponentInfo.file) {
      return [pscustomobject]@{
        exportKind = 'named'
        sourceExport = $ComponentInfo.file
        line = (New-GuideLine 'export {{ {0} }} from "{1}";' $ComponentInfo.file $modulePath)
      }
    }

    return [pscustomobject]@{
      exportKind = 'alias'
      sourceExport = $ComponentInfo.resolvedPrimaryNamedExport
      line = (New-GuideLine 'export {{ {0} as {1} }} from "{2}";' $ComponentInfo.resolvedPrimaryNamedExport $ComponentInfo.file $modulePath)
    }
  }

  if ($ComponentInfo.namedExports.Count -gt 0) {
    return [pscustomobject]@{
      exportKind = 'namespace'
      sourceExport = '*'
      line = (New-GuideLine 'export * as {0} from "{1}";' $ComponentInfo.file $modulePath)
    }
  }

  if ($ComponentInfo.hasDefaultExport) {
    return [pscustomobject]@{
      exportKind = 'defaultAlias'
      sourceExport = 'default'
      line = (New-GuideLine 'export {{ default as {0} }} from "{1}";' $ComponentInfo.file $modulePath)
    }
  }

  return [pscustomobject]@{
    exportKind = 'unresolved'
    sourceExport = $null
    line = (New-GuideLine '// No exact-name entrypoint detected for {0}; import from "{1}" directly if needed.' $ComponentInfo.file $modulePath)
  }
}

function Get-ExactNameBarrelLines {
  param(
    [Parameter(Mandatory = $true)][AllowEmptyCollection()][object[]]$ComponentInfos,
    [Parameter(Mandatory = $true)][string]$BarrelDirectory
  )

  return @(@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($ComponentInfos | Sort-Object file | ForEach-Object {
    (Get-ExactNameExportInfo -ComponentInfo $_ -BarrelDirectory $BarrelDirectory).line
  }))
}

function Get-ModuleExportInfo {
  param(
    [Parameter(Mandatory = $true)][System.IO.FileInfo]$File,
    [Parameter(Mandatory = $true)][string]$ComponentsRoot
  )

  $content = Get-Content -LiteralPath $File.FullName -Raw
  $allNamedExports = @(Get-TopLevelNamedExports -FilePath $File.FullName)
  $namedExports = @($allNamedExports | Where-Object {
    (Get-ExportRelevanceScore -FileBaseName $File.BaseName -ExportName $_) -gt 0
  })

  if ($namedExports.Count -eq 0) {
    $namedExports = $allNamedExports
  }

  $resolvedPrimaryNamedExport = if ($script:PrimaryExportOverrides.ContainsKey($File.BaseName)) {
    $script:PrimaryExportOverrides[$File.BaseName]
  } else {
    Resolve-PrimaryNamedExport -FileBaseName $File.BaseName -NamedExports $namedExports
  }

  $relativeComponentPath = Get-NormalizedRelativePath -BasePath $ComponentsRoot -TargetPath $File.FullName
  $physicalShelfMatch = [regex]::Match($relativeComponentPath, '^shelves/(?<shelfKey>[^/]+)/')
  $physicalShelfKey = if ($physicalShelfMatch.Success) { $physicalShelfMatch.Groups['shelfKey'].Value } else { $null }

  return [pscustomobject]@{
    file = $File.BaseName
    extension = $File.Extension
    sourceFilePath = $File.FullName
    relativeComponentPath = $relativeComponentPath
    physicalShelfKey = $physicalShelfKey
    namedExports = $namedExports
    resolvedPrimaryNamedExport = $resolvedPrimaryNamedExport
    hasDefaultExport = [regex]::IsMatch($content, 'export\s+default\s+')
  }
}

function Get-PrimaryShelfKey {
  param([Parameter(Mandatory = $true)][string]$Name)

  switch -Regex ($Name) {
    '^LandingProduct' { return 'landing-product-system' }
    '^(AnnouncementBanner|CTASection|FAQSection|FeatureGrid|FeatureShowcase|GenericLogo|GradientMeshHero|HeroSection|Landing(?!Product).+|LogoCloud|Newsletter|PricingCards|ProductSteps|ProjectShowcase|SocialProof|SplitHero|StatsGrid|TechStackGrid|TestimonialGrid|TextRotateHero|VideoHero|WelcomeSection)$' { return 'landing-marketing' }
    '^(AdvancedDataTable|AdvancedFilter|AdvancedTabs|BarChart|BentoGrid|DataTable|FileTree|FileTreeExplorer|GanttChart|GaugeChart|HeatmapVisualization|KPICard|LineChart|MetricsDashboard|NetworkGraph|NotificationCenter|PerformanceMonitor|RadarChart|ScrollProgress|ScrollProgressBar|ScrollProgressIndicator|StepIndicator|Stepper|Timeline|TimelineComponent)$' { return 'data-admin' }
    '^(AdvancedAutocomplete|BadgeInput|ColorPicker|DateRangePicker|DragDropZone|FileUpload|Form.+|InputAddon|MarkdownEditor|Pagination|QRCodeGenerator|ResizablePanel|RichTextEditor|SearchFilter|SignaturePad)$' { return 'forms-authoring' }
    '^(Alert|AuthRequiredModal|ConfirmDialog|CookieConsent|EmptyState|ErrorBoundary|ErrorState|Loader|Modal|OfflineBanner|OverlayLoader|PageLoading|PagePreloader|ScrollToTop|Skeleton|Toast|TopLoadingBar)$' { return 'feedback-state' }
    '^(Avatar|AvatarCircles|Badge|Divider|Menu|Popover|Sheet|StatusBadge|ThemeToggle|ToggleGroup|Tooltip)$' { return 'ui-primitives' }
    '^(Breadcrumbs|CommandMenu|CommandPalette|ContextMenu|Dock|FloatingNav|MegaMenu|MegaMenuComponent|MorphingNav|SideMenu|SlideTabs|StickyHeader)$' { return 'navigation-command' }
    '^(Animated.+|AuroraText|BlurFade|ComicText|CountUpStats|DiaTextReveal|FlipText|GlitchText|Highlighter|HighlightOnScroll|HyperText|KineticText|LineShadowText|LottieAnimation|Marquee|MorphingText|NumberTicker|PageTransition|ParallaxSection|RevealOnScroll|ScrollVelocity|SmoothCursor|SparklesText|SpinningText|StaggerAnimation|Text.+|TypingAnimation|TypingEffect|VideoText|WordRotate)$' { return 'motion-typography' }
    '^(AuroraBackground|AuroraBackgroundEffect|Backlight|BloomEffect|BorderBeam|BorderBeamEffect|ChromaticAberrationEffect|Confetti|ConfettiEffect|ConfettiExplosion|CoolMode|CursorFollower|DotPattern|DottedMap|FlickeringGrid|GlareHover|Globe|GradientBlobs|GridPattern|InteractiveGridPattern|Lens|LensMagnifier|MotionBlurEffect|MultiLayerParallax|MeshGradient|Meteors|NoiseOverlay|OrbitingCircles|Particles|Pointer|ProgressiveBlur|RetroGrid|Ripple|ShineBorder|SparklesEffect|Spotlight|SpotlightEffect|WarpBackground|WavyBackground|VHSEffect)$' { return 'backgrounds-effects' }
    '^(Accordion3D|AdvancedCarousel|AndroidMockup|CardImage|CodeBlock|CodeComparison|CodeEditor|ComparisonSlider|CurtainReveal|DraggableCards|ExpandableCard|FlipCard|FlipCardEffect|GlassmorphismCard|GlowCard|HeroVideoDialog|HolographicCard|HorizontalScrollSection|IconCloud|ImageGallery|ImageLightbox|ImageReveal|ImageWithFallback|InfiniteCarousel|InteractiveGrid|InteractiveHoverButton|Iphone|LazyLoadComponent|LazySection|LongPressDetector|MagicCard|MagneticButton|MagneticButtonEffect|NeonCard|NeonGradientCard|PinchZoom|PixelImage|ProductCarousel|ProgressRing|PulsatingButton|RainbowButton|RippleButton|Safari|SafariMockup|ScrollPinSection|ScrollSnapContainer|ScrollVideoPlayer|ShimmerButton|ShinyButton|SkillBars|SpotlightCards|StackedCards|StarRating|SwipeDetector|Terminal|TiltCard|TweetCard|ZoomHero)$' { return 'interactive-showcase' }
    default { return 'misc-uncurated' }
  }
}

function Copy-Hashtable {
  param([Parameter(Mandatory = $true)][hashtable]$InputObject)

  $copy = @{}
  foreach ($key in $InputObject.Keys) {
    $copy[$key] = $InputObject[$key]
  }

  return $copy
}

function Get-ComponentMetadataProfile {
  param(
    [Parameter(Mandatory = $true)][string]$ComponentName,
    [Parameter(Mandatory = $true)][string]$ShelfKey,
    [Parameter(Mandatory = $true)][hashtable]$Profiles
  )

  $profile = Copy-Hashtable -InputObject $Profiles[$ShelfKey]
  if (-not $profile) {
    $profile = Copy-Hashtable -InputObject $Profiles['default']
  }

  $signals = [System.Collections.Generic.List[string]]::new()

  function Add-Signal {
    param([string]$Signal)
    if (-not [string]::IsNullOrWhiteSpace($Signal) -and -not $signals.Contains($Signal)) {
      $signals.Add($Signal)
    }
  }

  switch -Regex ($ComponentName) {
    '^(Alert|ErrorBoundary|ErrorState|ConfirmDialog|CookieConsent|Modal|AuthRequiredModal|Toast|OfflineBanner|Skeleton|Loader|PageLoading|PagePreloader|OverlayLoader|TopLoadingBar)$' {
      Add-Signal 'feedback'
      $profile.failureCost = [Math]::Min(5, [int]$profile.failureCost + 1)
      $profile.accessibilityConfidence = [Math]::Min(5, [int]$profile.accessibilityConfidence + 1)
      $profile.analyticsConfidence = [Math]::Max(1, [int]$profile.analyticsConfidence - 1)
      $profile.formality = [Math]::Min(5, [int]$profile.formality + 1)
      $profile.interactionIntensity = [Math]::Min(5, [int]$profile.interactionIntensity + 1)
      $profile.bestFor = @('clear_state_signaling', 'high_trust_interruption')
      $profile.avoidWhen = @('low_severity_background_updates')
      if ($ComponentName -match 'Toast|Banner|Loading|Skeleton|Loader|TopLoadingBar') {
        $profile.autonomyAllowance = 'auto_select'
      } else {
        $profile.autonomyAllowance = 'human_review_required'
      }
    }
    '^(DataTable|AdvancedDataTable|BentoGrid|KPICard|LineChart|RadarChart|HeatmapVisualization|NetworkGraph|MetricsDashboard|ComparisonChecklist|DecisionGraph|DecisionLedger|DecisionBoard|DecisionTerminal|DecisionWorkbench|Timeline|TimelineComponent|StepIndicator|Stepper|GanttChart|GaugeChart)$' {
      Add-Signal 'data'
      $profile.subfamily = 'operational_intelligence'
      $profile.primaryJob = 'support_operational_decision_making'
      $profile.secondaryJobs = @('monitoring', 'analysis')
      $profile.userGoal = 'inspect_status_and_take_action'
      $profile.primaryInteractionModel = 'compare'
      $profile.uxPatternType = 'structured_data_view'
      $profile.allowedContexts = @('admin_dashboards', 'ops_surfaces', 'decision_support_surfaces')
      $profile.bestFor = @('high_density_operational_views')
      $profile.avoidWhen = @('lightweight_marketing_sections')
      $profile.accessibilityConfidence = [Math]::Min(5, [int]$profile.accessibilityConfidence + 1)
      $profile.analyticsConfidence = [Math]::Min(5, [int]$profile.analyticsConfidence + 1)
      $profile.densityFeel = [Math]::Min(5, [int]$profile.densityFeel + 1)
      $profile.interactionIntensity = [Math]::Min(5, [int]$profile.interactionIntensity + 1)
      $profile.contentAuthoringBurden = [Math]::Min(5, [int]$profile.contentAuthoringBurden + 1)
    }
    '^(HeroSection|WelcomeSection|FeatureGrid|FeaturesGrid|CTASection|FAQSection|PricingCards|LogoCloud|SocialProof|AnnouncementBanner|Newsletter|TestimonialGrid|CaseStudy|ProductSteps|StatsGrid|FeatureShowcase|GradientMeshHero|SplitHero|VideoHero|TextRotateHero)$' {
      Add-Signal 'marketing'
      $profile.subfamily = 'conversion_sections'
      $profile.primaryJob = 'communicate_value_and_drive_action'
      $profile.secondaryJobs = @('social_proof', 'offer_clarity')
      $profile.userGoal = 'understand_offer_and_convert'
      $profile.primaryInteractionModel = 'navigation'
      $profile.uxPatternType = 'section_pattern'
      $profile.allowedContexts = @('marketing_pages', 'campaign_landing_pages', 'product_intros')
      $profile.bestFor = @('product_value_storytelling')
      $profile.avoidWhen = @('dense_operational_workflows')
      $profile.visualDominance = [Math]::Min(5, [int]$profile.visualDominance + 1)
      $profile.expressiveness = [Math]::Min(5, [int]$profile.expressiveness + 1)
      $profile.contentAuthoringBurden = [Math]::Min(5, [int]$profile.contentAuthoringBurden + 1)
      $profile.autonomyAllowance = 'auto_select'
    }
    '^(Form.+|AdvancedAutocomplete|BadgeInput|ColorPicker|DateRangePicker|DragDropZone|FileUpload|InputAddon|MarkdownEditor|Pagination|QRCodeGenerator|ResizablePanel|RichTextEditor|SearchFilter|SignaturePad)$' {
      Add-Signal 'forms'
      $profile.subfamily = 'data_capture_and_authoring'
      $profile.primaryJob = 'capture_and_edit_user_input'
      $profile.secondaryJobs = @('validation', 'workflow_enablement')
      $profile.userGoal = 'submit_accurate_information'
      $profile.primaryInteractionModel = 'input'
      $profile.uxPatternType = 'inline_control'
      $profile.allowedContexts = @('forms', 'authoring_flows', 'workflow_tools')
      $profile.bestFor = @('structured_input_collection')
      $profile.avoidWhen = @('read_only_storytelling_surfaces')
      $profile.accessibilityConfidence = [Math]::Min(5, [int]$profile.accessibilityConfidence + 1)
      $profile.interactionIntensity = [Math]::Min(5, [int]$profile.interactionIntensity + 1)
      $profile.autonomyAllowance = 'auto_select'
    }
    '^(Breadcrumbs|CommandMenu|CommandPalette|ContextMenu|Dock|FloatingNav|MegaMenu|MegaMenuComponent|MorphingNav|SideMenu|SlideTabs|StickyHeader|Menu|Popover|Sheet|Tabs|Tooltip)$' {
      Add-Signal 'navigation'
      $profile.subfamily = 'navigation_and_control_surfaces'
      $profile.primaryJob = 'orient_users_and_trigger_commands'
      $profile.secondaryJobs = @('wayfinding', 'workflow_acceleration')
      $profile.userGoal = 'move_and_execute_with_confidence'
      $profile.primaryInteractionModel = 'navigation'
      $profile.uxPatternType = 'overlay'
      $profile.allowedContexts = @('product_shells', 'cross_page_navigation', 'command_access')
      $profile.bestFor = @('high_frequency_navigation_paths')
      $profile.accessibilityConfidence = [Math]::Min(5, [int]$profile.accessibilityConfidence + 1)
      $profile.interactionIntensity = [Math]::Min(5, [int]$profile.interactionIntensity + 1)
      $profile.autonomyAllowance = 'suggest_only'
    }
    '^(Animated.+|AuroraText|BlurFade|ComicText|CountUpStats|DiaTextReveal|FlipText|GlitchText|Highlighter|HighlightOnScroll|HyperText|KineticText|LineShadowText|LottieAnimation|Marquee|MorphingText|NumberTicker|PageTransition|ParallaxSection|RevealOnScroll|ScrollVelocity|SmoothCursor|SparklesText|SpinningText|StaggerAnimation|Text.+|TypingAnimation|TypingEffect|VideoText|WordRotate)$' {
      Add-Signal 'motion'
      $profile.subfamily = 'kinetic_content'
      $profile.primaryJob = 'amplify_message_through_motion'
      $profile.secondaryJobs = @('attention_guidance', 'brand_expression')
      $profile.userGoal = 'perceive_emphasis_and_hierarchy'
      $profile.primaryInteractionModel = 'disclosure'
      $profile.uxPatternType = 'feedback_pattern'
      $profile.allowedContexts = @('brand_moments', 'hero_sections', 'narrative_surfaces')
      $profile.disallowedContexts = @('critical_alerting', 'high_density_data_admin')
      $profile.bestFor = @('expressive_content_sequences')
      $profile.avoidWhen = @('strict_performance_budget_or_reduced_motion_required')
      $profile.expressiveness = [Math]::Min(5, [int]$profile.expressiveness + 1)
      $profile.performanceBudgetFit = [Math]::Max(1, [int]$profile.performanceBudgetFit - 1)
      $profile.autonomyAllowance = 'suggest_only'
    }
    '^(AuroraBackground|AuroraBackgroundEffect|Backlight|BloomEffect|BorderBeam|BorderBeamEffect|ChromaticAberrationEffect|Confetti|ConfettiEffect|ConfettiExplosion|CoolMode|CursorFollower|DotPattern|DottedMap|FlickeringGrid|GlareHover|Globe|GradientBlobs|GridPattern|InteractiveGridPattern|Lens|LensMagnifier|MotionBlurEffect|MultiLayerParallax|MeshGradient|Meteors|NoiseOverlay|OrbitingCircles|Particles|Pointer|ProgressiveBlur|RetroGrid|Ripple|ShineBorder|SparklesEffect|Spotlight|SpotlightEffect|WarpBackground|WavyBackground|VHSEffect)$' {
      Add-Signal 'effects'
      $profile.subfamily = 'ambient_visual_layers'
      $profile.primaryJob = 'create_atmosphere_and_depth'
      $profile.secondaryJobs = @('brand_tone', 'visual_separation')
      $profile.userGoal = 'feel_spatial_and_brand_context'
      $profile.primaryInteractionModel = 'none'
      $profile.uxPatternType = 'decorative_layer'
      $profile.allowedContexts = @('marketing_backgrounds', 'hero_backdrops', 'showcase_surfaces')
      $profile.disallowedContexts = @('critical_data_readability_surfaces', 'legal_consent', 'accessibility_sensitive_flows_without_fallbacks')
      $profile.bestFor = @('visual_ambience_and_brand_mood')
      $profile.avoidWhen = @('text_legibility_is_primary_constraint')
      $profile.accessibilityConfidence = [Math]::Max(1, [int]$profile.accessibilityConfidence - 1)
      $profile.performanceBudgetFit = [Math]::Max(1, [int]$profile.performanceBudgetFit - 1)
      $profile.visualDominance = [Math]::Min(5, [int]$profile.visualDominance + 1)
      $profile.autonomyAllowance = 'human_review_required'
    }
    '^(Accordion3D|AdvancedCarousel|AndroidMockup|CardImage|CodeBlock|CodeComparison|CodeEditor|ComparisonSlider|CurtainReveal|DraggableCards|ExpandableCard|FlipCard|FlipCardEffect|GlassmorphismCard|GlowCard|HeroVideoDialog|HolographicCard|HorizontalScrollSection|IconCloud|ImageGallery|ImageLightbox|ImageReveal|ImageWithFallback|InfiniteCarousel|InteractiveGrid|InteractiveHoverButton|Iphone|LazyLoadComponent|LazySection|LongPressDetector|MagicCard|MagneticButton|MagneticButtonEffect|NeonCard|NeonGradientCard|PinchZoom|PixelImage|ProductCarousel|ProgressRing|PulsatingButton|RainbowButton|RippleButton|Safari|SafariMockup|ScrollPinSection|ScrollSnapContainer|ScrollVideoPlayer|ShimmerButton|ShinyButton|SkillBars|SpotlightCards|StackedCards|StarRating|SwipeDetector|Terminal|TiltCard|TweetCard|ZoomHero)$' {
      Add-Signal 'showcase'
      $profile.subfamily = 'high_touch_interactions'
      $profile.primaryJob = 'demonstrate_capability_with_interaction'
      $profile.secondaryJobs = @('engagement', 'feature_demonstration')
      $profile.userGoal = 'explore_and_compare_interactively'
      $profile.primaryInteractionModel = 'select'
      $profile.uxPatternType = 'interactive_pattern'
      $profile.allowedContexts = @('product_showcases', 'interactive_marketing', 'demo_surfaces')
      $profile.disallowedContexts = @('critical_confirmation', 'low_power_constrained_views')
      $profile.bestFor = @('interactive_product_storytelling')
      $profile.avoidWhen = @('workflow_requires_low_cognitive_load')
      $profile.interactionIntensity = [Math]::Min(5, [int]$profile.interactionIntensity + 1)
      $profile.visualDominance = [Math]::Min(5, [int]$profile.visualDominance + 1)
      $profile.performanceBudgetFit = [Math]::Max(1, [int]$profile.performanceBudgetFit - 1)
      $profile.autonomyAllowance = 'suggest_only'
    }
  }

  $signalSummary = 'none'
  if ($signals.Count -gt 0) {
    $signalSummary = ($signals | Sort-Object) -join ', '
  }

  $reviewNotes = @(
    'Component-specific review pass generated from shelf defaults and name-signal heuristics.',
    ('Signals detected: {0}' -f $signalSummary)
  )

  return [pscustomobject]@{
    profile = $profile
    signals = @($signals)
    reviewNotes = @($reviewNotes)
  }
}

function Get-CriticalReviewProfile {
  param(
    [Parameter(Mandatory = $true)][string]$ComponentName,
    [Parameter(Mandatory = $true)][string]$ShelfKey,
    [Parameter(Mandatory = $true)][hashtable]$Profile,
    [AllowEmptyCollection()][string[]]$Signals = @()
  )

  if ($null -eq $Signals) {
    $Signals = @()
  }

  $redFlags = [System.Collections.Generic.List[string]]::new()
  $failureModes = [System.Collections.Generic.List[string]]::new()
  $pushback = [System.Collections.Generic.List[string]]::new()
  $specificPushback = [System.Collections.Generic.List[string]]::new()

  function Add-UniqueNote {
    param(
      [Parameter(Mandatory = $true)][ref]$Target,
      [Parameter(Mandatory = $true)][string]$Text
    )

    if ($null -eq $Target -or $null -eq $Target.Value -or [string]::IsNullOrWhiteSpace($Text)) {
      return
    }

    if ($Target.Value -is [System.Collections.ICollection] -and $Target.Value -is [System.Collections.IList]) {
      if (-not $Target.Value.Contains($Text)) {
        [void]$Target.Value.Add($Text)
      }
      return
    }

    if (-not ($Target.Value -is [System.Array])) {
      return
    }

    if ($Target.Value -notcontains $Text) {
      $Target.Value = @($Target.Value + $Text)
    }
  }

  if ([int]$Profile.failureCost -ge 4) {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'high_misuse_cost'
    Add-UniqueNote -Target ([ref]$failureModes) -Text 'Mistakes here are expensive or trust-damaging.'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'Use only when the consequence of getting it wrong justifies the complexity.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} has a failure cost of {1}, so a wrong choice is not cosmetic; it can actively damage trust or workflow completion." -f $ComponentName, $Profile.failureCost)
  }

  if ([int]$Profile.accessibilityConfidence -le 3) {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'a11y_uncertain'
    Add-UniqueNote -Target ([ref]$failureModes) -Text 'Keyboard, focus, or announcement behavior may still be brittle.'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'Do not call this production-safe without an actual accessibility audit.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} is not acceptable as a casual default until keyboard, focus, and announcement behavior are verified in the real flow." -f $ComponentName)
  }

  if ([int]$Profile.performanceBudgetFit -le 2) {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'performance_heavy'
    Add-UniqueNote -Target ([ref]$failureModes) -Text 'This can burn budget on weaker devices or busy pages.'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'If a lighter pattern works, choose that first.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} is too expensive for broad use if the same job can be handled by a lighter component with fewer moving parts." -f $ComponentName)
  }

  if ($Profile.autonomyAllowance -ne 'auto_select') {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'not_safe_for_autonomy'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'This should not be auto-selected without a human check.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} should stay behind a human decision gate; it is not a safe autonomous default." -f $ComponentName)
  }

  if ($Profile.lifecycle -ne 'supported' -or $Profile.adoption -eq 'none') {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'weak_lifecycle_or_adoption'
    Add-UniqueNote -Target ([ref]$failureModes) -Text 'The component is not yet a strong default choice.'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'This should stay a candidate, not a default recommendation.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} does not have enough lifecycle weight to be treated as a settled standard; keep it in candidate territory." -f $ComponentName)
  }

  if ($ShelfKey -eq 'misc-uncurated') {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'uncurated'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'It is not fair to treat this as settled library surface yet.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} is still in the misc shelf, which is a classification warning, not a badge of readiness." -f $ComponentName)
  }

  if ($Signals -contains 'effects' -or $Signals -contains 'motion') {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'motion_or_effect_heavy'
    Add-UniqueNote -Target ([ref]$failureModes) -Text 'Reduced-motion users and low-budget surfaces may suffer.'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'Only use if the motion is doing meaningful product work, not just decoration.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} is motion/effect-heavy, so it will lose quickly if the surface needs restraint, scanability, or reduced-motion friendliness." -f $ComponentName)
  }

  if ($Signals -contains 'data') {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'dense_operational_surface'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'Dense data surfaces should be chosen for signal clarity, not visual fullness.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} should only be used when density helps decision-making; if users need quick scans, this is the wrong shape." -f $ComponentName)
  }

  if ($Signals -contains 'showcase') {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'interaction_showpiece'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'A showcase component is not automatically the right answer for a serious workflow.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} reads as a showpiece first, which makes it risky as a default choice in serious workflows." -f $ComponentName)
  }

  if ($Signals -contains 'marketing') {
    Add-UniqueNote -Target ([ref]$redFlags) -Text 'conversion_surface'
    Add-UniqueNote -Target ([ref]$pushback) -Text 'Marketing polish should not outrank clarity or proof.'
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} should not be chosen just because it looks polished; proof and clarity need to survive first." -f $ComponentName)
  }

  if ([int]$Profile.interactionIntensity -ge 4) {
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} is interaction-dense, so every extra step or state change raises the cost of misunderstanding." -f $ComponentName)
  }

  if ([int]$Profile.densityFeel -ge 4) {
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} is dense enough that it should be treated as specialist surface, not lightweight browse material." -f $ComponentName)
  }

  if ([int]$Profile.visualDominance -ge 4) {
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} has strong visual dominance, so it will pull attention away from surrounding content unless deliberately contained." -f $ComponentName)
  }

  if ([int]$Profile.expressiveness -ge 4) {
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} is highly expressive, which is useful only if the design intent is to change tone rather than simply support content." -f $ComponentName)
  }

  if ($specificPushback.Count -eq 0) {
    Add-UniqueNote -Target ([ref]$specificPushback) -Text ("{0} looks low-risk, but that still does not make it a default choice; verify semantics, fit, and the surrounding flow before promoting it." -f $ComponentName)
  }

  $criticalityScore = 1
  if ($redFlags.Contains('high_misuse_cost')) { $criticalityScore += 1 }
  if ($redFlags.Contains('a11y_uncertain')) { $criticalityScore += 1 }
  if ($redFlags.Contains('performance_heavy')) { $criticalityScore += 1 }
  if ($redFlags.Contains('not_safe_for_autonomy')) { $criticalityScore += 1 }
  if ($redFlags.Contains('weak_lifecycle_or_adoption')) { $criticalityScore += 1 }
  if ($redFlags.Contains('uncurated')) { $criticalityScore += 1 }
  if ($redFlags.Contains('motion_or_effect_heavy')) { $criticalityScore += 1 }
  if ($redFlags.Contains('dense_operational_surface')) { $criticalityScore += 1 }
  if ($redFlags.Contains('interaction_showpiece')) { $criticalityScore += 1 }
  if ($redFlags.Contains('conversion_surface')) { $criticalityScore += 1 }

  if ($criticalityScore -gt 5) { $criticalityScore = 5 }

  $hardVerdict = 'acceptable_with_constraints'
  if ($criticalityScore -ge 4) {
    $hardVerdict = 'review_required'
  }
  if ($criticalityScore -ge 5) {
    $hardVerdict = 'candidate_only'
  }

  $criticalityAnchor = switch ($criticalityScore) {
    1 { 'Very low critique burden; safe in broad default use' }
    2 { 'Low critique burden; still has a few guardrails' }
    3 { 'Moderate critique burden; use deliberately' }
    4 { 'High critique burden; needs explicit justification' }
    5 { 'Severe critique burden; do not use casually' }
    default { 'Moderate critique burden; use deliberately' }
  }

  return [pscustomobject]@{
    criticalityScore = $criticalityScore
    criticalityAnchor = $criticalityAnchor
    hardVerdict = $hardVerdict
    redFlags = @($redFlags)
    failureModes = @($failureModes)
    pushback = @($pushback)
    specificPushback = @($specificPushback)
    pushbackSummary = if ($pushback.Count -gt 0) { $pushback[0] } else { 'No critical blockers identified beyond the base profile.' }
  }
}

function Get-ScoreAnchor {
  param(
    [Parameter(Mandatory = $true)][string]$Dimension,
    [Parameter(Mandatory = $true)][int]$Score,
    [Parameter(Mandatory = $true)][hashtable]$AnchorMap
  )

  if (-not $AnchorMap.ContainsKey($Dimension)) {
    return $null
  }

  $dimensionAnchors = $AnchorMap[$Dimension]
  if (-not $dimensionAnchors.ContainsKey($Score)) {
    return $null
  }

  return $dimensionAnchors[$Score]
}

function New-ScoredField {
  param(
    [Parameter(Mandatory = $true)][string]$Dimension,
    [Parameter(Mandatory = $true)][int]$Score,
    [Parameter(Mandatory = $true)][hashtable]$AnchorMap
  )

  return [pscustomobject]@{
    score = $Score
    anchor = (Get-ScoreAnchor -Dimension $Dimension -Score $Score -AnchorMap $AnchorMap)
  }
}

function Get-MetadataProfile {
  param(
    [Parameter(Mandatory = $true)][string]$ShelfKey,
    [Parameter(Mandatory = $true)][hashtable]$Profiles
  )

  if ($Profiles.ContainsKey($ShelfKey)) {
    return $Profiles[$ShelfKey]
  }

  return $Profiles['default']
}

function New-DecisionMetadataV2 {
  param(
    [Parameter(Mandatory = $true)][psobject]$ComponentEntry,
    [Parameter(Mandatory = $true)][psobject]$Shelf,
    [Parameter(Mandatory = $true)][string]$ComponentName,
    [AllowEmptyCollection()][object[]]$StarterMemberships = @(),
    [Parameter(Mandatory = $true)][hashtable]$Profiles,
    [Parameter(Mandatory = $true)][hashtable]$AnchorMap,
    [Parameter(Mandatory = $true)][string]$GeneratedAt,
    [Parameter(Mandatory = $true)][string]$Owner,
    [object]$ManualReviewOverride = $null
  )

  if ($null -eq $StarterMemberships) {
    $StarterMemberships = @()
  }

  $componentReview = Get-ComponentMetadataProfile -ComponentName $ComponentName -ShelfKey $Shelf.key -Profiles $Profiles
  $profile = $componentReview.profile
  $manualReviewApplied = $null -ne $ManualReviewOverride

  if ($manualReviewApplied -and $ManualReviewOverride.profileOverrides) {
    Merge-ObjectProperties -Target $profile -Source $ManualReviewOverride.profileOverrides
  }

  $criticalReview = Get-CriticalReviewProfile -ComponentName $ComponentName -ShelfKey $Shelf.key -Profile $profile -Signals $componentReview.signals

  if ($manualReviewApplied -and $ManualReviewOverride.reviewNotes) {
    $componentReview.reviewNotes = @($ManualReviewOverride.reviewNotes) + @($componentReview.reviewNotes)
  }

  if ($manualReviewApplied -and $ManualReviewOverride.criticalReviewOverrides) {
    Merge-ObjectProperties -Target $criticalReview -Source $ManualReviewOverride.criticalReviewOverrides
  }

  $manualDecision = $null
  if ($manualReviewApplied) {
    Assert-Condition -Condition ($null -ne $ManualReviewOverride.manualDecision) -Message "Manual override missing manualDecision block for $ComponentName"
    $manualDecision = $ManualReviewOverride.manualDecision
    Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$manualDecision.stance)) -Message "Manual override missing manualDecision.stance for $ComponentName"
    Assert-Condition -Condition (-not [string]::IsNullOrWhiteSpace([string]$manualDecision.whyNow)) -Message "Manual override missing manualDecision.whyNow for $ComponentName"
    Assert-Condition -Condition ($manualDecision.mustProve.Count -gt 0) -Message "Manual override missing manualDecision.mustProve for $ComponentName"
    Assert-Condition -Condition ($manualDecision.killSwitch.Count -gt 0) -Message "Manual override missing manualDecision.killSwitch for $ComponentName"
    Assert-Condition -Condition ($manualDecision.evidenceRefs.Count -gt 0) -Message "Manual override missing manualDecision.evidenceRefs for $ComponentName"
    $componentReview.reviewNotes = @("Manual decision stance: $($manualDecision.stance)", "Manual decision reason: $($manualDecision.whyNow)") + @($componentReview.reviewNotes)
  }

  $reviewMethod = if ($manualReviewApplied) { 'manual_readthrough' } else { 'inferred_readthrough' }
  $reviewedBy = if ($manualReviewApplied) { 'GitHub Copilot manual readthrough' } else { 'GitHub Copilot' }
  $starterKeys = @($StarterMemberships | ForEach-Object { $_.key })
  $starterLabels = @($StarterMemberships | ForEach-Object { $_.label })
  $related = @($Shelf.highlights | Where-Object { $_ -ne $ComponentEntry.name } | Select-Object -First 6)
  $variantSet = @()
  if ($ComponentEntry.namedExports.Count -gt 1) {
    $variantSet = @($ComponentEntry.namedExports)
  }

  return [pscustomobject]@{
    schemaVersion = 'ui-library-metadata-v2'
    layers = [pscustomobject]@{
      identity = [pscustomobject]@{
        name = $ComponentEntry.name
        family = $Shelf.label
        subfamily = $profile.subfamily
        aliases = @()
        platformFit = @('web', 'responsive')
        variantSet = $variantSet
        relatedComponents = $related
        reviewSignals = @($componentReview.signals)
      }
      intent = [pscustomobject]@{
        primaryJob = $profile.primaryJob
        secondaryJobs = @($profile.secondaryJobs)
        userGoal = $profile.userGoal
        primaryInteractionModel = $profile.primaryInteractionModel
        uxPatternType = $profile.uxPatternType
      }
      eligibility = [pscustomobject]@{
        allowedContexts = @($profile.allowedContexts)
        disallowedContexts = @($profile.disallowedContexts)
        bestFor = @($profile.bestFor)
        avoidWhen = @($profile.avoidWhen)
        requiredApprovals = @($profile.requiredApprovals)
        autonomyAllowance = $profile.autonomyAllowance
        preconditions = @($profile.preconditions)
      }
      readiness = [pscustomobject]@{
        lifecycle = $profile.lifecycle
        adoption = $profile.adoption
        evidenceType = @($profile.evidenceType)
        stability = (New-ScoredField -Dimension 'stability' -Score $profile.stability -AnchorMap $AnchorMap)
        accessibilityConfidence = (New-ScoredField -Dimension 'accessibilityConfidence' -Score $profile.accessibilityConfidence -AnchorMap $AnchorMap)
        internationalizationConfidence = (New-ScoredField -Dimension 'internationalizationConfidence' -Score $profile.internationalizationConfidence -AnchorMap $AnchorMap)
        analyticsConfidence = (New-ScoredField -Dimension 'analyticsConfidence' -Score $profile.analyticsConfidence -AnchorMap $AnchorMap)
        failureCost = (New-ScoredField -Dimension 'failureCost' -Score $profile.failureCost -AnchorMap $AnchorMap)
      }
      operationalCost = [pscustomobject]@{
        performanceBudgetFit = (New-ScoredField -Dimension 'performanceBudgetFit' -Score $profile.performanceBudgetFit -AnchorMap $AnchorMap)
        implementationComplexity = (New-ScoredField -Dimension 'implementationComplexity' -Score $profile.implementationComplexity -AnchorMap $AnchorMap)
        dependencyBurden = (New-ScoredField -Dimension 'dependencyBurden' -Score $profile.dependencyBurden -AnchorMap $AnchorMap)
        designTokenDependencyLevel = (New-ScoredField -Dimension 'designTokenDependencyLevel' -Score $profile.designTokenDependencyLevel -AnchorMap $AnchorMap)
        contentAuthoringBurden = (New-ScoredField -Dimension 'contentAuthoringBurden' -Score $profile.contentAuthoringBurden -AnchorMap $AnchorMap)
      }
      behavioralCharacter = [pscustomobject]@{
        opinionation = (New-ScoredField -Dimension 'opinionation' -Score $profile.opinionation -AnchorMap $AnchorMap)
        expressiveness = (New-ScoredField -Dimension 'expressiveness' -Score $profile.expressiveness -AnchorMap $AnchorMap)
        formality = (New-ScoredField -Dimension 'formality' -Score $profile.formality -AnchorMap $AnchorMap)
        interactionIntensity = (New-ScoredField -Dimension 'interactionIntensity' -Score $profile.interactionIntensity -AnchorMap $AnchorMap)
        visualDominance = (New-ScoredField -Dimension 'visualDominance' -Score $profile.visualDominance -AnchorMap $AnchorMap)
        densityFeel = (New-ScoredField -Dimension 'densityFeel' -Score $profile.densityFeel -AnchorMap $AnchorMap)
      }
      provenance = [pscustomobject]@{
        owner = $Owner
        markedBy = 'GitHub Copilot'
        reviewMode = $reviewMethod
        manualReviewed = $manualReviewApplied
        manualDecision = $manualDecision
        lastReviewed = $GeneratedAt.Substring(0, 10)
        reviewers = @('ui_lab_curation_bot', 'design_system_maintainer', 'github_copilot')
        linkedExamples = @($ComponentEntry.shelfImportPath, $ComponentEntry.exactNameImportPath)
        sourceLinks = @($ComponentEntry.sourcePath, 'ui_lab/docs/UI_LIBRARY_METADATA_V2.md')
        changelog = @('Generated component-specific profile from shelf/starter-lane taxonomy plus name-signal heuristics; refine with direct evidence as it becomes available.')
        confidenceNotes = @('Scores are profile-seeded but individually adjusted for component naming signals; manual overrides are explicitly marked when supplied.')
        reviewNotes = @($componentReview.reviewNotes + $criticalReview.pushbackSummary)
      }
      criticalReview = [pscustomobject]@{
        reviewedBy = $reviewedBy
        reviewMethod = $reviewMethod
        criticalityScore = $criticalReview.criticalityScore
        criticalityAnchor = $criticalReview.criticalityAnchor
        hardVerdict = $criticalReview.hardVerdict
        redFlags = @($criticalReview.redFlags)
        failureModes = @($criticalReview.failureModes)
        pushback = @($criticalReview.pushback)
        specificPushback = @($criticalReview.specificPushback)
        pushbackSummary = $criticalReview.pushbackSummary
      }
    }
    minimumSchema = [pscustomobject]@{
      name = $ComponentEntry.name
      family = $Shelf.key
      primaryJob = $profile.primaryJob
      allowedContexts = @($profile.allowedContexts)
      disallowedContexts = @($profile.disallowedContexts)
      lifecycle = $profile.lifecycle
      evidenceType = @($profile.evidenceType)
      stability = $profile.stability
      accessibilityConfidence = $profile.accessibilityConfidence
      failureCost = $profile.failureCost
      performanceBudgetFit = $profile.performanceBudgetFit
      opinionation = $profile.opinionation
      expressiveness = $profile.expressiveness
      formality = $profile.formality
      interactionIntensity = $profile.interactionIntensity
      autonomyAllowance = $profile.autonomyAllowance
      owner = $Owner
      markedBy = 'GitHub Copilot'
      lastReviewed = $GeneratedAt.Substring(0, 10)
    }
    starterLaneKeys = $starterKeys
    starterLaneLabels = $starterLabels
    reviewedBy = 'GitHub Copilot'
    reviewSignals = @($componentReview.signals)
    reviewNotes = @($componentReview.reviewNotes + $criticalReview.pushbackSummary + ($criticalReview.specificPushback | Select-Object -First 3))
    criticalReview = $criticalReview
  }
}

function Get-ScoreAverage {
  param([Parameter(Mandatory = $true)][int[]]$Scores)

  if (-not $Scores -or $Scores.Count -eq 0) {
    return 1
  }

  return [int][Math]::Round((($Scores | Measure-Object -Average).Average), 0, [MidpointRounding]::AwayFromZero)
}

function Convert-ToRankScore {
  param([Parameter(Mandatory = $true)][double]$Value)

  $rounded = [int][Math]::Round($Value, 0, [MidpointRounding]::AwayFromZero)
  if ($rounded -lt 1) { return 1 }
  if ($rounded -gt 5) { return 5 }
  return $rounded
}

function Get-AutonomyScore {
  param([Parameter(Mandatory = $true)][string]$AutonomyAllowance)

  switch ($AutonomyAllowance) {
    'auto_select' { return 5 }
    'suggest_only' { return 4 }
    'human_review_required' { return 3 }
    'restricted' { return 2 }
    default { return 3 }
  }
}

function Get-LifecycleScore {
  param([Parameter(Mandatory = $true)][string]$Lifecycle)

  switch ($Lifecycle) {
    'supported' { return 5 }
    'candidate' { return 3 }
    'deprecated' { return 2 }
    'retired' { return 1 }
    default { return 3 }
  }
}

function Get-ComponentRanking {
  param(
    [Parameter(Mandatory = $true)][psobject]$ComponentEntry,
    [Parameter(Mandatory = $true)][psobject]$Metadata
  )

  $layers = $Metadata.layers
  $readinessScores = @(
    [int]$layers.readiness.stability.score,
    [int]$layers.readiness.accessibilityConfidence.score,
    [int]$layers.readiness.internationalizationConfidence.score,
    [int]$layers.readiness.analyticsConfidence.score,
    [int]$layers.readiness.failureCost.score
  )
  $costBurdenScores = @(
    [int]$layers.operationalCost.performanceBudgetFit.score,
    [int]$layers.operationalCost.implementationComplexity.score,
    [int]$layers.operationalCost.dependencyBurden.score,
    [int]$layers.operationalCost.designTokenDependencyLevel.score,
    [int]$layers.operationalCost.contentAuthoringBurden.score
  )
  $characterScores = @(
    [int]$layers.behavioralCharacter.opinionation.score,
    [int]$layers.behavioralCharacter.expressiveness.score,
    [int]$layers.behavioralCharacter.formality.score,
    [int]$layers.behavioralCharacter.interactionIntensity.score,
    [int]$layers.behavioralCharacter.visualDominance.score,
    [int]$layers.behavioralCharacter.densityFeel.score
  )

  $eligibilityFit = Get-ScoreAverage -Scores @(
    (6 - [Math]::Min(5, [Math]::Max(1, [int]$layers.eligibility.disallowedContexts.Count + [int]$layers.eligibility.requiredApprovals.Count))),
    (Get-AutonomyScore -AutonomyAllowance ([string]$layers.eligibility.autonomyAllowance)),
    (Get-LifecycleScore -Lifecycle ([string]$layers.readiness.lifecycle))
  )

  $trustScore = Get-ScoreAverage -Scores @(
    [int]$layers.readiness.stability.score,
    [int]$layers.readiness.accessibilityConfidence.score,
    [int]$layers.readiness.internationalizationConfidence.score,
    [int]$layers.readiness.analyticsConfidence.score,
    (6 - [int]$layers.readiness.failureCost.score)
  )

  $efficiencyScore = Get-ScoreAverage -Scores @(
    [int]$layers.operationalCost.performanceBudgetFit.score,
    (6 - [int]$layers.operationalCost.implementationComplexity.score),
    (6 - [int]$layers.operationalCost.dependencyBurden.score),
    (6 - [int]$layers.operationalCost.designTokenDependencyLevel.score),
    (6 - [int]$layers.operationalCost.contentAuthoringBurden.score)
  )

  $styleScore = Get-ScoreAverage -Scores @(
    [int]$layers.behavioralCharacter.opinionation.score,
    [int]$layers.behavioralCharacter.expressiveness.score,
    [int]$layers.behavioralCharacter.formality.score,
    [int]$layers.behavioralCharacter.interactionIntensity.score,
    [int]$layers.behavioralCharacter.visualDominance.score,
    [int]$layers.behavioralCharacter.densityFeel.score
  )

  $safetyScore = Get-ScoreAverage -Scores @(
    (6 - [int]$layers.readiness.failureCost.score),
    [int]$layers.readiness.stability.score,
    [int]$layers.readiness.accessibilityConfidence.score
  )

  $selectionScore = Get-ScoreAverage -Scores @(
    $trustScore,
    $efficiencyScore,
    $eligibilityFit
  )

  $criticalityScore = 1
  if ($layers.criticalReview -and $layers.criticalReview.criticalityScore) {
    $criticalityScore = [int]$layers.criticalReview.criticalityScore
  }

  $riskPenalty = [int][Math]::Floor(($criticalityScore - 1) / 2)
  $riskAdjustedSelectionScore = Convert-ToRankScore -Value ([Math]::Max(1, $selectionScore - $riskPenalty))

  return [pscustomobject]@{
    globalRank = $null
    shelfRank = $null
    starterLaneRanks = @{}
    selectionScore = $selectionScore
    criticalityScore = $criticalityScore
    riskAdjustedSelectionScore = $riskAdjustedSelectionScore
    trustScore = $trustScore
    efficiencyScore = $efficiencyScore
    eligibilityFitScore = $eligibilityFit
    styleScore = $styleScore
    safetyScore = $safetyScore
    readinessScore = (Get-ScoreAverage -Scores $readinessScores)
    costBurdenScore = (Get-ScoreAverage -Scores $costBurdenScores)
    characterScore = (Get-ScoreAverage -Scores $characterScores)
  }
}

$script:PrimaryExportOverrides = @{
  FileTree = 'Tree'
}

$metadataScoreAnchors = @{
  expressiveness = @{ 1 = 'Plain utility; visually quiet'; 2 = 'Light styling; mostly supports surrounding content'; 3 = 'Noticeable style; adaptable to many product surfaces'; 4 = 'Strong flavor; materially changes screen tone'; 5 = 'Signature visual moment; highly art-directed and attention-seeking' }
  opinionation = @{ 1 = 'Neutral shell; disappears into most systems'; 2 = 'Slightly opinionated; easy to adapt'; 3 = 'Recognizable point of view; still flexible'; 4 = 'Strong built-in design language'; 5 = 'Dominant stance; should be used deliberately' }
  autonomyAllowance = @{ 1 = 'Auto-select'; 2 = 'Suggest-only'; 3 = 'Human-review-required'; 4 = 'Restricted'; 5 = 'Restricted' }
  stability = @{ 1 = 'Experimental and actively shifting'; 2 = 'Emerging with frequent revisions'; 3 = 'Usable with periodic API and behavior changes'; 4 = 'Stable with low change frequency'; 5 = 'Battle-tested and highly stable' }
  accessibilityConfidence = @{ 1 = 'Unknown a11y behavior'; 2 = 'Basic checks only'; 3 = 'Manual review in representative flows'; 4 = 'Audited with known guidance'; 5 = 'Audited and production-validated' }
  internationalizationConfidence = @{ 1 = 'Not reviewed for i18n'; 2 = 'Partial layout checks'; 3 = 'Handles common locale changes'; 4 = 'Locale-safe in most product flows'; 5 = 'Broad locale and direction support validated' }
  analyticsConfidence = @{ 1 = 'No instrumentation expectations'; 2 = 'Ad-hoc instrumentation guidance'; 3 = 'Trackable with moderate effort'; 4 = 'Clear measurement hooks available'; 5 = 'Well-instrumented with production evidence' }
  failureCost = @{ 1 = 'Low visual-only impact'; 2 = 'Minor UX friction'; 3 = 'Moderate confusion or task interruption'; 4 = 'High trust or workflow impact'; 5 = 'Critical risk if misused' }
  performanceBudgetFit = @{ 1 = 'Very heavy; likely over budget'; 2 = 'Heavy in constrained surfaces'; 3 = 'Manageable with optimization'; 4 = 'Generally budget-friendly'; 5 = 'Lightweight and budget-safe' }
  implementationComplexity = @{ 1 = 'Drop-in simple'; 2 = 'Low integration effort'; 3 = 'Moderate integration effort'; 4 = 'Complex integration and maintenance'; 5 = 'High complexity requiring specialist ownership' }
  dependencyBurden = @{ 1 = 'No extra dependencies'; 2 = 'Minimal dependency footprint'; 3 = 'Moderate dependency surface'; 4 = 'Heavy dependency requirements'; 5 = 'Very heavy and tightly coupled dependencies' }
  designTokenDependencyLevel = @{ 1 = 'Token-light'; 2 = 'Uses core tokens'; 3 = 'Uses broad token sets'; 4 = 'Strong token coupling'; 5 = 'Deep token-system coupling' }
  contentAuthoringBurden = @{ 1 = 'Minimal content authoring'; 2 = 'Low authoring effort'; 3 = 'Moderate authoring and curation effort'; 4 = 'High authoring effort'; 5 = 'Very high editorial burden' }
  formality = @{ 1 = 'Playful and informal'; 2 = 'Casual product tone'; 3 = 'Balanced neutral-professional'; 4 = 'Professional and controlled'; 5 = 'Highly formal enterprise tone' }
  interactionIntensity = @{ 1 = 'Mostly static'; 2 = 'Low interaction density'; 3 = 'Moderate interaction complexity'; 4 = 'High interaction density'; 5 = 'Very high interaction choreography' }
  visualDominance = @{ 1 = 'Visually recessive'; 2 = 'Low visual prominence'; 3 = 'Balanced prominence'; 4 = 'High visual pull'; 5 = 'Dominant visual focal point' }
  densityFeel = @{ 1 = 'Very airy'; 2 = 'Airy'; 3 = 'Balanced'; 4 = 'Dense'; 5 = 'Very dense information texture' }
}

$metadataProfileDefaults = @{
  default = @{
    subfamily = 'general'
    primaryJob = 'ui_capability_delivery'
    secondaryJobs = @('content_structuring', 'interaction_enablement')
    userGoal = 'complete_task_with_confidence'
    primaryInteractionModel = 'mixed'
    uxPatternType = 'composable_component'
    allowedContexts = @('standard_product_surfaces')
    disallowedContexts = @('legal_consent', 'high_risk_confirmation')
    bestFor = @('general_ui_delivery')
    avoidWhen = @('context_is_safety_critical')
    requiredApprovals = @()
    autonomyAllowance = 'suggest_only'
    preconditions = @('responsive_layout_support', 'keyboard_navigation_support')
    lifecycle = 'supported'
    adoption = 'broad'
    evidenceType = @('production_observed', 'expert_reviewed')
    stability = 4
    accessibilityConfidence = 3
    internationalizationConfidence = 3
    analyticsConfidence = 3
    failureCost = 3
    performanceBudgetFit = 4
    implementationComplexity = 3
    dependencyBurden = 2
    designTokenDependencyLevel = 3
    contentAuthoringBurden = 2
    opinionation = 3
    expressiveness = 3
    formality = 3
    interactionIntensity = 3
    visualDominance = 3
    densityFeel = 3
  }
  'landing-product-system' = @{
    subfamily = 'enterprise_story_systems'; primaryJob = 'enterprise_narrative_and_decision_support'; secondaryJobs = @('proof_orchestration', 'stakeholder_alignment'); userGoal = 'build_enterprise_buying_confidence'; primaryInteractionModel = 'disclosure'; uxPatternType = 'structured_data_view'; allowedContexts = @('enterprise_landing_pages', 'executive_readouts', 'solution_explainers'); disallowedContexts = @('critical_health_alerts', 'legal_consent'); bestFor = @('high-context_enterprise_storytelling'); avoidWhen = @('minimalist_consumer_microflows'); requiredApprovals = @('content_strategy_review'); autonomyAllowance = 'suggest_only'; preconditions = @('structured_content_available', 'adequate_viewport_space', 'keyboard_navigation_support'); lifecycle = 'supported'; adoption = 'broad'; evidenceType = @('production_observed', 'usability_tested', 'expert_reviewed'); stability = 4; accessibilityConfidence = 4; internationalizationConfidence = 3; analyticsConfidence = 3; failureCost = 4; performanceBudgetFit = 3; implementationComplexity = 4; dependencyBurden = 3; designTokenDependencyLevel = 4; contentAuthoringBurden = 4; opinionation = 4; expressiveness = 4; formality = 4; interactionIntensity = 3; visualDominance = 4; densityFeel = 4
  }
  'landing-marketing' = @{
    subfamily = 'conversion_sections'; primaryJob = 'communicate_value_and_drive_action'; secondaryJobs = @('social_proof', 'offer_clarity'); userGoal = 'understand_offer_and_convert'; primaryInteractionModel = 'navigation'; uxPatternType = 'section_pattern'; allowedContexts = @('marketing_pages', 'campaign_landing_pages'); disallowedContexts = @('destructive_confirmation', 'regulated_consent_steps'); bestFor = @('product_value_storytelling'); avoidWhen = @('dense_operational_workflows'); requiredApprovals = @(); autonomyAllowance = 'auto_select'; preconditions = @('clear_content_hierarchy', 'responsive_layout_support'); lifecycle = 'supported'; adoption = 'broad'; evidenceType = @('production_observed', 'analytics_validated'); stability = 4; accessibilityConfidence = 3; internationalizationConfidence = 3; analyticsConfidence = 4; failureCost = 2; performanceBudgetFit = 4; implementationComplexity = 2; dependencyBurden = 2; designTokenDependencyLevel = 3; contentAuthoringBurden = 3; opinionation = 3; expressiveness = 4; formality = 3; interactionIntensity = 2; visualDominance = 4; densityFeel = 2
  }
  'data-admin' = @{
    subfamily = 'operational_intelligence'; primaryJob = 'support_operational_decision_making'; secondaryJobs = @('monitoring', 'analysis'); userGoal = 'inspect_status_and_take_action'; primaryInteractionModel = 'compare'; uxPatternType = 'structured_data_view'; allowedContexts = @('admin_dashboards', 'ops_surfaces'); disallowedContexts = @('legal_consent', 'emotionally_sensitive_alerting'); bestFor = @('high_density_operational_views'); avoidWhen = @('lightweight_marketing_sections'); requiredApprovals = @('data_owner_alignment'); autonomyAllowance = 'suggest_only'; preconditions = @('structured_data_available', 'keyboard_navigation_support', 'sufficient_viewport_space'); lifecycle = 'supported'; adoption = 'broad'; evidenceType = @('production_observed', 'analytics_validated', 'expert_reviewed'); stability = 4; accessibilityConfidence = 3; internationalizationConfidence = 3; analyticsConfidence = 4; failureCost = 4; performanceBudgetFit = 3; implementationComplexity = 4; dependencyBurden = 3; designTokenDependencyLevel = 3; contentAuthoringBurden = 3; opinionation = 3; expressiveness = 2; formality = 4; interactionIntensity = 4; visualDominance = 3; densityFeel = 5
  }
  'forms-authoring' = @{
    subfamily = 'data_capture_and_authoring'; primaryJob = 'capture_and_edit_user_input'; secondaryJobs = @('validation', 'workflow_enablement'); userGoal = 'submit_accurate_information'; primaryInteractionModel = 'input'; uxPatternType = 'inline_control'; allowedContexts = @('forms', 'authoring_flows', 'workflow_tools'); disallowedContexts = @('critical_health_alerts'); bestFor = @('structured_input_collection'); avoidWhen = @('read_only_storytelling_surfaces'); requiredApprovals = @(); autonomyAllowance = 'auto_select'; preconditions = @('validation_rules_defined', 'keyboard_navigation_support', 'focus_management'); lifecycle = 'supported'; adoption = 'broad'; evidenceType = @('production_observed', 'usability_tested'); stability = 4; accessibilityConfidence = 4; internationalizationConfidence = 4; analyticsConfidence = 3; failureCost = 4; performanceBudgetFit = 4; implementationComplexity = 3; dependencyBurden = 2; designTokenDependencyLevel = 3; contentAuthoringBurden = 2; opinionation = 2; expressiveness = 2; formality = 3; interactionIntensity = 4; visualDominance = 2; densityFeel = 3
  }
  'feedback-state' = @{
    subfamily = 'status_and_interruptions'; primaryJob = 'communicate_state_and_risk'; secondaryJobs = @('confirm_actions', 'recover_from_failures'); userGoal = 'understand_system_state_fast'; primaryInteractionModel = 'feedback'; uxPatternType = 'feedback_pattern'; allowedContexts = @('status_updates', 'error_recovery', 'confirmation_layers'); disallowedContexts = @('decorative_only_usage'); bestFor = @('clear_state_signaling'); avoidWhen = @('silent_background_changes'); requiredApprovals = @('critical_flow_review'); autonomyAllowance = 'human_review_required'; preconditions = @('message_severity_model_defined', 'keyboard_navigation_support', 'focus_management'); lifecycle = 'supported'; adoption = 'broad'; evidenceType = @('production_observed', 'accessibility_audited'); stability = 4; accessibilityConfidence = 4; internationalizationConfidence = 3; analyticsConfidence = 3; failureCost = 5; performanceBudgetFit = 4; implementationComplexity = 3; dependencyBurden = 2; designTokenDependencyLevel = 3; contentAuthoringBurden = 2; opinionation = 3; expressiveness = 2; formality = 4; interactionIntensity = 4; visualDominance = 3; densityFeel = 3
  }
  'ui-primitives' = @{
    subfamily = 'atoms_and_composables'; primaryJob = 'provide_foundational_ui_primitives'; secondaryJobs = @('layout_support', 'interaction_baseline'); userGoal = 'compose_consistent_interfaces'; primaryInteractionModel = 'mixed'; uxPatternType = 'inline_control'; allowedContexts = @('all_product_surfaces'); disallowedContexts = @('none_without_context'); bestFor = @('reusable_design_system_foundations'); avoidWhen = @('standalone_storytelling_needs'); requiredApprovals = @(); autonomyAllowance = 'auto_select'; preconditions = @('token_system_available', 'keyboard_navigation_support'); lifecycle = 'supported'; adoption = 'broad'; evidenceType = @('production_observed', 'expert_reviewed'); stability = 5; accessibilityConfidence = 4; internationalizationConfidence = 4; analyticsConfidence = 2; failureCost = 3; performanceBudgetFit = 5; implementationComplexity = 2; dependencyBurden = 1; designTokenDependencyLevel = 4; contentAuthoringBurden = 1; opinionation = 2; expressiveness = 1; formality = 3; interactionIntensity = 2; visualDominance = 1; densityFeel = 2
  }
  'navigation-command' = @{
    subfamily = 'navigation_and_control_surfaces'; primaryJob = 'orient_users_and_trigger_commands'; secondaryJobs = @('wayfinding', 'workflow_acceleration'); userGoal = 'move_and_execute_with_confidence'; primaryInteractionModel = 'navigation'; uxPatternType = 'overlay'; allowedContexts = @('product_shells', 'cross_page_navigation', 'command_access'); disallowedContexts = @('legal_consent'); bestFor = @('high_frequency_navigation_paths'); avoidWhen = @('single_static_content_views'); requiredApprovals = @(); autonomyAllowance = 'suggest_only'; preconditions = @('clear_information_architecture', 'keyboard_navigation_support', 'focus_management'); lifecycle = 'supported'; adoption = 'broad'; evidenceType = @('production_observed', 'usability_tested'); stability = 4; accessibilityConfidence = 4; internationalizationConfidence = 3; analyticsConfidence = 3; failureCost = 4; performanceBudgetFit = 4; implementationComplexity = 3; dependencyBurden = 2; designTokenDependencyLevel = 3; contentAuthoringBurden = 2; opinionation = 3; expressiveness = 3; formality = 3; interactionIntensity = 4; visualDominance = 3; densityFeel = 3
  }
  'motion-typography' = @{
    subfamily = 'kinetic_content'; primaryJob = 'amplify_message_through_motion'; secondaryJobs = @('attention_guidance', 'brand_expression'); userGoal = 'perceive_emphasis_and_hierarchy'; primaryInteractionModel = 'disclosure'; uxPatternType = 'feedback_pattern'; allowedContexts = @('brand_moments', 'hero_sections', 'narrative_surfaces'); disallowedContexts = @('critical_alerting', 'high_density_data_admin'); bestFor = @('expressive_content_sequences'); avoidWhen = @('strict_performance_budget_or_reduced_motion_required'); requiredApprovals = @('motion_review'); autonomyAllowance = 'suggest_only'; preconditions = @('reduced_motion_fallback', 'performance_budget_validation'); lifecycle = 'supported'; adoption = 'targeted'; evidenceType = @('expert_reviewed', 'production_observed'); stability = 3; accessibilityConfidence = 3; internationalizationConfidence = 2; analyticsConfidence = 2; failureCost = 2; performanceBudgetFit = 2; implementationComplexity = 3; dependencyBurden = 3; designTokenDependencyLevel = 3; contentAuthoringBurden = 3; opinionation = 4; expressiveness = 5; formality = 2; interactionIntensity = 4; visualDominance = 5; densityFeel = 2
  }
  'backgrounds-effects' = @{
    subfamily = 'ambient_visual_layers'; primaryJob = 'create_atmosphere_and_depth'; secondaryJobs = @('brand_tone', 'visual_separation'); userGoal = 'feel_spatial_and_brand_context'; primaryInteractionModel = 'none'; uxPatternType = 'decorative_layer'; allowedContexts = @('marketing_backgrounds', 'hero_backdrops', 'showcase_surfaces'); disallowedContexts = @('critical_data_readability_surfaces', 'legal_consent', 'accessibility_sensitive_flows_without_fallbacks'); bestFor = @('visual_ambience_and_brand_mood'); avoidWhen = @('text_legibility_is_primary_constraint'); requiredApprovals = @('accessibility_review', 'performance_review'); autonomyAllowance = 'human_review_required'; preconditions = @('contrast_validation', 'reduced_motion_fallback', 'performance_budget_validation'); lifecycle = 'supported'; adoption = 'targeted'; evidenceType = @('expert_reviewed'); stability = 3; accessibilityConfidence = 2; internationalizationConfidence = 3; analyticsConfidence = 1; failureCost = 3; performanceBudgetFit = 2; implementationComplexity = 3; dependencyBurden = 3; designTokenDependencyLevel = 2; contentAuthoringBurden = 1; opinionation = 4; expressiveness = 5; formality = 2; interactionIntensity = 3; visualDominance = 5; densityFeel = 2
  }
  'interactive-showcase' = @{
    subfamily = 'high_touch_interactions'; primaryJob = 'demonstrate_capability_with_interaction'; secondaryJobs = @('engagement', 'feature_demonstration'); userGoal = 'explore_and_compare_interactively'; primaryInteractionModel = 'select'; uxPatternType = 'interactive_pattern'; allowedContexts = @('product_showcases', 'interactive_marketing', 'demo_surfaces'); disallowedContexts = @('critical_confirmation', 'low_power_constrained_views'); bestFor = @('interactive_product_storytelling'); avoidWhen = @('workflow_requires_low_cognitive_load'); requiredApprovals = @('performance_review'); autonomyAllowance = 'suggest_only'; preconditions = @('pointer_and_keyboard_support', 'performance_budget_validation'); lifecycle = 'supported'; adoption = 'targeted'; evidenceType = @('production_observed', 'usability_tested'); stability = 3; accessibilityConfidence = 3; internationalizationConfidence = 2; analyticsConfidence = 3; failureCost = 3; performanceBudgetFit = 2; implementationComplexity = 4; dependencyBurden = 3; designTokenDependencyLevel = 3; contentAuthoringBurden = 3; opinionation = 4; expressiveness = 4; formality = 3; interactionIntensity = 5; visualDominance = 4; densityFeel = 3
  }
  'misc-uncurated' = @{
    subfamily = 'requires_curation'; primaryJob = 'pending_classification'; secondaryJobs = @('inventory_holding'); userGoal = 'hold_unclassified_assets'; primaryInteractionModel = 'mixed'; uxPatternType = 'uncurated_pattern'; allowedContexts = @('internal_exploration_only'); disallowedContexts = @('autonomous_selection', 'production_defaults'); bestFor = @('temporary_admin_holding'); avoidWhen = @('production_recommendation_flows'); requiredApprovals = @('design_system_review'); autonomyAllowance = 'restricted'; preconditions = @('human_review_required'); lifecycle = 'candidate'; adoption = 'none'; evidenceType = @('expert_reviewed'); stability = 2; accessibilityConfidence = 2; internationalizationConfidence = 2; analyticsConfidence = 1; failureCost = 4; performanceBudgetFit = 3; implementationComplexity = 3; dependencyBurden = 2; designTokenDependencyLevel = 2; contentAuthoringBurden = 2; opinionation = 3; expressiveness = 3; formality = 3; interactionIntensity = 3; visualDominance = 3; densityFeel = 3
  }
}

$componentsPath = Join-Path $UiLabRoot "components"
Assert-Condition -Condition (Test-Path -LiteralPath $componentsPath) -Message "Components path not found: $componentsPath"

$componentFiles = @(Get-ChildItem -LiteralPath $componentsPath -File -Recurse | Where-Object {
  (Get-NormalizedRelativePath -BasePath $componentsPath -TargetPath $_.FullName) -notmatch '^ui/'
} | Sort-Object FullName)
$componentTreeFileCount = @(Get-ChildItem -LiteralPath $componentsPath -File -Recurse).Count
$componentNames = @($componentFiles | Select-Object -ExpandProperty BaseName)
$componentLookup = @{}
foreach ($name in $componentNames) {
  $componentLookup[$name] = $true
}

$componentModuleInfo = foreach ($file in $componentFiles) {
  Get-ModuleExportInfo -File $file -ComponentsRoot $componentsPath
}

$componentModuleLookup = @{}
foreach ($info in $componentModuleInfo) {
  $componentModuleLookup[$info.file] = $info
}

$namedExports = foreach ($info in $componentModuleInfo) {
  if ($info.resolvedPrimaryNamedExport) {
    [pscustomobject]@{
      file = $info.file
      export = $info.resolvedPrimaryNamedExport
    }
  }
}

$topLevelNamedExportCollisions = @($namedExports |
  Group-Object export |
  Where-Object { $_.Count -gt 1 } |
  ForEach-Object {
    [pscustomobject]@{
      export = $_.Name
      files = @($_.Group.file | Sort-Object)
    }
  })

$folderBlueprints = @(
  @{ key = 'library'; label = 'Library'; path = 'library' },
  @{ key = 'components'; label = 'Components'; path = 'components' },
  @{ key = 'layouts'; label = 'Layouts'; path = 'layouts' },
  @{ key = 'hooks'; label = 'Hooks'; path = 'hooks' },
  @{ key = 'lib'; label = 'Lib'; path = 'lib' },
  @{ key = 'providers'; label = 'Providers'; path = 'providers' },
  @{ key = 'store'; label = 'Store'; path = 'store' },
  @{ key = 'configs'; label = 'Configs'; path = 'configs' },
  @{ key = 'docs'; label = 'Docs'; path = 'docs' },
  @{ key = 'styling'; label = 'Styling'; path = 'styling' }
)

$folderStats = foreach ($folder in $folderBlueprints) {
  $folderPath = Join-Path $UiLabRoot $folder.path
  $fileCount = if ($folder.key -eq 'components') {
    $componentTreeFileCount
  } elseif (Test-Path -LiteralPath $folderPath) {
    @(Get-ChildItem -LiteralPath $folderPath -File -Recurse).Count
  } else {
    0
  }
  $countNote = if ($folder.key -eq 'components') { 'recursive component tree count' } else { 'recursive folder count' }

  [pscustomobject]@{
    key = $folder.key
    label = $folder.label
    path = ("ui_lab/{0}" -f $folder.path)
    fileCount = $fileCount
    countNote = $countNote
  }
}

$landingProductCount = @($componentNames | Where-Object { $_ -like 'LandingProduct*' }).Count
$landingCount = @($componentNames | Where-Object { $_ -like 'Landing*' -and $_ -notlike 'LandingProduct*' }).Count
$nonLandingCount = $componentNames.Count - $landingProductCount

$shelfBlueprints = @(
  @{ key = 'landing-product-system'; label = 'LandingProduct System'; description = 'Enterprise landing/product sections with dedicated chapter guidance, starter kits, and deeper operating-model language.'; highlights = @('LandingProductProof', 'LandingProductQBRFramework', 'LandingProductOperatingSystem', 'LandingProductTrustRegistry') },
  @{ key = 'landing-marketing'; label = 'Landing and Marketing'; description = 'General marketing sections, landing-page building blocks, and non-LandingProduct conversion surfaces.'; highlights = @('HeroSection', 'FeatureGrid', 'SocialProof', 'PricingCards', 'CTASection', 'FAQSection', 'AnnouncementBanner', 'Newsletter') },
  @{ key = 'data-admin'; label = 'Data and Admin'; description = 'Dashboards, tables, charts, monitoring, timelines, and administrative information surfaces.'; highlights = @('BentoGrid', 'KPICard', 'DataTable', 'AdvancedFilter', 'Timeline', 'RadarChart', 'NetworkGraph', 'MetricsDashboard') },
  @{ key = 'forms-authoring'; label = 'Forms and Authoring'; description = 'Input systems, editors, uploads, search filters, and workflow authoring tools.'; highlights = @('FormInput', 'FormSelect', 'FormTextarea', 'AdvancedAutocomplete', 'DateRangePicker', 'FileUpload', 'BadgeInput', 'RichTextEditor') },
  @{ key = 'feedback-state'; label = 'Feedback and State'; description = 'Error states, dialogs, consent surfaces, loaders, and operational feedback layers.'; highlights = @('Alert', 'ConfirmDialog', 'ErrorBoundary', 'ErrorState', 'CookieConsent', 'OverlayLoader', 'PagePreloader', 'TopLoadingBar') },
  @{ key = 'ui-primitives'; label = 'UI Primitives'; description = 'Small reusable surface elements used as atoms or composable presentation building blocks.'; highlights = @('Avatar', 'Badge', 'Popover', 'Sheet', 'Tooltip', 'StatusBadge') },
  @{ key = 'navigation-command'; label = 'Navigation and Command'; description = 'Menus, command surfaces, navigational scaffolding, and page-structure affordances.'; highlights = @('CommandMenu', 'CommandPalette', 'FloatingNav', 'MegaMenu', 'MorphingNav', 'SideMenu', 'SlideTabs', 'Breadcrumbs') },
  @{ key = 'motion-typography'; label = 'Motion and Typography'; description = 'Animated text, reveal systems, motion primitives, and presentation choreography.'; highlights = @('AnimatedText', 'BlurFade', 'PageTransition', 'TextReveal', 'TextScramble', 'NumberTicker', 'TypingEffect', 'SparklesText') },
  @{ key = 'backgrounds-effects'; label = 'Backgrounds and Effects'; description = 'Ambient backgrounds, visual effects, particles, glow systems, and decorative depth layers.'; highlights = @('AuroraBackground', 'GridPattern', 'GradientBlobs', 'Spotlight', 'Particles', 'RetroGrid', 'BorderBeam', 'WavyBackground') },
  @{ key = 'interactive-showcase'; label = 'Interactive Showcase'; description = 'Carousels, mockups, cards, media comparison surfaces, and high-touch presentation components.'; highlights = @('Accordion3D', 'ComparisonSlider', 'ExpandableCard', 'InfiniteCarousel', 'InteractiveGrid', 'ProductCarousel', 'SpotlightCards', 'ZoomHero') },
  @{ key = 'misc-uncurated'; label = 'Misc and Uncurated'; description = 'Components that still need sharper shelf placement or clearer naming before they feel fully curated.'; highlights = @() }
)

$shelfAssignments = foreach ($name in $componentNames) {
  [pscustomobject]@{
    name = $name
    shelfKey = Get-PrimaryShelfKey -Name $name
  }
}

$shelves = foreach ($shelf in $shelfBlueprints) {
  $assigned = @($shelfAssignments | Where-Object { $_.shelfKey -eq $shelf.key } | Select-Object -ExpandProperty name | Sort-Object)
  $invalidHighlights = @($shelf.highlights | Where-Object { $_ -notin $assigned })
  Assert-Condition -Condition ($invalidHighlights.Count -eq 0) -Message "Shelf '$($shelf.label)' has invalid highlights: $($invalidHighlights -join ', ')"

  [pscustomobject]@{
    key = $shelf.key
    label = $shelf.label
    description = $shelf.description
    count = $assigned.Count
    highlights = @($shelf.highlights)
    components = @($assigned)
  }
}

$assignedCount = ($shelves | Measure-Object -Property count -Sum).Sum
Assert-Condition -Condition ($assignedCount -eq $componentNames.Count) -Message "Shelf assignment mismatch. Assigned $assignedCount components but found $($componentNames.Count) files."

$physicalShelfMismatches = @($componentModuleInfo | Where-Object {
  $_.physicalShelfKey -and $_.physicalShelfKey -ne (Get-PrimaryShelfKey -Name $_.file)
})

Assert-Condition -Condition ($physicalShelfMismatches.Count -eq 0) -Message ("Components are stored in the wrong shelf folders: {0}" -f (($physicalShelfMismatches | ForEach-Object {
  '{0} -> {1} (expected {2})' -f $_.file, $_.physicalShelfKey, (Get-PrimaryShelfKey -Name $_.file)
}) -join '; '))

$libraryOutputRoot = Join-Path $UiLabRoot 'library'

$landingMarketingShelf = $shelves | Where-Object { $_.key -eq 'landing-marketing' } | Select-Object -First 1
$miscShelf = $shelves | Where-Object { $_.key -eq 'misc-uncurated' } | Select-Object -First 1

$starterBlueprints = @(
  @{ key = 'marketing-quickstart'; label = 'Marketing Quickstart'; useWhen = 'You need a standard marketing page without entering the heavier enterprise subsystem.'; components = @('HeroSection', 'FeatureGrid', 'SocialProof', 'PricingCards', 'CTASection', 'FAQSection', 'LogoCloud', 'AnnouncementBanner') },
  @{ key = 'dashboard-core'; label = 'Dashboard Core'; useWhen = 'You are building a product or admin surface with metrics, tables, and workflow context.'; components = @('BentoGrid', 'KPICard', 'DataTable', 'AdvancedFilter', 'Timeline', 'StepIndicator', 'Breadcrumbs', 'NotificationCenter') },
  @{ key = 'forms-operations'; label = 'Forms and Operations'; useWhen = 'You need inputs, authoring, uploads, and filtering for real application workflows.'; components = @('FormInput', 'FormSelect', 'FormTextarea', 'AdvancedAutocomplete', 'DateRangePicker', 'FileUpload', 'BadgeInput', 'SearchFilter') },
  @{ key = 'polish-layer'; label = 'Polish Layer'; useWhen = 'The structure already works and you want motion, contrast, and visual depth without random ornament.'; components = @('AnimatedText', 'BlurFade', 'AuroraBackground', 'SpotlightCards', 'ComparisonSlider', 'PageTransition', 'TextScramble', 'GradientBlobs') }
)

$starterLanes = foreach ($starter in $starterBlueprints) {
  $missing = @($starter.components | Where-Object { -not $componentLookup.ContainsKey($_) })
  Assert-Condition -Condition ($missing.Count -eq 0) -Message "Starter lane '$($starter.label)' references unknown components: $($missing -join ', ')"

  [pscustomobject]@{
    key = $starter.key
    label = $starter.label
    useWhen = $starter.useWhen
    components = @($starter.components)
  }
}

$shelfLookup = @{}
foreach ($shelf in $shelves) {
  foreach ($component in $shelf.components) {
    $shelfLookup[$component] = $shelf
  }
}

$starterLaneLookup = @{}
foreach ($starter in $starterLanes) {
  foreach ($component in $starter.components) {
    if (-not $starterLaneLookup.ContainsKey($component)) {
      $starterLaneLookup[$component] = [System.Collections.Generic.List[object]]::new()
    }

    $starterLaneLookup[$component].Add($starter)
  }
}

$componentIndexEntries = foreach ($info in ($componentModuleInfo | Sort-Object file)) {
  $shelf = $shelfLookup[$info.file]
  $starterMemberships = if ($starterLaneLookup.ContainsKey($info.file)) { @($starterLaneLookup[$info.file]) } else { @() }
  $exactNameExport = Get-ExactNameExportInfo -ComponentInfo $info -BarrelDirectory (Join-Path $libraryOutputRoot 'by-name')

  [pscustomobject]@{
    name = $info.file
    sourcePath = ("ui_lab/components/{0}" -f $info.relativeComponentPath)
    shelfKey = $shelf.key
    shelfLabel = $shelf.label
    shelfImportPath = ("ui_lab/library/shelves/{0}" -f $shelf.key)
    shelfExactImportPath = ("ui_lab/library/shelves/{0}/components" -f $shelf.key)
    shelfMetaPath = ("ui_lab/library/shelves/{0}/meta.json" -f $shelf.key)
    starterLaneKeys = @($starterMemberships | ForEach-Object { $_.key })
    starterLaneLabels = @($starterMemberships | ForEach-Object { $_.label })
    starterLaneImportPaths = @($starterMemberships | ForEach-Object { "ui_lab/library/starter-lanes/{0}" -f $_.key })
    starterLaneExactImportPaths = @($starterMemberships | ForEach-Object { "ui_lab/library/starter-lanes/{0}/components" -f $_.key })
    starterLaneMetaPaths = @($starterMemberships | ForEach-Object { "ui_lab/library/starter-lanes/{0}/meta.json" -f $_.key })
    exactNameImportPath = 'ui_lab/library/by-name'
    exactNameExportKind = $exactNameExport.exportKind
    exactNameSourceExport = $exactNameExport.sourceExport
    namedExports = @($info.namedExports)
    hasDefaultExport = $info.hasDefaultExport
  }
}

$generatedAtIso = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
$metadataOwner = 'ui_lab_design_system_team'

$manualReviewOverrides = @()
if (Test-Path $ManualReviewOverridesPath) {
  $manualReviewOverridesRaw = Get-Content -LiteralPath $ManualReviewOverridesPath -Raw | ConvertFrom-Json
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

$componentDecisionEntries = foreach ($entry in $componentIndexEntries) {
  $shelf = $shelfLookup[$entry.name]
  $starterMemberships = if ($starterLaneLookup.ContainsKey($entry.name)) { @($starterLaneLookup[$entry.name]) } else { @() }
  $manualReviewOverride = $null
  if ($manualReviewLookup.ContainsKey($entry.name)) {
    $manualReviewOverride = $manualReviewLookup[$entry.name]
  }

  $decisionMetadata = New-DecisionMetadataV2 `
    -ComponentEntry $entry `
    -Shelf $shelf `
    -ComponentName $entry.name `
    -StarterMemberships $starterMemberships `
    -Profiles $metadataProfileDefaults `
    -AnchorMap $metadataScoreAnchors `
    -GeneratedAt $generatedAtIso `
    -Owner $metadataOwner `
    -ManualReviewOverride $manualReviewOverride

  [pscustomobject]@{
    name = $entry.name
    sourcePath = $entry.sourcePath
    shelfKey = $entry.shelfKey
    shelfLabel = $entry.shelfLabel
    shelfImportPath = $entry.shelfImportPath
    shelfExactImportPath = $entry.shelfExactImportPath
    shelfMetaPath = $entry.shelfMetaPath
    starterLaneKeys = @($entry.starterLaneKeys)
    starterLaneLabels = @($entry.starterLaneLabels)
    starterLaneImportPaths = @($entry.starterLaneImportPaths)
    starterLaneExactImportPaths = @($entry.starterLaneExactImportPaths)
    starterLaneMetaPaths = @($entry.starterLaneMetaPaths)
    exactNameImportPath = $entry.exactNameImportPath
    exactNameExportKind = $entry.exactNameExportKind
    exactNameSourceExport = $entry.exactNameSourceExport
    namedExports = @($entry.namedExports)
    hasDefaultExport = $entry.hasDefaultExport
    reviewedBy = $decisionMetadata.layers.criticalReview.reviewedBy
    reviewMethod = $decisionMetadata.layers.criticalReview.reviewMethod
    manualReviewed = $decisionMetadata.layers.provenance.manualReviewed
    reviewNotes = @($decisionMetadata.layers.provenance.reviewNotes)
    decisionMetadataV2 = $decisionMetadata
  }
}

$componentRankedEntries = @(
  $componentDecisionEntries | ForEach-Object {
    $ranking = Get-ComponentRanking -ComponentEntry $_ -Metadata $_.decisionMetadataV2
    $_.decisionMetadataV2 | Add-Member -NotePropertyName ranking -NotePropertyValue $ranking -Force

    [pscustomobject]@{
      name = $_.name
      sourcePath = $_.sourcePath
      shelfKey = $_.shelfKey
      shelfLabel = $_.shelfLabel
      shelfImportPath = $_.shelfImportPath
      shelfExactImportPath = $_.shelfExactImportPath
      shelfMetaPath = $_.shelfMetaPath
      starterLaneKeys = @($_.starterLaneKeys)
      starterLaneLabels = @($_.starterLaneLabels)
      starterLaneImportPaths = @($_.starterLaneImportPaths)
      starterLaneExactImportPaths = @($_.starterLaneExactImportPaths)
      starterLaneMetaPaths = @($_.starterLaneMetaPaths)
      exactNameImportPath = $_.exactNameImportPath
      exactNameExportKind = $_.exactNameExportKind
      exactNameSourceExport = $_.exactNameSourceExport
      namedExports = @($_.namedExports)
      hasDefaultExport = $_.hasDefaultExport
      reviewedBy = $_.reviewedBy
      reviewMethod = $_.reviewMethod
      manualReviewed = $_.manualReviewed
      reviewNotes = @($_.reviewNotes)
      decisionMetadataV2 = $_.decisionMetadataV2
      ranking = $ranking
    }
  }
)

$componentRankedEntries = @(
  $componentRankedEntries |
    Sort-Object @{ Expression = { $_.ranking.riskAdjustedSelectionScore }; Descending = $true }, @{ Expression = { $_.ranking.trustScore }; Descending = $true }, @{ Expression = { $_.ranking.criticalityScore }; Descending = $false }, name
)

$globalRank = 0
foreach ($component in $componentRankedEntries) {
  $globalRank += 1
  $component.ranking.globalRank = $globalRank
}

foreach ($shelf in $shelves) {
  $shelfEntries = @($componentRankedEntries | Where-Object { $_.shelfKey -eq $shelf.key } | Sort-Object @{ Expression = { $_.ranking.riskAdjustedSelectionScore }; Descending = $true }, @{ Expression = { $_.ranking.trustScore }; Descending = $true }, @{ Expression = { $_.ranking.criticalityScore }; Descending = $false }, name)
  $shelfRank = 0
  foreach ($component in $shelfEntries) {
    $shelfRank += 1
    $component.ranking.shelfRank = $shelfRank
  }
}

foreach ($starter in $starterLanes) {
  $starterEntries = @($componentRankedEntries | Where-Object { $_.starterLaneKeys -contains $starter.key } | Sort-Object @{ Expression = { $_.ranking.riskAdjustedSelectionScore }; Descending = $true }, @{ Expression = { $_.ranking.trustScore }; Descending = $true }, @{ Expression = { $_.ranking.criticalityScore }; Descending = $false }, name)
  $starterRank = 0
  foreach ($component in $starterEntries) {
    $starterRank += 1
    if (-not $component.ranking.starterLaneRanks) {
      $component.ranking.starterLaneRanks = [ordered]@{}
    }
    $component.ranking.starterLaneRanks[$starter.key] = $starterRank
  }
}

$componentRankSummary = @($componentRankedEntries | Select-Object name, shelfKey, globalRank, shelfRank, reviewedBy, ranking)

$unresolvedComponentIndexEntries = @($componentIndexEntries | Where-Object { $_.exactNameExportKind -eq 'unresolved' })
$unresolvedComponentIndexNames = @($unresolvedComponentIndexEntries | ForEach-Object { $_.name })
Assert-Condition -Condition ($unresolvedComponentIndexEntries.Count -eq 0) -Message "Exact-name grouped entrypoints are missing for: $($unresolvedComponentIndexNames -join ', ')"
$generatedLibraryFiles = [System.Collections.Generic.List[object]]::new()

$rootLibraryReadmeLines = [System.Collections.Generic.List[string]]::new()
$rootLibraryReadmeLines.Add('# UI Lab Grouped Access Layer')
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('This folder is generated. It provides grouped entrypoints over the component source tree and keeps the shelf taxonomy consumable from one place.')
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('- Repo guide: `ui_lab/docs/UI_LAB_LIBRARY_GUIDE.md`')
$rootLibraryReadmeLines.Add('- LandingProduct guide: `ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md`')
$rootLibraryReadmeLines.Add('- Root grouped barrel: `ui_lab/library/index.ts`')
$rootLibraryReadmeLines.Add('- By-name barrel: `ui_lab/library/by-name/index.ts`')
$rootLibraryReadmeLines.Add('- Component index: `ui_lab/library/component-index.json`')
$rootLibraryReadmeLines.Add('- Shelf exact-component barrels: `ui_lab/library/shelves/*/components.ts`')
$rootLibraryReadmeLines.Add('- Starter-lane exact-component barrels: `ui_lab/library/starter-lanes/*/components.ts`')
$rootLibraryReadmeLines.Add('- Shelf metadata files: `ui_lab/library/shelves/*/meta.json`')
$rootLibraryReadmeLines.Add('- Starter-lane metadata files: `ui_lab/library/starter-lanes/*/meta.json`')
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('## Lookup')
$rootLibraryReadmeLines.Add('- Use `ui_lab/library/by-name` when you know the component filename but not its shelf.')
$rootLibraryReadmeLines.Add('- Use `ui_lab/library/component-index.json` for machine-readable lookup by name, shelf, and starter-lane membership.')
$rootLibraryReadmeLines.Add('- Use `components.ts` inside a shelf or starter lane when you want exact file-name exports only, without helper exports.')
$rootLibraryReadmeLines.Add('- Use `meta.json` inside a shelf or starter lane when you want folder-local machine-readable metadata.')
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('## Shelves')
foreach ($shelf in $shelves) {
  $rootLibraryReadmeLines.Add((New-GuideLine '- `{0}`: `ui_lab/library/shelves/{1}`' $shelf.label $shelf.key))
}
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('## Starter Lanes')
foreach ($starter in $starterLanes) {
  $rootLibraryReadmeLines.Add((New-GuideLine '- `{0}`: `ui_lab/library/starter-lanes/{1}`' $starter.label $starter.key))
}

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'README.md'
  content = ($rootLibraryReadmeLines -join "`r`n")
})

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'index.ts'
  content = @(
    '// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1',
    'export * as ByName from "./by-name";',
    'export * as ShelfComponents from "./shelves/components";',
    'export * as Shelves from "./shelves";',
    'export * as StarterLaneComponents from "./starter-lanes/components";',
    'export * as StarterLanes from "./starter-lanes";'
  ) -join "`r`n"
})

$byNameDirectory = Join-Path $libraryOutputRoot 'by-name'
$byNameBarrelLines = @('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($componentModuleInfo | Sort-Object file | ForEach-Object {
  (Get-ExactNameExportInfo -ComponentInfo $_ -BarrelDirectory $byNameDirectory).line
})

$byNameReadmeLines = [System.Collections.Generic.List[string]]::new()
$byNameReadmeLines.Add('# By Name')
$byNameReadmeLines.Add('')
$byNameReadmeLines.Add('Use this folder when you know the component filename but not the shelf or starter lane.')
$byNameReadmeLines.Add('')
$byNameReadmeLines.Add((New-GuideLine '- Exact-name coverage: `{0}` catalog components' $componentIndexEntries.Count))
$byNameReadmeLines.Add('- Barrel: `index.ts`')
$byNameReadmeLines.Add('- Machine-readable index: `../component-index.json`')
$byNameReadmeLines.Add('- Export mode follows the real source API: named exports when available, aliases when needed, default aliases for default-only files, and namespace exports for multi-export files like `LandingCTA`, `ScrollVelocity`, and `Toast`.')

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'by-name\index.ts'
  content = ($byNameBarrelLines -join "`r`n")
})

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'by-name\README.md'
  content = ($byNameReadmeLines -join "`r`n")
})

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'component-index.json'
  content = (@($componentIndexEntries) | ConvertTo-Json -Depth 6)
})

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'shelves\index.ts'
  content = (@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($shelves | ForEach-Object {
    $namespace = Convert-ToPascalCase -Text $_.key
    New-GuideLine 'export * as {0} from "./{1}";' $namespace $_.key
  })) -join "`r`n"
})

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'shelves\components.ts'
  content = (@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($shelves | ForEach-Object {
    $namespace = Convert-ToPascalCase -Text $_.key
    New-GuideLine 'export * as {0} from "./{1}/components";' $namespace $_.key
  })) -join "`r`n"
})

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'starter-lanes\index.ts'
  content = (@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($starterLanes | ForEach-Object {
    $namespace = Convert-ToPascalCase -Text $_.key
    New-GuideLine 'export * as {0} from "./{1}";' $namespace $_.key
  })) -join "`r`n"
})

$generatedLibraryFiles.Add([pscustomobject]@{
  path = Join-Path $libraryOutputRoot 'starter-lanes\components.ts'
  content = (@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($starterLanes | ForEach-Object {
    $namespace = Convert-ToPascalCase -Text $_.key
    New-GuideLine 'export * as {0} from "./{1}/components";' $namespace $_.key
  })) -join "`r`n"
})

foreach ($shelf in $shelves) {
  $shelfComponentInfos = @($shelf.components | ForEach-Object { $componentModuleLookup[$_] })
  $shelfDirectory = Join-Path $libraryOutputRoot ("shelves\{0}" -f $shelf.key)
  $shelfBarrelLines = Get-PrimaryBarrelLines -ComponentInfos $shelfComponentInfos -BarrelDirectory $shelfDirectory
  $shelfExactBarrelLines = Get-ExactNameBarrelLines -ComponentInfos $shelfComponentInfos -BarrelDirectory $shelfDirectory
  $shelfReadmeLines = [System.Collections.Generic.List[string]]::new()
  $shelfReadmeLines.Add((New-GuideLine '# {0}' $shelf.label))
  $shelfReadmeLines.Add('')
  $shelfReadmeLines.Add($shelf.description)
  $shelfReadmeLines.Add('')
  $shelfReadmeLines.Add((New-GuideLine '- Component count: `{0}`' $shelf.count))
  if ($shelf.highlights.Count -gt 0) {
    $shelfReadmeLines.Add((New-GuideLine '- Good first picks: {0}' (Join-CodeList -Items $shelf.highlights)))
  }
  $shelfReadmeLines.Add('- Exact-component barrel: `components.ts`')
  $shelfReadmeLines.Add('- Full export barrel: `index.ts`')
  $shelfReadmeLines.Add('- Machine-readable metadata: `meta.json`')

  $shelfMeta = [pscustomobject]@{
    key = $shelf.key
    label = $shelf.label
    description = $shelf.description
    count = $shelf.count
    highlights = @($shelf.highlights)
    components = @($shelf.components)
    exactExportPath = ("ui_lab/library/shelves/{0}/components.ts" -f $shelf.key)
    fullExportPath = ("ui_lab/library/shelves/{0}/index.ts" -f $shelf.key)
    readmePath = ("ui_lab/library/shelves/{0}/README.md" -f $shelf.key)
  }

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("shelves\{0}\index.ts" -f $shelf.key)
    content = ((@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + $shelfBarrelLines) -join "`r`n")
  })

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("shelves\{0}\components.ts" -f $shelf.key)
    content = ($shelfExactBarrelLines -join "`r`n")
  })

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("shelves\{0}\README.md" -f $shelf.key)
    content = ($shelfReadmeLines -join "`r`n")
  })

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("shelves\{0}\meta.json" -f $shelf.key)
    content = ($shelfMeta | ConvertTo-Json -Depth 5)
  })
}

foreach ($starter in $starterLanes) {
  $starterComponentInfos = @($starter.components | ForEach-Object { $componentModuleLookup[$_] })
  $starterDirectory = Join-Path $libraryOutputRoot ("starter-lanes\{0}" -f $starter.key)
  $starterBarrelLines = Get-PrimaryBarrelLines -ComponentInfos $starterComponentInfos -BarrelDirectory $starterDirectory
  $starterExactBarrelLines = Get-ExactNameBarrelLines -ComponentInfos $starterComponentInfos -BarrelDirectory $starterDirectory
  $starterReadmeLines = [System.Collections.Generic.List[string]]::new()
  $starterReadmeLines.Add((New-GuideLine '# {0}' $starter.label))
  $starterReadmeLines.Add('')
  $starterReadmeLines.Add((New-GuideLine '- Use when: {0}' $starter.useWhen))
  $starterReadmeLines.Add((New-GuideLine '- Components: {0}' (Join-CodeList -Items $starter.components)))
  $starterReadmeLines.Add('- Exact-component barrel: `components.ts`')
  $starterReadmeLines.Add('- Full export barrel: `index.ts`')
  $starterReadmeLines.Add('- Machine-readable metadata: `meta.json`')

  $starterMeta = [pscustomobject]@{
    key = $starter.key
    label = $starter.label
    useWhen = $starter.useWhen
    count = $starter.components.Count
    components = @($starter.components)
    exactExportPath = ("ui_lab/library/starter-lanes/{0}/components.ts" -f $starter.key)
    fullExportPath = ("ui_lab/library/starter-lanes/{0}/index.ts" -f $starter.key)
    readmePath = ("ui_lab/library/starter-lanes/{0}/README.md" -f $starter.key)
  }

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("starter-lanes\{0}\index.ts" -f $starter.key)
    content = ((@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + $starterBarrelLines) -join "`r`n")
  })

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("starter-lanes\{0}\components.ts" -f $starter.key)
    content = ($starterExactBarrelLines -join "`r`n")
  })

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("starter-lanes\{0}\README.md" -f $starter.key)
    content = ($starterReadmeLines -join "`r`n")
  })

  $generatedLibraryFiles.Add([pscustomobject]@{
    path = Join-Path $libraryOutputRoot ("starter-lanes\{0}\meta.json" -f $starter.key)
    content = ($starterMeta | ConvertTo-Json -Depth 5)
  })
}

$libraryFolderStat = $folderStats | Where-Object { $_.key -eq 'library' } | Select-Object -First 1
if ($libraryFolderStat) {
  $libraryFolderStat.fileCount = $generatedLibraryFiles.Count
  $libraryFolderStat.countNote = 'generated grouped access layer count'
}

$variantSignals = @('Component', 'Effect', 'Mockup', 'Explorer', 'Indicator', 'Bar', 'Collapsible', 'Band', 'Wrapper', 'OnScroll')
$namingWatchlist = [System.Collections.Generic.List[object]]::new()
$namingSeen = @{}

foreach ($name in $componentNames) {
  foreach ($signal in $variantSignals) {
    if ($name.Length -le $signal.Length) {
      continue
    }

    if ($name.EndsWith($signal)) {
      $baseName = $name.Substring(0, $name.Length - $signal.Length)
      if ($componentLookup.ContainsKey($baseName)) {
        $pairKey = "$baseName->$name"
        if (-not $namingSeen.ContainsKey($pairKey)) {
          $namingSeen[$pairKey] = $true
          $namingWatchlist.Add([pscustomobject]@{
            base = $baseName
            variant = $name
            signal = $signal
          })
        }
      }
    }
  }
}

$namingWatchlist = @($namingWatchlist | Sort-Object base, variant)
$namingRecommendations = foreach ($entry in $namingWatchlist) {
  $recommendation = Get-NamingRecommendation -Signal $entry.signal
  [pscustomobject]@{
    base = $entry.base
    variant = $entry.variant
    signal = $entry.signal
    priority = $recommendation.priority
    action = $recommendation.action
    rationale = $recommendation.rationale
  }
}

$metadataScoreAnchorsSerializable = [ordered]@{}
foreach ($dimension in @($metadataScoreAnchors.Keys | Sort-Object)) {
  $scoreMap = [ordered]@{}
  foreach ($scoreKey in @($metadataScoreAnchors[$dimension].Keys | Sort-Object)) {
    $scoreMap[[string]$scoreKey] = $metadataScoreAnchors[$dimension][$scoreKey]
  }

  $metadataScoreAnchorsSerializable[$dimension] = $scoreMap
}

$registry = [pscustomobject]@{
  generatedAt = $generatedAtIso
  source = [pscustomobject]@{
    root = 'ui_lab'
    groupedAccessRoot = 'ui_lab/library'
    groupedByNameRoot = 'ui_lab/library/by-name'
    componentIndex = 'ui_lab/library/component-index.json'
    components = 'ui_lab/components'
    componentShelfRoot = 'ui_lab/components/shelves'
    generator = 'ui_lab/docs/generate-ui-lab-library-catalog.ps1'
    metadataGuide = 'ui_lab/docs/UI_LIBRARY_METADATA_V2.md'
    metadataProfiles = 'ui_lab/configs/ui-library-metadata-v2-profiles.json'
    componentMetadata = 'ui_lab/configs/ui-library-component-metadata-v2.json'
    componentRankings = 'ui_lab/configs/ui-library-component-rankings-v2.json'
    landingProductGuide = 'ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md'
    landingProductRegistry = 'ui_lab/configs/landing-product-registry.json'
  }
  metadataModel = [pscustomobject]@{
    version = 'v2'
    layers = @('identity', 'intent', 'eligibility', 'readiness', 'operationalCost', 'behavioralCharacter', 'provenance')
    scoreScale = '1-5'
    autonomyAllowanceEnum = @('auto_select', 'suggest_only', 'human_review_required', 'restricted')
    lifecycleEnum = @('candidate', 'supported', 'deprecated', 'retired')
    maintainedBy = $metadataOwner
    scoreAnchors = $metadataScoreAnchorsSerializable
  }
  metadataProfiles = @($metadataProfileDefaults.GetEnumerator() | ForEach-Object {
    [pscustomobject]@{
      shelfKey = $_.Key
      profile = $_.Value
    }
  } | Sort-Object shelfKey)
  stats = [pscustomobject]@{
    topLevelComponentFiles = $componentNames.Count
    componentTreeFiles = $componentTreeFileCount
    landingProductComponents = $landingProductCount
    nonLandingProductComponents = $nonLandingCount
    legacyLandingPrefixComponents = $landingCount
    landingMarketingShelfComponents = $landingMarketingShelf.count
    miscUncuratedComponents = $miscShelf.count
    shelfCount = $shelves.Count
    starterLaneCount = $starterLanes.Count
    groupedAccessFiles = $generatedLibraryFiles.Count
    componentIndexEntries = $componentIndexEntries.Count
    namingWatchlistCount = $namingWatchlist.Count
    topLevelNamedExportCollisionCount = $topLevelNamedExportCollisions.Count
  }
  folders = @($folderStats)
  shelves = @($shelves)
  starterLanes = @($starterLanes)
  componentLookup = @($componentRankedEntries)
  namingWatchlist = @($namingWatchlist)
  namingRecommendations = @($namingRecommendations)
  topLevelNamedExportCollisions = @($topLevelNamedExportCollisions)
  qa = [pscustomobject]@{
    everyComponentAssignedToOneShelf = $true
    starterLanesReferenceExistingComponents = $true
    everyComponentHasExactNameEntrypoint = ($unresolvedComponentIndexEntries.Count -eq 0)
    folderStatsGeneratedFromDisk = $true
    noTopLevelNamedExportCollisions = ($topLevelNamedExportCollisions.Count -eq 0)
    metadataV2PresentForEveryComponent = ($componentRankedEntries.Count -eq $componentIndexEntries.Count)
    metadataV2SchemaVersionConsistent = (@($componentRankedEntries | Where-Object { $_.decisionMetadataV2.schemaVersion -ne 'ui-library-metadata-v2' }).Count -eq 0)
    physicalShelfFoldersMatchPrimaryShelf = ($physicalShelfMismatches.Count -eq 0)
  }
}

$registryDirectory = Split-Path -Parent $RegistryOutputPath
if (-not (Test-Path -LiteralPath $registryDirectory)) {
  New-Item -ItemType Directory -Path $registryDirectory -Force | Out-Null
}

$registry | ConvertTo-Json -Depth 14 | Set-Content -LiteralPath $RegistryOutputPath -Encoding utf8

$metadataProfilesDirectory = Split-Path -Parent $MetadataProfilesOutputPath
if (-not (Test-Path -LiteralPath $metadataProfilesDirectory)) {
  New-Item -ItemType Directory -Path $metadataProfilesDirectory -Force | Out-Null
}

(@($metadataProfileDefaults.GetEnumerator() | ForEach-Object {
  [pscustomobject]@{
    shelfKey = $_.Key
    profile = $_.Value
  }
} | Sort-Object shelfKey)) | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $MetadataProfilesOutputPath -Encoding utf8

$componentMetadataDirectory = Split-Path -Parent $ComponentMetadataOutputPath
if (-not (Test-Path -LiteralPath $componentMetadataDirectory)) {
  New-Item -ItemType Directory -Path $componentMetadataDirectory -Force | Out-Null
}

@($componentRankedEntries) | ConvertTo-Json -Depth 14 | Set-Content -LiteralPath $ComponentMetadataOutputPath -Encoding utf8

$componentRankingsDirectory = Split-Path -Parent $ComponentRankingsOutputPath
if (-not (Test-Path -LiteralPath $componentRankingsDirectory)) {
  New-Item -ItemType Directory -Path $componentRankingsDirectory -Force | Out-Null
}

@($componentRankSummary) | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ComponentRankingsOutputPath -Encoding utf8

$guideLines = [System.Collections.Generic.List[string]]::new()
$guideLines.Add('# UI Lab Library Guide')
$guideLines.Add('')
$guideLines.Add('This is the repo-level entrypoint. Use it to decide where to start before you dive into any single subsystem.')
$guideLines.Add('')
$guideLines.Add('## Current Snapshot')
$guideLines.Add("- Catalog component files: $($componentNames.Count)")
$guideLines.Add("- Component tree files (including nested ui atoms): $componentTreeFileCount")
$guideLines.Add((New-GuideLine '- Source component shelf root: `{0}`' 'ui_lab/components/shelves'))
$guideLines.Add("- LandingProduct components: $landingProductCount")
$guideLines.Add("- Non-LandingProduct components: $nonLandingCount")
$guideLines.Add("- Legacy `Landing*` prefix components outside LandingProduct: $landingCount")
$guideLines.Add("- Shelf count: $($shelves.Count)")
$guideLines.Add("- Starter lanes: $($starterLanes.Count)")
$guideLines.Add((New-GuideLine '- Grouped access root: `{0}`' 'ui_lab/library'))
$guideLines.Add((New-GuideLine '- By-name barrel: `{0}`' 'ui_lab/library/by-name'))
$guideLines.Add((New-GuideLine '- Component index: `{0}`' 'ui_lab/library/component-index.json'))
$guideLines.Add((New-GuideLine '- Shelf exact-component barrels: `{0}`' 'ui_lab/library/shelves/*/components.ts'))
$guideLines.Add((New-GuideLine '- Starter-lane exact-component barrels: `{0}`' 'ui_lab/library/starter-lanes/*/components.ts'))
$guideLines.Add((New-GuideLine '- Shelf metadata files: `{0}`' 'ui_lab/library/shelves/*/meta.json'))
$guideLines.Add((New-GuideLine '- Starter-lane metadata files: `{0}`' 'ui_lab/library/starter-lanes/*/meta.json'))
$guideLines.Add((New-GuideLine '- Metadata v2 profiles: `{0}`' 'ui_lab/configs/ui-library-metadata-v2-profiles.json'))
$guideLines.Add((New-GuideLine '- Component metadata v2: `{0}`' 'ui_lab/configs/ui-library-component-metadata-v2.json'))
$guideLines.Add((New-GuideLine '- Component rankings v2: `{0}`' 'ui_lab/configs/ui-library-component-rankings-v2.json'))
$guideLines.Add("- Manual review subset: $($manualReviewOverrides.Count) components")
$guideLines.Add((New-GuideLine '- Manual review overrides: `{0}`' 'ui_lab/configs/ui-library-manual-review-overrides.json'))
$guideLines.Add("- Top-level named export collisions: $($topLevelNamedExportCollisions.Count)")
$guideLines.Add((New-GuideLine '- Machine-readable registry: `{0}`' 'ui_lab/configs/ui-lab-registry.json'))
$guideLines.Add((New-GuideLine '- Metadata specification: `{0}`' 'ui_lab/docs/UI_LIBRARY_METADATA_V2.md'))
$guideLines.Add((New-GuideLine '- LandingProduct subsystem guide: `{0}`' 'ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md'))
$guideLines.Add((New-GuideLine '- Curation queue: `{0}`' 'ui_lab/docs/UI_LAB_CURATION_QUEUE.md'))
$guideLines.Add((New-GuideLine '- Generator: `{0}`' 'ui_lab/docs/generate-ui-lab-library-catalog.ps1'))
$guideLines.Add('')
$guideLines.Add('## First Stops')
$guideLines.Add('1. Start with the starter lanes if you are building a page or product surface from scratch.')
$guideLines.Add('2. Use `ui_lab/library/by-name` when you know the component filename but not the shelf.')
$guideLines.Add('3. Jump into the LandingProduct subsystem only when you actually need enterprise page depth or page-scale systems language.')
$guideLines.Add('4. Treat the misc shelf and the naming watchlist as admin debt, not as default starting points.')
$guideLines.Add('5. Use `ui_lab/configs/ui-library-manual-review-overrides.json` when you need components with explicit stance, proof obligations, kill-switch criteria, and evidence references.')
$guideLines.Add('')
$guideLines.Add('## Lookup Surfaces')
$guideLines.Add((New-GuideLine '- By-name barrel: `{0}`' 'ui_lab/library/by-name'))
$guideLines.Add((New-GuideLine '- Machine-readable component index: `{0}`' 'ui_lab/library/component-index.json'))
$guideLines.Add('- Each shelf and starter-lane folder now also ships `components.ts`, which exposes exact file-name entries without helper exports.')
$guideLines.Add('- Each shelf and starter-lane folder also ships `meta.json`, so folder-local machine-readable metadata lives next to the human README and barrels.')
$guideLines.Add('')
$guideLines.Add('## Folder Map')

foreach ($folder in $folderStats) {
  $guideLines.Add((New-GuideLine '- {0}: `{1}` files in `{2}` ({3})' $folder.label $folder.fileCount $folder.path $folder.countNote))
}

$guideLines.Add('')
$guideLines.Add('## Starter Lanes')

foreach ($starter in $starterLanes) {
  $guideLines.Add('')
  $guideLines.Add("### $($starter.label)")
  $guideLines.Add("- Use when: $($starter.useWhen)")
  $guideLines.Add("- Components: $(Join-CodeList -Items $starter.components)")
}

$guideLines.Add('')
$guideLines.Add('## Shelf Map')

foreach ($shelf in $shelves) {
  $guideLines.Add('')
  $guideLines.Add("### $($shelf.label) ($($shelf.count))")
  $guideLines.Add("- Description: $($shelf.description)")
  if ($shelf.highlights.Count -gt 0) {
    $guideLines.Add("- Good first picks: $(Join-CodeList -Items $shelf.highlights)")
  }
  if ($shelf.key -eq 'landing-product-system') {
    $guideLines.Add((New-GuideLine '- Follow-up: use `{0}` for the curated chapter map and starter kits.' 'ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md'))
  }
  if ($shelf.key -eq 'misc-uncurated') {
    if ($shelf.count -eq 0) {
      $guideLines.Add('- Admin note: currently empty. Keep it that way.')
    } else {
      $guideLines.Add('- Admin note: if this shelf grows, the repo is drifting back toward a pile.')
    }
  }
}

$guideLines.Add('')
$guideLines.Add('## Naming Watchlist')
$guideLines.Add('These pairs are not automatically wrong, but they are the first place to inspect when the library feels ambiguous or redundant.')

if ($namingWatchlist.Count -eq 0) {
  $guideLines.Add('- No obvious suffix-based naming collisions detected.')
} else {
  foreach ($entry in $namingWatchlist | Select-Object -First 12) {
    $guideLines.Add((New-GuideLine '- `{0}` and `{1}` share the `{2}` signal' $entry.base $entry.variant $entry.signal))
  }
  if ($namingWatchlist.Count -gt 12) {
    $guideLines.Add("- Additional watchlist entries in registry: $($namingWatchlist.Count - 12)")
  }
}

$guideLines.Add('')
$guideLines.Add('## API Surface')
if ($topLevelNamedExportCollisions.Count -eq 0) {
  $guideLines.Add('- No duplicate named exports found across catalog component files.')
} else {
  foreach ($collision in $topLevelNamedExportCollisions) {
    $guideLines.Add((New-GuideLine '- `{0}` is exported by `{1}`' $collision.export (($collision.files | ForEach-Object { "``$_``" }) -join ', ')))
  }
}

$guideLines.Add('')
$guideLines.Add('## QA Status')
$guideLines.Add('- Every component file is assigned to exactly one repo-level shelf.')
$guideLines.Add('- Every starter lane references existing components only.')
$guideLines.Add('- Every catalog component filename has an exact grouped entrypoint in `ui_lab/library/by-name`.')
$guideLines.Add('- Every shelf and starter-lane folder now has a strict `components.ts` barrel for exact file-name imports only.')
$guideLines.Add('- Every registry component now includes `decisionMetadataV2` with layered intent, eligibility, readiness, cost, character, and provenance fields.')
$guideLines.Add('- Every registry component is also individually reviewed with a component-specific heuristic walk-through and written review notes.')
$guideLines.Add('- Every component metadata record is emitted into `ui_lab/configs/ui-library-component-metadata-v2.json` and marked by GitHub Copilot.')
$guideLines.Add('- Every component also has a ranked summary in `ui_lab/configs/ui-library-component-rankings-v2.json` so the library can be compared at a glance.')
$guideLines.Add('- Physical shelf folders, when present, match the generator-owned shelf classification.')
$guideLines.Add('- Folder counts are generated from disk, not manually maintained.')
$guideLines.Add('- Top-level named component exports are collision-free.')
$guideLines.Add('')
$guideLines.Add('## Refresh Command')
$guideLines.Add('```powershell')
$guideLines.Add("Set-Location 'c:\Users\Bukanto\Downloads\pp\personal'")
$guideLines.Add('.\ui_lab\docs\generate-ui-lab-library-catalog.ps1')
$guideLines.Add('```')

$guideDirectory = Split-Path -Parent $GuideOutputPath
if (-not (Test-Path -LiteralPath $guideDirectory)) {
  New-Item -ItemType Directory -Path $guideDirectory -Force | Out-Null
}

$guideLines | Set-Content -LiteralPath $GuideOutputPath -Encoding utf8

foreach ($generatedFile in $generatedLibraryFiles) {
  $generatedDirectory = Split-Path -Parent $generatedFile.path
  if (-not (Test-Path -LiteralPath $generatedDirectory)) {
    New-Item -ItemType Directory -Path $generatedDirectory -Force | Out-Null
  }

  Set-Content -LiteralPath $generatedFile.path -Value $generatedFile.content -Encoding utf8
}

$queueLines = [System.Collections.Generic.List[string]]::new()
$queueLines.Add('# UI Lab Curation Queue')
$queueLines.Add('')
$queueLines.Add('This file is the active admin queue for the remaining naming ambiguity in the library.')
$queueLines.Add('')
$queueLines.Add('## Current Posture')
$queueLines.Add("- Naming watchlist items: $($namingRecommendations.Count)")
$queueLines.Add("- Misc shelf components: $($miscShelf.count)")
$queueLines.Add("- Top-level named export collisions: $($topLevelNamedExportCollisions.Count)")
$queueLines.Add('- Interpretation: the library is now structurally organized, and the remaining debt is mostly naming clarity rather than lost inventory.')
$queueLines.Add('')
$queueLines.Add('## Immediate Priorities')

$highPriorityItems = @($namingRecommendations | Where-Object { $_.priority -eq 'High' })
$mediumPriorityItems = @($namingRecommendations | Where-Object { $_.priority -eq 'Medium' })

if ($highPriorityItems.Count -gt 0) {
  $queueLines.Add('')
  $queueLines.Add('### High Priority')
  foreach ($item in $highPriorityItems) {
    $queueLines.Add((New-GuideLine '- `{0}` / `{1}` (`{2}`): {3} Reason: {4}' $item.base $item.variant $item.signal $item.action $item.rationale))
  }
}

if ($mediumPriorityItems.Count -gt 0) {
  $queueLines.Add('')
  $queueLines.Add('### Medium Priority')
  foreach ($item in $mediumPriorityItems) {
    $queueLines.Add((New-GuideLine '- `{0}` / `{1}` (`{2}`): {3} Reason: {4}' $item.base $item.variant $item.signal $item.action $item.rationale))
  }
}

$queueLines.Add('')
$queueLines.Add('## Admin Guardrails')
$queueLines.Add('- Do not reintroduce duplicate top-level named exports while resolving naming pairs.')
$queueLines.Add('- Keep the misc shelf at zero. If a new component cannot be shelved cleanly, the classification model needs improvement before the library grows again.')
$queueLines.Add('- Prefer sharper semantic names over generic suffixes like `Component` when future renames are justified.')
$queueLines.Add('')
$queueLines.Add('## Refresh Command')
$queueLines.Add('```powershell')
$queueLines.Add("Set-Location 'c:\Users\Bukanto\Downloads\pp\personal'")
$queueLines.Add('.\ui_lab\docs\generate-ui-lab-library-catalog.ps1')
$queueLines.Add('```')

$queueDirectory = Split-Path -Parent $QueueOutputPath
if (-not (Test-Path -LiteralPath $queueDirectory)) {
  New-Item -ItemType Directory -Path $queueDirectory -Force | Out-Null
}

$queueLines | Set-Content -LiteralPath $QueueOutputPath -Encoding utf8

Write-Host "Generated registry: $RegistryOutputPath"
Write-Host "Generated metadata profiles: $MetadataProfilesOutputPath"
Write-Host "Generated component metadata: $ComponentMetadataOutputPath"
Write-Host "Generated component rankings: $ComponentRankingsOutputPath"
Write-Host "Generated guide: $GuideOutputPath"
Write-Host "Generated queue: $QueueOutputPath"
Write-Host "Generated grouped access layer: $libraryOutputRoot"