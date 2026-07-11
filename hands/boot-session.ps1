param(
    [string]$Mission = "",
    [string]$Profile = "unlimited",
    [string]$Browser = "chrome"
)

$repoRoot = Resolve-Path "$PSScriptRoot\.."
$sessionPath = "$repoRoot\references\session\SESSION.md"
$coreUrl = "https://raw.githubusercontent.com/Bukiban-pro/personal/main/references/prompts/core-philosophy.md"

$sessionState = ""
if (Test-Path $sessionPath) {
    $sessionState = Get-Content $sessionPath -Raw
}

$bootPrompt = @"
Read and adopt: $coreUrl

MISSION: $Mission
PROFILE: $Profile
SESSION STATE:
$sessionState

Boot the OS. Show PLAN.md when ready.
"@

Set-Clipboard $bootPrompt

$tabs = @(
    "https://claude.ai/new",
    "https://chatgpt.com",
    "https://gemini.google.com",
    "https://perplexity.ai"
)

switch ($Browser.ToLower()) {
    "chrome" { Start-Process "chrome" "-new-window $($tabs -join ' ')" }
    "edge" { Start-Process "msedge" "-new-window $($tabs -join ' ')" }
    "firefox" { Start-Process "firefox" "-new-window $($tabs -join ' ')" }
    default { Start-Process "chrome" "-new-window $($tabs -join ' ')" }
}

Write-Host "=== BOOT SESSION ===" -ForegroundColor Cyan
Write-Host "Profile: $Profile" -ForegroundColor Yellow
Write-Host "Mission: $Mission" -ForegroundColor Yellow
Write-Host "Windows opened: Claude, ChatGPT, Gemini, Perplexity" -ForegroundColor Green
Write-Host "Boot prompt copied to clipboard." -ForegroundColor Green
Write-Host "PASTE INTO CLAUDE TAB 1 NOW." -ForegroundColor Magenta
