param(
    [string]$Mission = "",
    [string]$Profile = "unlimited",
    [string]$Browser = "auto",
    [string]$RepoPath = "",
    [switch]$NoTabs,
    [switch]$CorpSec
)

$repoRoot = if ($RepoPath -ne "") { $RepoPath } else { Resolve-Path "$PSScriptRoot\.." }
$sessionPath = "$repoRoot\references\session\SESSION.md"
$coreUrl = "https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md"

$sessionState = ""
if (Test-Path $sessionPath) {
    $sessionState = Get-Content $sessionPath -Raw
    if ($sessionState.Length -gt 1000) {
        $sessionState = $sessionState.Substring(0, 1000) + "`n... [TRUNCATED]"
    }
}

$warroom = ""
$warroomPath = "$repoRoot\WARROOM.md"
if (Test-Path $warroomPath) {
    $warroom = Get-Content $warroomPath -Raw
    if ($warroom.Length -gt 1500) {
        $warroom = $warroom.Substring(0, 1500) + "`n... [TRUNCATED]"
    }
}

$recon = ""
$reconPath = "$repoRoot\HANDS_LOG.md"
if (Test-Path $reconPath) {
    $recon = "RECON previously run. Check HANDS_LOG.md for details."
}

$internalAgent = "Claude (Planner/SCOPE)"
$externalAgent = "ChatGPT (Doer/SHOT)"
$externalAgent2 = "Gemini (Finder/Web)"
$externalAgent3 = "Perplexity (Fact-Check)"

if ($CorpSec) {
    $internalAgent = "Copilot in IDE (SCOPE -- tenant-protected)"
    $externalAgent = "Copilot in IDE (SHOT -- tenant-protected)"
    $externalAgent2 = "Local LLM or offline only (Finder)"
    $externalAgent3 = "Local LLM or offline only (Fact-Check)"
}

$tabs = @(
    @{
        Label = $internalAgent
        Url = if ($CorpSec) { "vscode://" } else { "https://claude.ai/new" }
        Role = "SCOPE"
        GetsRepo = $true
        GetsWarroom = $true
        GetsRecon = $true
        Prompt = @"
You are SCOPE -- the Auditor and Product Brain.

Read and adopt: $coreUrl
ROLE: SCOPE (auditor/product brain)
MISSION: $Mission
PROFILE: $Profile

Your job:
1. Read WARROOM.md (product truth) and recon output.
2. Kill delusion. Name the real problem.
3. Produce PRODUCT_AUDIT.md, PRODUCT_SPEC.md, EXECUTION_QUEUE.md.

WARROOM:
$warroom

SESSION:
$sessionState

RULES:
- Product thesis is ONE sentence or you are not scoped.
- Core job is ONE sentence or you are not scoped.
- Anti-goals are explicit or you are not scoped.
- EXECUTION_QUEUE tasks have: user outcome, file paths, acceptance criteria, effort estimate.
- Output ONLY artifacts. No chat. End with NEXT.

OUTPUT: PRODUCT_AUDIT.md, PRODUCT_SPEC.md, EXECUTION_QUEUE.md
"@
    },
    @{
        Label = $externalAgent
        Url = if ($CorpSec) { "vscode://copilot" } else { "https://chatgpt.com" }
        Role = "SHOT"
        GetsRepo = (-not $CorpSec)
        GetsWarroom = $false
        GetsRecon = $false
        Prompt = @"
You are SHOT -- the Executor and Closer.

Read and adopt: $coreUrl
ROLE: SHOT (executor/closer)
MISSION: $Mission
PROFILE: $Profile

Your job:
1. Read one task from EXECUTION_QUEUE.md.
2. Execute ONE vertical slice: UI -> component -> state -> API -> DB.
3. Run Jarvis Prime loop: ICK audit -> fix -> verify -> repeat.
4. Produce DIFF + TEST_REPORT.md + ICK_AUDIT.md.

RULES:
- One file at a time. One diff. One verify.
- No shotgun changes across unrelated areas.
- Every ICK must be non-trivial (real user impact).
- Output ONLY artifacts. No chat. End with NEXT.

OUTPUT: DIFF (unified), TEST_REPORT.md, ICK_AUDIT.md
"@
    },
    @{
        Label = $externalAgent2
        Url = "https://gemini.google.com"
        Role = "FINDER"
        GetsRepo = $false
        GetsWarroom = $false
        GetsRecon = $false
        Prompt = @"
You are FINDER -- the Research Agent.

Read and adopt: $coreUrl
ROLE: FINDER (research/web/docs only)
MISSION: $Mission
PROFILE: $Profile

Your job:
1. Research only. No code. No repo access.
2. Answer: "How is X normally designed?"
3. Find docs, standards, patterns, examples.
4. Output structured findings in 5-bullet format.

RULES:
- No repo context. No code. No configs.
- Only public docs, patterns, standards.
- Structure every answer: Problem -> Pattern -> Trade-offs -> Recommendation -> Source.
- Output ONLY findings. No chat. End with NEXT.

OUTPUT: RESEARCH_FINDINGS.md
"@
    },
    @{
        Label = $externalAgent3
        Url = "https://perplexity.ai"
        Role = "WEB"
        GetsRepo = $false
        GetsWarroom = $false
        GetsRecon = $false
        Prompt = @"
You are WEB -- the Fact-Checker.

Read and adopt: $coreUrl
ROLE: WEB (fact-check/docs/standards)
MISSION: $Mission
PROFILE: $Profile

Your job:
1. Verify claims made by other agents.
2. Find official docs, API references, standards.
3. Check dates, versions, compatibility.
4. Flag anything that looks wrong.

RULES:
- No repo context. No code.
- Only public information. Official docs preferred.
- Structure every answer: Claim -> Evidence -> Verdict -> Source.
- Output ONLY verifications. No chat. End with NEXT.

OUTPUT: FACT_CHECK.md
"@
    }
)

