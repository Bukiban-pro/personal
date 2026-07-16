param(
    [string]$Card = "",
    [string]$RepoPath = "",
    [string]$Mission = "",
    [string]$Profile = "unlimited",
    [switch]$CorpSec,
    [switch]$Force
)

if ($Card -eq "") {
    Write-Host "ERROR: -Card required" -ForegroundColor Red
    exit 1
}

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$cardsDir = "$PSScriptRoot\..\references\prompts\scenarios"
$cardPath = Join-Path $cardsDir "$Card.md"

if (-not (Test-Path $cardPath)) {
    # Try with prefix
    $possible = Get-ChildItem -Path $cardsDir -Filter "*$Card*.md" | Select-Object -First 1
    if ($possible) {
        $cardPath = $possible.FullName
    }
    else {
        Write-Host "ERROR: Card not found: $Card" -ForegroundColor Red
        Write-Host "Available cards:" -ForegroundColor Yellow
        Get-ChildItem -Path $cardsDir -Filter "*.md" | ForEach-Object { Write-Host "  $($_.BaseName)" }
        exit 1
    }
}

Write-Host "=== SCENARIO CARD: $Card ===" -ForegroundColor Cyan
Write-Host "Source: $cardPath" -ForegroundColor DarkGray

$cardContent = Get-Content $cardPath -Raw

# Extract formula from card
$formula = "unknown"
if ($cardContent -match '\*\*Formula:\*\*\s*(.+)') {
    $formula = $matches[1].Trim()
}

# Extract tool info
$tool = "any"
if ($cardContent -match '\*\*Tool:\*\*\s*(.+)') {
    $tool = $matches[1].Trim()
}

# Extract tabs/lane info
$tabs = @()
$lane = ""
if ($cardContent -match '\*\*Tabs:\*\*\s*(.+)') {
    $tabsLine = $matches[1].Trim()
    $tabs = $tabsLine -split ','
}
if ($cardContent -match '\*\*Lane:\*\*\s*(.+)') {
    $lane = $matches[1].Trim()
}

# Extract prep steps
$prepSteps = @()
if ($cardContent -match '\*\*Prep:\*\*\s*(.+?)(?:\n\n|---|$)') {
    $prepText = $matches[1].Trim()
    $prepSteps = $prepText -split '\n' | Where-Object { $_ -match '^\d+\.' } | ForEach-Object { $_.Trim() }
}

Write-Host "Formula: $formula" -ForegroundColor Yellow
Write-Host "Tool: $tool" -ForegroundColor Yellow
if ($tabs.Count -gt 0) { Write-Host "Tabs: $($tabs -join ', ')" -ForegroundColor Yellow }
if ($lane) { Write-Host "Lane: $lane" -ForegroundColor Yellow }
Write-Host ""

# Execute prep steps
$stepNum = 1
foreach ($step in $prepSteps) {
    Write-Host "[PREP $stepNum] $step" -ForegroundColor Green
    
    # Handle special step patterns
    if ($step -match 'Run `recon`') {
        Write-Host "  -> Running repo-recon.ps1..." -ForegroundColor DarkGray
        & "$PSScriptRoot\repo-recon.ps1" -RepoPath $RepoPath -ScanLandmines -ScanSensitive
    }
    elseif ($step -match 'Run `boot`') {
        if ($Mission -eq "") {
            Write-Host "  -> WARNING: -Mission not provided, using card name" -ForegroundColor Yellow
            $Mission = $Card
        }
        Write-Host "  -> Running boot-session.ps1..." -ForegroundColor DarkGray
        & "$PSScriptRoot\boot-session.ps1" -Mission $Mission -Profile $Profile -CorpSec:$CorpSec
    }
    elseif ($step -match 'Write WARROOM') {
        $warroomTemplate = "$PSScriptRoot\..\references\templates\WARROOM.md"
        if (Test-Path $warroomTemplate) {
            $warroomContent = Get-Content $warroomTemplate -Raw
            $warroomPath = Join-Path $RepoPath "WARROOM.md"
            if (-not (Test-Path $warroomPath) -or $Force) {
                Set-Content -Path $warroomPath -Value $warroomContent -Encoding UTF8
                Write-Host "  -> Created WARROOM.md from template" -ForegroundColor DarkGray
            }
        }
    }
    elseif ($step -match 'Run `pack`') {
        Write-Host "  -> Running context-pack.ps1 (Pack=ultra -Anonymize)..." -ForegroundColor DarkGray
        & "$PSScriptRoot\context-pack.ps1" -SourceDir $RepoPath -Pack ultra -Anonymize
    }
    elseif ($step -match 'Take screenshots') {
        Write-Host "  -> MANUAL: Take 1-2 screenshots (mobile + core flow)" -ForegroundColor Yellow
    }
    elseif ($step -match 'Paste') {
        Write-Host "  -> MANUAL: Paste the ignition prompt into the agent tab" -ForegroundColor Yellow
    }
    else {
        Write-Host "  -> MANUAL: $step" -ForegroundColor Yellow
    }
    
    $stepNum++
}

# Extract the ignition prompt blocks from card
Write-Host ""
Write-Host "=== IGNITION PROMPTS (copy/paste into tabs) ===" -ForegroundColor Cyan

# Find all code blocks in the card
$blocks = [regex]::Matches($cardContent, '```\s*\n(.*?)\n```', 'Singleline')
foreach ($match in $blocks) {
    $blockContent = $match.Groups[1].Value.Trim()
    if ($blockContent -match 'Read and adopt:') {
        Write-Host ""
        Write-Host "---" -ForegroundColor DarkGray
        Write-Host $blockContent
        Write-Host "---" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Card $Card prep complete." -ForegroundColor Green
Write-Host "Next: Follow the ignition prompts above for each tab." -ForegroundColor Yellow