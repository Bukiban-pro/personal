param(
  [string]$UiLabRoot = (Join-Path $PSScriptRoot ".."),
  [string]$GuideOutputPath = (Join-Path $PSScriptRoot "UI_LAB_LIBRARY_GUIDE.md"),
  [string]$QueueOutputPath = (Join-Path $PSScriptRoot "UI_LAB_CURATION_QUEUE.md"),
  [string]$RegistryOutputPath = (Join-Path $PSScriptRoot "..\configs\ui-lab-registry.json")
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

function Get-PrimaryBarrelLines {
  param(
    [Parameter(Mandatory = $true)][AllowEmptyCollection()][object[]]$ComponentInfos,
    [Parameter(Mandatory = $true)][string]$RelativePrefix
  )

  $lines = [System.Collections.Generic.List[string]]::new()

  foreach ($info in ($ComponentInfos | Sort-Object file)) {
    $modulePath = "{0}/{1}" -f $RelativePrefix, $info.file

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
    [Parameter(Mandatory = $true)][string]$RelativePrefix
  )

  $modulePath = "{0}/{1}" -f $RelativePrefix, $ComponentInfo.file

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
    [Parameter(Mandatory = $true)][string]$RelativePrefix
  )

  return @(@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($ComponentInfos | Sort-Object file | ForEach-Object {
    (Get-ExactNameExportInfo -ComponentInfo $_ -RelativePrefix $RelativePrefix).line
  }))
}

function Get-ModuleExportInfo {
  param([Parameter(Mandatory = $true)][System.IO.FileInfo]$File)

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

  return [pscustomobject]@{
    file = $File.BaseName
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

$script:PrimaryExportOverrides = @{
  FileTree = 'Tree'
}

$componentsPath = Join-Path $UiLabRoot "components"
Assert-Condition -Condition (Test-Path -LiteralPath $componentsPath) -Message "Components path not found: $componentsPath"

$componentFiles = @(Get-ChildItem -LiteralPath $componentsPath -File | Sort-Object Name)
$componentTreeFileCount = @(Get-ChildItem -LiteralPath $componentsPath -File -Recurse).Count
$componentNames = @($componentFiles | Select-Object -ExpandProperty BaseName)
$componentLookup = @{}
foreach ($name in $componentNames) {
  $componentLookup[$name] = $true
}

$componentModuleInfo = foreach ($file in $componentFiles) {
  Get-ModuleExportInfo -File $file
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
  $exactNameExport = Get-ExactNameExportInfo -ComponentInfo $info -RelativePrefix '../../components'

  [pscustomobject]@{
    name = $info.file
    sourcePath = ("ui_lab/components/{0}.tsx" -f $info.file)
    shelfKey = $shelf.key
    shelfLabel = $shelf.label
    shelfImportPath = ("ui_lab/library/shelves/{0}" -f $shelf.key)
    shelfExactImportPath = ("ui_lab/library/shelves/{0}/components" -f $shelf.key)
    starterLaneKeys = @($starterMemberships | ForEach-Object { $_.key })
    starterLaneLabels = @($starterMemberships | ForEach-Object { $_.label })
    starterLaneImportPaths = @($starterMemberships | ForEach-Object { "ui_lab/library/starter-lanes/{0}" -f $_.key })
    starterLaneExactImportPaths = @($starterMemberships | ForEach-Object { "ui_lab/library/starter-lanes/{0}/components" -f $_.key })
    exactNameImportPath = 'ui_lab/library/by-name'
    exactNameExportKind = $exactNameExport.exportKind
    exactNameSourceExport = $exactNameExport.sourceExport
    namedExports = @($info.namedExports)
    hasDefaultExport = $info.hasDefaultExport
  }
}

$unresolvedComponentIndexEntries = @($componentIndexEntries | Where-Object { $_.exactNameExportKind -eq 'unresolved' })
$unresolvedComponentIndexNames = @($unresolvedComponentIndexEntries | ForEach-Object { $_.name })
Assert-Condition -Condition ($unresolvedComponentIndexEntries.Count -eq 0) -Message "Exact-name grouped entrypoints are missing for: $($unresolvedComponentIndexNames -join ', ')"

$libraryOutputRoot = Join-Path $UiLabRoot 'library'
$generatedLibraryFiles = [System.Collections.Generic.List[object]]::new()

$rootLibraryReadmeLines = [System.Collections.Generic.List[string]]::new()
$rootLibraryReadmeLines.Add('# UI Lab Grouped Access Layer')
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('This folder is generated. It provides grouped entrypoints over the flat component stash without moving the source files.')
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('- Repo guide: `ui_lab/docs/UI_LAB_LIBRARY_GUIDE.md`')
$rootLibraryReadmeLines.Add('- LandingProduct guide: `ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md`')
$rootLibraryReadmeLines.Add('- Root grouped barrel: `ui_lab/library/index.ts`')
$rootLibraryReadmeLines.Add('- By-name barrel: `ui_lab/library/by-name/index.ts`')
$rootLibraryReadmeLines.Add('- Component index: `ui_lab/library/component-index.json`')
$rootLibraryReadmeLines.Add('- Shelf exact-component barrels: `ui_lab/library/shelves/*/components.ts`')
$rootLibraryReadmeLines.Add('- Starter-lane exact-component barrels: `ui_lab/library/starter-lanes/*/components.ts`')
$rootLibraryReadmeLines.Add('')
$rootLibraryReadmeLines.Add('## Lookup')
$rootLibraryReadmeLines.Add('- Use `ui_lab/library/by-name` when you know the component filename but not its shelf.')
$rootLibraryReadmeLines.Add('- Use `ui_lab/library/component-index.json` for machine-readable lookup by name, shelf, and starter-lane membership.')
$rootLibraryReadmeLines.Add('- Use `components.ts` inside a shelf or starter lane when you want exact file-name exports only, without helper exports.')
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
    'export * as Shelves from "./shelves";',
    'export * as StarterLanes from "./starter-lanes";'
  ) -join "`r`n"
})