$tmpDir = "$env:TEMP\jarvis-boot-$(Get-Date -Format 'HHmmss')"
New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null

for ($i = 0; $i -lt $tabs.Count; $i++) {
    $p = $tabs[$i].Prompt

    $extraContext = ""
    if ($tabs[$i].GetsRepo) {
        $extraContext += "`n`n## REPO CONTEXT (Lane A -- internal agent)`nUse Pack=full on hot files. This agent sees real code."
    }
    else {
        $extraContext += "`n`n## LANE B RULES (external agent)`nDO NOT paste repo code. Use Pack=ultra: only signatures, routes, types, config keys. Replace company/project/customer names with generic tokens. You see the SHAPE, not the secret."
    }

    $finalPrompt = $p + $extraContext
    Set-Content -Path "$tmpDir\tab$($i+1).txt" -Value $finalPrompt -Encoding UTF8
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
Write-Host "Profile: $Profile | Mission: $Mission | CorpSec: $CorpSec" -ForegroundColor Yellow
Write-Host "" -ForegroundColor Cyan
Write-Host "Tab 1 ($($tabs[0].Label)) -- ROLE: $($tabs[0].Role) -- COPIED. Paste now." -ForegroundColor Green
Write-Host "  Gets repo: $($tabs[0].GetsRepo) | Gets WARROOM: $($tabs[0].GetsWarroom)" -ForegroundColor DarkGray

for ($i = 1; $i -lt $tabs.Count; $i++) {
    Write-Host "When Tab $i is booted, press ENTER -> Tab $($i+1) ($($tabs[$i].Label))" -ForegroundColor DarkGray
    $null = Read-Host
    Set-Clipboard (Get-Content "$tmpDir\tab$($i+1).txt" -Raw)
    Write-Host "Tab $($i+1) ($($tabs[$i].Label)) -- ROLE: $($tabs[$i].Role) -- COPIED. Paste now." -ForegroundColor Green
    Write-Host "  Gets repo: $($tabs[$i].GetsRepo) | Gets WARROOM: $($tabs[$i].GetsWarroom)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "All $($tabs.Count) tabs booted." -ForegroundColor Cyan
Write-Host "LANE A (internal): real code, WARROOM, recon." -ForegroundColor Green
Write-Host "LANE B (external): abstract structure only. No secrets." -ForegroundColor Yellow
Write-Host "SCRATCHPAD.md is shared memory." -ForegroundColor DarkGray
Write-Host "Commit SCRATCHPAD.md after each tab output." -ForegroundColor DarkGray
