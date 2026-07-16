param(
    [string]$RepoPath = ".",
    [int]$Depth = 3,
    [switch]$ScanLandmines,
    [switch]$ScanSensitive,
    [switch]$Minimal
)

$startTime = Get-Date
$output = @()
$output += "=== REPO RECON: $(Resolve-Path $RepoPath) ==="
$output += "=== Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm') ==="
$output += ""

# Git tracked files (the targeting system)
if (-not $Minimal) {
    $gitFiles = git -C $RepoPath ls-files 2>&1
    $output += "## GIT TRACKED FILES ($($gitFiles.Count) files)"
    $output += $gitFiles
    $output += ""
}

# File tree
$output += "## FILE TREE (depth $Depth)"
$items = Get-ChildItem -Path $RepoPath -Depth $Depth -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|build|\.next|target|__pycache__|\.venv)\\' } |
    ForEach-Object { $_.FullName.Replace((Resolve-Path $RepoPath).Path, '') }
foreach ($item in $items) { $output += $item }
$output += ""

# Package files
foreach ($pkg in @("package.json","requirements.txt","pom.xml","build.gradle","Cargo.toml","go.mod","Gemfile","composer.json")) {
    $f = Join-Path $RepoPath $pkg
    if (Test-Path $f) {
        $content = Get-Content $f -Raw -ErrorAction SilentlyContinue
        if ($content.Length -gt 5000) { $content = $content.Substring(0,5000) + "`n... [TRUNCATED]" }
        $output += "## $pkg"
        $output += $content
        $output += ""
    }
}

# README
$readme = Get-ChildItem -Path $RepoPath -Filter "README*" | Select-Object -First 1
if ($readme) {
    $content = Get-Content $readme.FullName -Raw -ErrorAction SilentlyContinue
    $output += "## README"
    $output += $content
    $output += ""
}

# Git log (active areas)
$gitLog = git -C $RepoPath log --oneline -20 2>&1
$output += "## GIT LOG (last 20)"
$output += $gitLog
$output += ""

# Line counts by language
$output += "## SIZE BY EXTENSION"
$exts = Get-ChildItem -Path $RepoPath -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|build|\.next|target)\\' } |
    Group-Object Extension |
    Sort-Object Count -Descending |
    Select-Object -First 10 |
    ForEach-Object { "$($_.Name): $($_.Count) files" }
$output += $exts
$output += ""

# === LANDMINE SCAN ===
if ($ScanLandmines -or (-not $Minimal)) {
    $output += "## LANDMINE SCAN (TODO/FIXME/HACK/XXX)"
    $landmines = @()
    foreach ($ext in @("*.ts","*.tsx","*.js","*.jsx","*.py","*.java","*.kt","*.go","*.rs","*.rb","*.php","*.cs")) {
        $found = Get-ChildItem -Path $RepoPath -Filter $ext -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|build|\.next|target|__pycache__)\\' } |
            ForEach-Object { findstr /N /S /I "TODO FIXME HACK XXX" $_.FullName 2>$null }
        if ($found) { $landmines += $found }
    }
    if ($landmines.Count -gt 0) {
        $output += "FOUND $($landmines.Count) landmines:"
        $output += $landmines | Select-Object -First 30
        if ($landmines.Count -gt 30) { $output += "... [TRUNCATED: $($landmines.Count - 30) more]" }
    }
    else {
        $output += "CLEAN â€” no landmines found."
    }
    $output += ""
}

# === SENSITIVE SCAN ===
if ($ScanSensitive -or (-not $Minimal)) {
    $output += "## SENSITIVE SCAN (password/apiKey/token/secret)"
    $sensitive = @()
    foreach ($pattern in @("*.config","*.env*","*.yml","*.yaml","*.json","*.xml","*.properties","*.ini","*.toml")) {
        $found = Get-ChildItem -Path $RepoPath -Filter $pattern -Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|dist|build|\.next|target)\\' } |
            ForEach-Object { findstr /N /S /I "password apiKey token secret secretKey accessKey privateKey" $_.FullName 2>$null }
        if ($found) { $sensitive += $found }
    }
    if ($sensitive.Count -gt 0) {
        $output += "FOUND $($sensitive.Count) sensitive references â€” NEVER PASTE THESE TO EXTERNAL AI:"
        $output += $sensitive | Select-Object -First 20
        if ($sensitive.Count -gt 20) { $output += "... [TRUNCATED: $($sensitive.Count - 20) more]" }
    }
    else {
        $output += "CLEAN â€” no sensitive references found."
    }
    $output += ""
}

$result = $output -join "`n"
Set-Clipboard $result

$elapsed = (Get-Date) - $startTime
Write-Host "=== REPO RECON ===" -ForegroundColor Cyan
Write-Host "Path: $RepoPath" -ForegroundColor Yellow
Write-Host "Length: $($result.Length) chars" -ForegroundColor Yellow
Write-Host "Time: $($elapsed.TotalSeconds.ToString('0.0'))s" -ForegroundColor Yellow
Write-Host "Copied to clipboard." -ForegroundColor Green
Write-Host "Paste into any AI with BELT.md for instant context." -ForegroundColor Cyan

