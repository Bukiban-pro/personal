param(
    [string]$RepoPath = ".",
    [int]$Depth = 3
)

$startTime = Get-Date
$output = @()
$output += "=== REPO RECON: $(Resolve-Path $RepoPath) ==="
$output += "=== Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm') ==="
$output += ""

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

# Git log
$gitLog = git -C $RepoPath log --oneline -15 2>&1
$output += "## GIT LOG (last 15)"
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

$result = $output -join "`n"
Set-Clipboard $result

$elapsed = (Get-Date) - $startTime
Write-Host "=== REPO RECON ===" -ForegroundColor Cyan
Write-Host "Path: $RepoPath" -ForegroundColor Yellow
Write-Host "Length: $($result.Length) chars" -ForegroundColor Yellow
Write-Host "Time: $($elapsed.TotalSeconds.ToString('0.0'))s" -ForegroundColor Yellow
Write-Host "Copied to clipboard." -ForegroundColor Green
Write-Host "Paste into any AI with INIT.md for instant context." -ForegroundColor Cyan