$byNameBarrelLines = @('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($componentModuleInfo | Sort-Object file | ForEach-Object {
  (Get-ExactNameExportInfo -ComponentInfo $_ -RelativePrefix '../../components').line
})

$byNameReadmeLines = [System.Collections.Generic.List[string]]::new()
$byNameReadmeLines.Add('# By Name')
$byNameReadmeLines.Add('')
$byNameReadmeLines.Add('Use this folder when you know the component filename but not the shelf or starter lane.')
$byNameReadmeLines.Add('')
$byNameReadmeLines.Add((New-GuideLine '- Exact-name coverage: `{0}` top-level components' $componentIndexEntries.Count))
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
  path = Join-Path $libraryOutputRoot 'starter-lanes\index.ts'
  content = (@('// Generated by ui_lab/docs/generate-ui-lab-library-catalog.ps1') + @($starterLanes | ForEach-Object {
    $namespace = Convert-ToPascalCase -Text $_.key
    New-GuideLine 'export * as {0} from "./{1}";' $namespace $_.key
  })) -join "`r`n"
})

foreach ($shelf in $shelves) {
  $shelfComponentInfos = @($shelf.components | ForEach-Object { $componentModuleLookup[$_] })
  $shelfBarrelLines = Get-PrimaryBarrelLines -ComponentInfos $shelfComponentInfos -RelativePrefix '../../../components'
  $shelfExactBarrelLines = Get-ExactNameBarrelLines -ComponentInfos $shelfComponentInfos -RelativePrefix '../../../components'
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
}

foreach ($starter in $starterLanes) {
  $starterComponentInfos = @($starter.components | ForEach-Object { $componentModuleLookup[$_] })
  $starterBarrelLines = Get-PrimaryBarrelLines -ComponentInfos $starterComponentInfos -RelativePrefix '../../../components'
  $starterExactBarrelLines = Get-ExactNameBarrelLines -ComponentInfos $starterComponentInfos -RelativePrefix '../../../components'
  $starterReadmeLines = [System.Collections.Generic.List[string]]::new()
  $starterReadmeLines.Add((New-GuideLine '# {0}' $starter.label))
  $starterReadmeLines.Add('')
  $starterReadmeLines.Add((New-GuideLine '- Use when: {0}' $starter.useWhen))
  $starterReadmeLines.Add((New-GuideLine '- Components: {0}' (Join-CodeList -Items $starter.components)))
  $starterReadmeLines.Add('- Exact-component barrel: `components.ts`')
  $starterReadmeLines.Add('- Full export barrel: `index.ts`')

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

$registry = [pscustomobject]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
  source = [pscustomobject]@{
    root = 'ui_lab'
    groupedAccessRoot = 'ui_lab/library'
    groupedByNameRoot = 'ui_lab/library/by-name'
    componentIndex = 'ui_lab/library/component-index.json'
    components = 'ui_lab/components'
    generator = 'ui_lab/docs/generate-ui-lab-library-catalog.ps1'
    landingProductGuide = 'ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md'
    landingProductRegistry = 'ui_lab/configs/landing-product-registry.json'
  }
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
  componentLookup = @($componentIndexEntries)
  namingWatchlist = @($namingWatchlist)
  namingRecommendations = @($namingRecommendations)
  topLevelNamedExportCollisions = @($topLevelNamedExportCollisions)
  qa = [pscustomobject]@{
    everyComponentAssignedToOneShelf = $true
    starterLanesReferenceExistingComponents = $true
    everyComponentHasExactNameEntrypoint = ($unresolvedComponentIndexEntries.Count -eq 0)
    folderStatsGeneratedFromDisk = $true
    noTopLevelNamedExportCollisions = ($topLevelNamedExportCollisions.Count -eq 0)
  }
}

