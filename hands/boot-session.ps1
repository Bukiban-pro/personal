param(
    [string]$Mission = "",
    [string]$Profile = "unlimited",
    [string]$Browser = "auto",
    [switch]$NoTabs
)

$repoRoot = Resolve-Path "$PSScriptRoot\.."
$sessionPath = "$repoRoot\references\session\SESSION.md"
$coreUrl = "https://raw.githubusercontent.com/Bukiban-pro/personal/main/references/prompts/core-philosophy.md"

$sessionState = ""
if (Test-Path $sessionPath) {
    $sessionState = Get-Content $sessionPath -Raw
}

$tabs = @(
    @{ Label="Claude (Planner)";   Url="https://claude.ai/new";        PromptPrefix="You are the PLANNER. Decompose the mission into tasks. Output PLAN.md." }
    @{ Label="ChatGPT (Doer)";     Url="https://chatgpt.com";          PromptPrefix="You are the DOER. You receive tasks from PLAN.md and output diffs." }
    @{ Label="Gemini (Finder)";    Url="https://gemini.google.com";    PromptPrefix="You are the RESEARCH/FINDER. Investigate unknowns. Output structured findings." }
    @{ Label="Perplexity (Web)";   Url="https://perplexity.ai";       PromptPrefix="You are the WEB FACT-CHECKER. Verify claims, find docs, check dates." }
)

$bootPrompts = @()
$bootPrompts += "=============================="
$bootPrompts += "BOOT SEQUENCE — copy per tab:"
$bootPrompts += "=============================="
$bootPrompts += ""

foreach ($tab in $tabs) {
    $p = @"
--- $($tab.Label) ---
Read and adopt: $coreUrl
$($tab.PromptPrefix)

MISSION: $Mission
PROFILE: $Profile
SESSION:
$sessionState
"@
    $bootPrompts += $p
    $bootPrompts += ""
}

$allPrompts = $bootPrompts -join "`n"
Set-Clipboard $allPrompts

if (-not $NoTabs) {
    if ($Browser -eq "auto") {
        $browsers = @("chrome", "msedge", "firefox")
        foreach ($b in $browsers) {
            $check = Get-Process -Name $b -ErrorAction SilentlyContinue
            if ($check) {
                $Browser = $b
                break
            }
        }
        if ($Browser -eq "auto") { $Browser = "chrome" }
    }

    $urls = $tabs | ForEach-Object { $_.Url }

    switch ($Browser.ToLower()) {
        "chrome"  { Start-Process "chrome"  "-new-window $($urls -join ' ')" }
        "msedge"  { Start-Process "msedge"  "-new-window $($urls -join ' ')" }
        "edge"    { Start-Process "msedge"  "-new-window $($urls -join ' ')" }
        "firefox" { Start-Process "firefox" "-new-window $($urls -join ' ')" }
        default   { Start-Process "chrome"  "-new-window $($urls -join ' ')" }
    }
}

Write-Host "=== BOOT SESSION ===" -ForegroundColor Cyan
Write-Host "Profile: $Profile" -ForegroundColor Yellow
Write-Host "Mission: $Mission" -ForegroundColor Yellow
Write-Host "Browser: $Browser" -ForegroundColor Yellow
Write-Host "Tabs: Claude (Planner), ChatGPT (Doer), Gemini (Finder), Perplexity (Web)" -ForegroundColor Green
Write-Host "4 tab-specific boot prompts copied to clipboard." -ForegroundColor Green
Write-Host "PASTE INTO EACH TAB:" -ForegroundColor Magenta
Write-Host "  Tab 1 Claude → paste block 1 (Planner)" -ForegroundColor Cyan
Write-Host "  Tab 2 ChatGPT → paste block 2 (Doer)" -ForegroundColor Cyan
Write-Host "  Tab 3 Gemini → paste block 3 (Finder)" -ForegroundColor Cyan
Write-Host "  Tab 4 Perplexity → paste block 4 (Web)" -ForegroundColor Cyan
