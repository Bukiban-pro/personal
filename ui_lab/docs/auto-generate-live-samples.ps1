param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$registryPath = Join-Path $repoRoot "configs\ui-lab-registry.json"
$samplesPath = Join-Path $repoRoot "configs\landing-product-live-samples.json"

Write-Host "Loading registry..." -ForegroundColor Cyan
$registry = Get-Content -Raw -LiteralPath $registryPath | ConvertFrom-Json

Write-Host "Loading current samples..." -ForegroundColor Cyan
$currentSamples = Get-Content -Raw -LiteralPath $samplesPath | ConvertFrom-Json
$currentSampleNames = @{}
foreach ($sample in $currentSamples.samples) {
  $currentSampleNames[$sample.componentName] = $true
}

Write-Host "Generating entries for all $(($registry.componentLookup | Measure-Object).Count) components..." -ForegroundColor Cyan
$allSamples = [System.Collections.Generic.List[object]]::new()

# First, add all current hand-curated samples
foreach ($sample in $currentSamples.samples) {
  $allSamples.Add($sample)
}

Write-Host "Added $($currentSamples.samples.Count) existing curated samples" -ForegroundColor Green

# Now add auto-generated entries for all registry components not already curated
$autoGenCount = 0
foreach ($component in $registry.componentLookup) {
  if (-not $currentSampleNames[$component.name]) {
    # Strip "ui_lab/" prefix from sourcePath if present
    $cleanPath = $component.sourcePath
    if ($cleanPath.StartsWith("ui_lab/")) {
      $cleanPath = $cleanPath.Substring(7)
    }
    
    $autoEntry = @{
      componentName = $component.name
      chapter = $component.shelfLabel
      title = $component.name
      sourcePath = $cleanPath
      props = @{}  # Empty props - component will render with defaults
    }
    $allSamples.Add($autoEntry)
    $autoGenCount++
  }
}

Write-Host "Added $autoGenCount auto-generated samples" -ForegroundColor Green
Write-Host "Total samples: $($allSamples.Count)" -ForegroundColor Yellow

# Write the expanded samples file
$samplesJson = @{
  samples = $allSamples
} | ConvertTo-Json -Depth 12

# Fix any stray escape sequences from ConvertTo-Json
$samplesJson = $samplesJson -replace '\\r\\n', [Environment]::NewLine

Set-Content -LiteralPath $samplesPath -Value $samplesJson -Encoding UTF8

Write-Host "Updated $samplesPath with all $($allSamples.Count) samples" -ForegroundColor Green
