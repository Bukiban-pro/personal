param(
    [string]$Mission = "",
    [string]$Profile = "unlimited",
    [string]$Browser = "auto",
    [string]$RepoPath = "",
    [switch]$NoTabs,
    [switch]$CorpSec
)

$repoRoot = if ($RepoPath -ne "") { (Resolve-Path $RepoPath).Path } else { (Resolve-Path ".").Path }
$sessionPath = Join-Path $repoRoot "SESSION.md"
if (-not (Test-Path $sessionPath)) {
    $sessionPath = "$PSScriptRoot\..\references\session\SESSION.md"
}
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
$scanPath = Join-Path $repoRoot ".prep-output\REPO_CODE_INDEX.md"
if (Test-Path $scanPath) {
    $recon = "SCAN available. Use .prep-output/REPO_TODO.md, REPO_LOG.md, REPO_CODE_INDEX.md, and ARCHITECT_PROMPT.md."
}

$shotAgent = if ($CorpSec) { "Copilot in IDE (SHOT -- tenant-protected)" } else { "ChatGPT/Codex (SHOT -- repo executor)" }
$scopeAgent = if ($CorpSec) { "External planner from safe scans (SCOPE)" } else { "Claude/ChatGPT (SCOPE -- scans planner)" }
$finderAgent = if ($CorpSec) { "Local LLM or offline only (Finder)" } else { "Gemini/Perplexity (Finder)" }
$auditorAgent = if ($CorpSec) { "Local LLM or screenshot-only auditor" } else { "Claude/GPT-4o (Auditor)" }

$tabs = @(
    @{
        Label = $shotAgent
        Url = if ($CorpSec) { "vscode://copilot" } else { "https://chatgpt.com" }
        Role = "SHOT"
        GetsRepo = $true
        GetsWarroom = $true
        GetsRecon = $true
        Prompt = @"
You are SHOT -- the Executor and Closer.

Read and adopt: $coreUrl
ROLE: SHOT (executor/closer)
MISSION: $Mission
PROFILE: $Profile

Your job:
1. Read EXECUTION_QUEUE.md and PRODUCT_SPEC.md from the target repo.
2. Pick exactly one READY task.
3. Execute one vertical slice: UI -> component -> state -> API -> DB as needed.
4. Produce DIFF + TEST_REPORT.md + ICK_AUDIT.md.

WARROOM:
$warroom

SESSION:
$sessionState

SCAN:
$recon

RULES:
- One file at a time. One diff. One verify.
- No shotgun changes across unrelated areas.
- If a task crosses a boundary, trace the boundary instead of stopping.
- Every visible change covers loading, empty, error, success, and edge states where relevant.
- Output ONLY artifacts. No chat. End with NEXT.

OUTPUT: DIFF (unified), TEST_REPORT.md, ICK_AUDIT.md
"@
    },
    @{
        Label = $scopeAgent
        Url = if ($CorpSec) { "https://claude.ai/new" } else { "https://claude.ai/new" }
        Role = "SCOPE"
        GetsRepo = $false
        GetsWarroom = $true
        GetsRecon = $true
        Prompt = @"
You are SCOPE -- the Auditor and Product Brain.

Read and adopt: $coreUrl
ROLE: SCOPE (planner from scans)
MISSION: $Mission
PROFILE: $Profile

Your job:
1. Read safe scan files only: REPO_TODO.md, REPO_LOG.md, REPO_CODE_INDEX.md, ARCHITECT_PROMPT.md.
2. Kill delusion. Name the real product problem.
3. Produce PRODUCT_SPEC.md and EXECUTION_QUEUE.md.

RULES:
- Do not ask for raw source code.
- If scans are insufficient, name the exact missing scan.
- Product thesis is one sentence.
- Tasks have: user outcome, file paths, acceptance criteria, effort estimate, risk.
- Output ONLY artifacts. No chat. End with NEXT.

OUTPUT: PRODUCT_SPEC.md, EXECUTION_QUEUE.md
"@
    },
    @{
        Label = $finderAgent
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
        Label = $auditorAgent
        Url = "https://perplexity.ai"
        Role = "AUDITOR"
        GetsRepo = $false
        GetsWarroom = $false
        GetsRecon = $false
        Prompt = @"
You are AUDITOR -- the UX and verification critic.

Read and adopt: $coreUrl
ROLE: AUDITOR (screenshots/facts/verification)
MISSION: $Mission
PROFILE: $Profile

Your job:
1. Verify claims made by other agents.
2. Audit screenshots or described flows for hierarchy, contrast, state coverage, recovery, and edge cases.
3. Find official docs, API references, or standards when a factual claim needs checking.
4. Flag anything that looks wrong.

RULES:
- No repo code. Screenshots and public docs only.
- Only public information. Official docs preferred.
- Structure every answer: Finding -> Evidence -> Impact -> Fix -> Verification.
- Output ONLY verifications. No chat. End with NEXT.

OUTPUT: ICK_AUDIT.md or FACT_CHECK.md
"@
    }
)

$tmpDir = "$env:TEMP\jarvis-boot-$(Get-Date -Format 'HHmmss')"
New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null

function Copy-TabPrompt {
    param([string]$Path)
    try {
        Set-Clipboard (Get-Content $Path -Raw) -ErrorAction Stop
        return $true
    }
    catch {
        Write-Host "Clipboard unavailable. Prompt saved: $Path" -ForegroundColor Yellow
        return $false
    }
}

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

$tab1Copied = Copy-TabPrompt -Path "$tmpDir\tab1.txt"

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
$tab1Status = if ($tab1Copied) { "COPIED. Paste now." } else { "SAVED. Open the prompt file." }
Write-Host "Tab 1 ($($tabs[0].Label)) -- ROLE: $($tabs[0].Role) -- $tab1Status" -ForegroundColor Green
Write-Host "  Gets repo: $($tabs[0].GetsRepo) | Gets WARROOM: $($tabs[0].GetsWarroom)" -ForegroundColor DarkGray

for ($i = 1; $i -lt $tabs.Count; $i++) {
    if (-not $NoTabs) {
        Write-Host "When Tab $i is booted, press ENTER -> Tab $($i+1) ($($tabs[$i].Label))" -ForegroundColor DarkGray
        $null = Read-Host
    }
    else {
        Write-Host "Prompt saved: $tmpDir\tab$($i+1).txt" -ForegroundColor DarkGray
    }
    $copied = Copy-TabPrompt -Path "$tmpDir\tab$($i+1).txt"
    $status = if ($copied) { "COPIED. Paste now." } else { "SAVED. Open the prompt file." }
    Write-Host "Tab $($i+1) ($($tabs[$i].Label)) -- ROLE: $($tabs[$i].Role) -- $status" -ForegroundColor Green
    Write-Host "  Gets repo: $($tabs[$i].GetsRepo) | Gets WARROOM: $($tabs[$i].GetsWarroom)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "All $($tabs.Count) tabs booted." -ForegroundColor Cyan
Write-Host "LANE A (internal): real code, WARROOM, scan files." -ForegroundColor Green
Write-Host "LANE B (external): abstract structure only. No secrets." -ForegroundColor Yellow
Write-Host "SCRATCHPAD.md is shared memory." -ForegroundColor DarkGray
Write-Host "Commit SCRATCHPAD.md after each tab output." -ForegroundColor DarkGray