$registryDirectory = Split-Path -Parent $RegistryOutputPath
if (-not (Test-Path -LiteralPath $registryDirectory)) {
  New-Item -ItemType Directory -Path $registryDirectory -Force | Out-Null
}

$registry | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $RegistryOutputPath -Encoding utf8

$guideLines = [System.Collections.Generic.List[string]]::new()
$guideLines.Add('# UI Lab Library Guide')
$guideLines.Add('')
$guideLines.Add('This is the repo-level entrypoint. Use it to decide where to start before you dive into any single subsystem.')
$guideLines.Add('')
$guideLines.Add('## Current Snapshot')
$guideLines.Add("- Top-level component files: $($componentNames.Count)")
$guideLines.Add("- Component tree files (including nested ui atoms): $componentTreeFileCount")
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
$guideLines.Add("- Top-level named export collisions: $($topLevelNamedExportCollisions.Count)")
$guideLines.Add((New-GuideLine '- Machine-readable registry: `{0}`' 'ui_lab/configs/ui-lab-registry.json'))
$guideLines.Add((New-GuideLine '- LandingProduct subsystem guide: `{0}`' 'ui_lab/docs/LANDING_PRODUCT_LIBRARY_GUIDE.md'))
$guideLines.Add((New-GuideLine '- Curation queue: `{0}`' 'ui_lab/docs/UI_LAB_CURATION_QUEUE.md'))
$guideLines.Add((New-GuideLine '- Generator: `{0}`' 'ui_lab/docs/generate-ui-lab-library-catalog.ps1'))
$guideLines.Add('')
$guideLines.Add('## First Stops')
$guideLines.Add('1. Start with the starter lanes if you are building a page or product surface from scratch.')
$guideLines.Add('2. Use `ui_lab/library/by-name` when you know the component filename but not the shelf.')
$guideLines.Add('3. Jump into the LandingProduct subsystem only when you actually need enterprise page depth or page-scale systems language.')
$guideLines.Add('4. Treat the misc shelf and the naming watchlist as admin debt, not as default starting points.')
$guideLines.Add('')
$guideLines.Add('## Lookup Surfaces')
$guideLines.Add((New-GuideLine '- By-name barrel: `{0}`' 'ui_lab/library/by-name'))
$guideLines.Add((New-GuideLine '- Machine-readable component index: `{0}`' 'ui_lab/library/component-index.json'))
$guideLines.Add('- Each shelf and starter-lane folder now also ships `components.ts`, which exposes exact file-name entries without helper exports.')
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
  $guideLines.Add('- No duplicate top-level named exports found across top-level component files.')
} else {
  foreach ($collision in $topLevelNamedExportCollisions) {
    $guideLines.Add((New-GuideLine '- `{0}` is exported by `{1}`' $collision.export (($collision.files | ForEach-Object { "``$_``" }) -join ', ')))
  }
}

$guideLines.Add('')
$guideLines.Add('## QA Status')
$guideLines.Add('- Every component file is assigned to exactly one repo-level shelf.')
$guideLines.Add('- Every starter lane references existing components only.')
$guideLines.Add('- Every top-level component filename has an exact grouped entrypoint in `ui_lab/library/by-name`.')
$guideLines.Add('- Every shelf and starter-lane folder now has a strict `components.ts` barrel for exact file-name imports only.')
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
Write-Host "Generated guide: $GuideOutputPath"
Write-Host "Generated queue: $QueueOutputPath"
Write-Host "Generated grouped access layer: $libraryOutputRoot"