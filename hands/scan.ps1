param(
    [string]$RepoPath = "",
    [switch]$Force
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$repoRoot = Resolve-Path $RepoPath
Write-Host "=== REPO SCAN MODE ===" -ForegroundColor Cyan
Write-Host "Target: $repoRoot" -ForegroundColor Yellow

$outputDir = Join-Path $repoRoot ".prep-output"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# === 1. REPO_FILES.md - all tracked files ===
Write-Host "[1/5] Generating REPO_FILES.md..." -ForegroundColor Green
$gitFiles = git -C $repoRoot ls-files 2>&1
$gitFilesContent = "# REPO_FILES -- All tracked files`n`n$gitFiles"
Set-Content -Path (Join-Path $outputDir "REPO_FILES.md") -Value $gitFilesContent -Encoding UTF8

# === 2. REPO_TODO.md - all TODO/FIXME/HACK/XXX ===
Write-Host "[2/5] Generating REPO_TODO.md..." -ForegroundColor Green
$todos = @()
foreach ($ext in @("*.ts","*.tsx","*.js","*.jsx","*.py","*.java","*.kt","*.go","*.rs","*.rb","*.php","*.cs")) {
    $found = Get-ChildItem -Path $repoRoot -Filter $ext -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|build|\.next|target|__pycache__)\\' } |
        ForEach-Object { findstr /N /S /I "TODO FIXME HACK XXX" $_.FullName 2>$null }
    if ($found) { $todos += $found }
}
$todoContent = "# REPO_TODO -- All TODO/FIXME/HACK/XXX`n`n"
if ($todos.Count -gt 0) {
    $todoContent += "FOUND $($todos.Count) landmines:`n`n"
    $todoContent += ($todos | Select-Object -First 100) -join "`n"
    if ($todos.Count -gt 100) { $todoContent += "`n... [TRUNCATED: $($todos.Count - 100) more]" }
} else {
    $todoContent += "CLEAN -- no landmines found."
}
Set-Content -Path (Join-Path $outputDir "REPO_TODO.md") -Value $todoContent -Encoding UTF8

# === 3. REPO_LOG.md - last 20 commits ===
Write-Host "[3/5] Generating REPO_LOG.md..." -ForegroundColor Green
$gitLog = git -C $repoRoot log --oneline -20 2>&1
$logContent = "# REPO_LOG -- Last 20 commits`n`n$gitLog"
Set-Content -Path (Join-Path $outputDir "REPO_LOG.md") -Value $logContent -Encoding UTF8

# === 4. REPO_CODE_INDEX.md - code files and paths by type ===
Write-Host "[4/5] Generating REPO_CODE_INDEX.md..." -ForegroundColor Green
$codeFiles = Get-ChildItem -Path $repoRoot -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|build|\.next|target|__pycache__|\.venv)\\' } |
    Where-Object { $_.Extension -in @(".ts",".tsx",".js",".jsx",".py",".java",".kt",".go",".rs",".rb",".php",".cs",".vue",".svelte") }

$indexContent = "# REPO_CODE_INDEX -- Code files by category`n`n"
$categories = @{
    "Routes / API" = @("*route*", "*api*", "*endpoint*", "*controller*")
    "Components / UI" = @("*component*", "*view*", "*page*", "*screen*", "*widget*")
    "State / Store" = @("*store*", "*state*", "*context*", "*reducer*", "*action*")
    "Services / Business Logic" = @("*service*", "*manager*", "*handler*", "*processor*", "*worker*")
    "Models / Types / Schemas" = @("*model*", "*type*", "*schema*", "*entity*", "*dto*", "*interface*")
    "Config / Env" = @("*config*", "*env*", "*settings*", "*.config.*", "*.env*")
    "Tests" = @("*test*", "*spec*", "*__tests__*", "*__mocks__*")
    "Utils / Helpers" = @("*util*", "*helper*", "*common*", "*shared*")
}

foreach ($cat in $categories.Keys) {
    $patterns = $categories[$cat]
    $matches = $codeFiles | Where-Object {
        $f = $_.FullName
        $patterns | Where-Object { $f -like "*$_*" }
    } | ForEach-Object { $_.FullName.Replace($repoRoot.Path, '') }
    if ($matches.Count -gt 0) {
        $indexContent += "## $cat ($($matches.Count) files)`n"
        $indexContent += (($matches | Sort-Object) -join "`n") + "`n`n"
    }
}

# Uncategorized
$allMatched = @()
foreach ($cat in $categories.Keys) {
    $patterns = $categories[$cat]
    $allMatched += $codeFiles | Where-Object {
        $f = $_.FullName
        $patterns | Where-Object { $f -like "*$_*" }
    }
}
$uncategorized = $codeFiles | Where-Object { $_ -notin $allMatched } | ForEach-Object { $_.FullName.Replace($repoRoot.Path, '') }
if ($uncategorized.Count -gt 0) {
    $indexContent += "## Uncategorized ($($uncategorized.Count) files)`n"
    $indexContent += (($uncategorized | Sort-Object) -join "`n") + "`n`n"
}

Set-Content -Path (Join-Path $outputDir "REPO_CODE_INDEX.md") -Value $indexContent -Encoding UTF8

# === 5. ARCHITECT_PROMPT.md - the prompt template ===
Write-Host "[5/5] Generating ARCHITECT_PROMPT.md..." -ForegroundColor Green
$promptTemplate = Get-Content "$PSScriptRoot\..\references\prompts\ARCHITECT_SCAN.md" -Raw -ErrorAction SilentlyContinue
if (-not $promptTemplate) {
    $promptTemplate = @"
You are a senior architect. You get:
- REPO_FILES: all tracked files
- REPO_TODO: all TODO/FIXME/HACK lines
- REPO_LOG: last 20 commits
- REPO_CODE_INDEX: code files and paths

From this, output:
- 10 files to inspect first
- 5 highest-risk areas
- 3 candidate "core flows"
- 1 hypothesis of what this repo is trying to be
- A ranked EXECUTION_QUEUE.md with: user outcome, files, acceptance checks
"@
}
Set-Content -Path (Join-Path $outputDir "ARCHITECT_PROMPT.md") -Value $promptTemplate -Encoding UTF8

Write-Host "" -ForegroundColor Cyan
Write-Host "=== SCAN COMPLETE ===" -ForegroundColor Green
Write-Host "Output directory: $outputDir" -ForegroundColor Yellow
Write-Host "Files created:" -ForegroundColor White
Write-Host "  REPO_FILES.md       - All tracked files" -ForegroundColor White
Write-Host "  REPO_TODO.md        - All landmines (TODO/FIXME/HACK/XXX)" -ForegroundColor White
Write-Host "  REPO_LOG.md         - Last 20 commits" -ForegroundColor White
Write-Host "  REPO_CODE_INDEX.md  - Code files categorized by role" -ForegroundColor White
Write-Host "  ARCHITECT_PROMPT.md - Prompt to paste into internal Copilot/architect agent" -ForegroundColor White
Write-Host "" -ForegroundColor Cyan
Write-Host "NEXT: Paste ARCHITECT_PROMPT.md + the 4 data files into internal Copilot." -ForegroundColor Green
Write-Host "      It will output your EXECUTION_QUEUE.md and core flow hypotheses." -ForegroundColor Green
