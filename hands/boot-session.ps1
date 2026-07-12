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
    if ($sessionState.Length -gt 1000) {
        $sessionState = $sessionState.Substring(0, 1000) + "`n... [TRUNCATED]"
    }
}

$tabs = @(
    @{ Label="Claude (Planner)";   Url="https://claude.ai/new";        PromptPrefix="You are the PLANNER. Decompose the mission into tasks. Output PLAN.md." }
    @{ Label="ChatGPT (Doer)";     Url="https://chatgpt.com";          PromptPrefix="You are the DOER. You receive tasks from PLAN.md and output diffs." }
    @{ Label="Gemini (Finder)";    Url="https://gemini.google.com";    PromptPrefix="You are the RESEARCH/FINDER. Investigate unknowns. Output structured findings." }
    @{ Label="Perplexity (Web)";   Url="https://perplexity.ai";       PromptPrefix="You are the WEB FACT-CHECKER. Verify claims, find docs, check dates." }
)

$tmpDir = "$env:TEMP\jarvis-boot-$(Get-Date -Format 'HHmmss')"
New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null

for ($i = 0; $i -lt $tabs.Count; $i++) {
    $p = @"
Read and adopt: $coreUrl
$($tabs[$i].PromptPrefix)

MISSION: $Mission
PROFILE: $Profile
SESSION:
$sessionState
"@
    Set-Content -Path "$tmpDir\tab$($i+1).txt" -Value $p -Encoding UTF8
}

Set-Clipboard (Get-Content "$tmpDir\tab1.txt" -Raw)

if (-not $NoTabs) {
    if ($Browser -eq "auto") {
        $browsers = @("chrome", "msedge", "firefox")
        foreach ($b in $browsers) {
            if (Get-Process -Name $b -ErrorAction SilentlyContinue) {
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

Write-Host "=== BOOT SEQUENCE ===" -ForegroundColor Cyan
Write-Host "Profile: $Profile | Mission: $Mission | Browser: $Browser" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan
Write-Host "Tab 1 (Claude — Planner) COPIED. Paste now." -ForegroundColor Green

for ($i = 2; $i -le $tabs.Count; $i++) {
    Write-Host "When Tab $($i-1) is booted, press ENTER → will copy Tab $i ($($tabs[$i-1].Label))" -ForegroundColor DarkGray
    $null = Read-Host
    Set-Clipboard (Get-Content "$tmpDir\tab$i.txt" -Raw)
    Write-Host "Tab $i ($($tabs[$i-1].Label)) COPIED. Paste now." -ForegroundColor Green
}

Write-Host ""
Write-Host "All 4 tabs booted. SCRATCHPAD.md is shared memory." -ForegroundColor Cyan
Write-Host "Commit SCRATCHPAD.md after each tab output." -ForegroundColor DarkGray
