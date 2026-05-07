param(
  [string]$SamplesPath = (Join-Path $PSScriptRoot "..\configs\landing-product-live-samples.json"),
  [string]$ComponentsRoot = (Join-Path $PSScriptRoot "..\components")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Throw-ValidationError {
  param([Parameter(Mandatory = $true)][string]$Message)
  throw $Message
}

function Test-RequiredPropPresence {
  param(
    [Parameter(Mandatory = $true)]$Props,
    [Parameter(Mandatory = $true)][string]$PropName
  )

  return $null -ne ($Props.PSObject.Properties | Where-Object { $_.Name -eq $PropName })
}

function Get-RequiredPropsFromSource {
  param([Parameter(Mandatory = $true)][string]$SourceContent)

  $match = [regex]::Match(
    $SourceContent,
    '(?ms)export\s+interface\s+[A-Za-z0-9_]+Props(?:\s+extends[^{]+)?\s*\{(?<Body>.*?)^\}'
  )

  if (-not $match.Success) {
    return @()
  }

  $required = [System.Collections.Generic.List[string]]::new()
  foreach ($line in ($match.Groups['Body'].Value -split "`r?`n")) {
    if ($line -match '^\s*([A-Za-z0-9_]+)(\?)?\s*:\s*') {
      if (-not $Matches[2]) {
        $required.Add($Matches[1])
      }
    }
  }

  return @($required | Sort-Object -Unique)
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$sampleConfig = Get-Content -Raw -LiteralPath $SamplesPath | ConvertFrom-Json

if (-not $sampleConfig.samples -or $sampleConfig.samples.Count -lt 20) {
  Throw-ValidationError "Expected at least 20 live samples, found $(@($sampleConfig.samples).Count)."
}

$expectedChapters = @(
  "Enterprise Buying",
  "Adoption and Operations",
  "Narrative Systems",
  "Conversion and Proof",
  "Runtime Frontier",
  "Ritual Finale"
)

$seenChapters = @($sampleConfig.samples | ForEach-Object { $_.chapter } | Sort-Object -Unique)
$missingChapters = @($expectedChapters | Where-Object { $_ -notin $seenChapters })
if ($missingChapters.Count -gt 0) {
  Throw-ValidationError "Live samples are missing chapter coverage: $($missingChapters -join ', ')."
}

$componentNames = @{}
$errors = [System.Collections.Generic.List[string]]::new()

foreach ($sample in $sampleConfig.samples) {
  if ($componentNames.ContainsKey($sample.componentName)) {
    $errors.Add("Duplicate componentName: $($sample.componentName)")
  } else {
    $componentNames[$sample.componentName] = $true
  }

  $sourcePath = Join-Path $repoRoot $sample.sourcePath
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    $errors.Add("Missing source file for $($sample.componentName): $($sample.sourcePath)")
    continue
  }

  $sourceContent = Get-Content -Raw -LiteralPath $sourcePath
  if ($sourceContent -notmatch "(?m)^\s*export\s+(const|function|class)\s+$([regex]::Escape($sample.componentName))\b|^\s*export\s*\{[^}]*\b$([regex]::Escape($sample.componentName))\b[^}]*\}") {
    $errors.Add("Source file does not appear to export $($sample.componentName): $($sample.sourcePath)")
  }

  $requiredProps = Get-RequiredPropsFromSource -SourceContent $sourceContent
  foreach ($propName in $requiredProps) {
    if (-not (Test-RequiredPropPresence -Props $sample.props -PropName $propName)) {
      $errors.Add("$($sample.componentName) is missing required prop '$propName'.")
      continue
    }

    $propValue = $sample.props.PSObject.Properties[$propName].Value
    if ($null -eq $propValue) {
      $errors.Add("$($sample.componentName) required prop '$propName' is null.")
      continue
    }

    if (($propValue -is [System.Array]) -and ($propValue.Count -eq 0)) {
      $errors.Add("$($sample.componentName) required prop '$propName' is an empty array.")
    }
  }
}

if ($errors.Count -gt 0) {
  Throw-ValidationError ($errors -join [Environment]::NewLine)
}

Write-Host "LIVE_SAMPLE_VALIDATION_OK"
Write-Host ("Samples: {0}" -f @($sampleConfig.samples).Count)
Write-Host ("Chapters: {0}" -f $seenChapters.Count)
Write-Host ("Required-prop validation: passed")
