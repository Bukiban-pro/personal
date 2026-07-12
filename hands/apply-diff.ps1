param(
    [string]$RepoPath = "",
    [string]$TestCommand = "",
    [string]$PatchFile = "clipboard.diff"
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$patchPath = Join-Path $RepoPath $PatchFile
$logPath = Join-Path $RepoPath "HANDS_LOG.md"

$clipText = Get-Clipboard -TextFormatType Text -ErrorAction SilentlyContinue
if (-not $clipText) {
    $clipText = Get-Clipboard
}

if ([string]::IsNullOrWhiteSpace($clipText)) {
    Write-Host "ERROR: Clipboard is empty. Copy a diff from ChatGPT first." -ForegroundColor Red
    exit 1
}

if ($clipText -notmatch '^diff --git|\-\-\- a\/|\+\+\+ b\/|^Index:|^From ') {
    Write-Host "WARNING: Clipboard does not look like a unified diff." -ForegroundColor Yellow
    Write-Host "First 80 chars: $($clipText.Substring(0, [Math]::Min(80, $clipText.Length)))" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne 'y') { exit 0 }
}

Set-Content -Path $patchPath -Value $clipText -NoNewline

Write-Host "=== DIFF REVIEW ===" -ForegroundColor Cyan
git -C $RepoPath diff --stat HEAD
Write-Host "---" -ForegroundColor DarkGray

$safeBranch = "hands-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git -C $RepoPath checkout -b $safeBranch 2>&1 | Out-Null
Write-Host "Safety branch: $safeBranch" -ForegroundColor DarkGray

$confirm = Read-Host "Apply this diff? (y/n)"
if ($confirm -ne 'y') {
    git -C $RepoPath checkout - 2>&1 | Out-Null
    git -C $RepoPath branch -D $safeBranch 2>&1 | Out-Null
    Write-Host "Reverted to original branch. Safety branch deleted." -ForegroundColor Yellow
    Write-Host "Diff saved to $PatchFile." -ForegroundColor Yellow
    exit 0
}

git -C $RepoPath apply $patchPath 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED to apply diff. Check $PatchFile for errors." -ForegroundColor Red
    git -C $RepoPath checkout - 2>&1 | Out-Null
    git -C $RepoPath branch -D $safeBranch 2>&1 | Out-Null
    $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLY FAILED | see $PatchFile |"
    if (-not (Test-Path $logPath)) {
        Set-Content $logPath "# HANDS_LOG.md`n`n| Timestamp | Action | Tests | Patch |`n|-----------|--------|-------|-------|"
    }
    Add-Content $logPath $log
    exit 1
}

Write-Host "Diff applied successfully on branch: $safeBranch" -ForegroundColor Green

if ($TestCommand -ne "") {
    Write-Host "Running tests: $TestCommand" -ForegroundColor Cyan
    $testResult = Invoke-Expression "cd '$RepoPath' && $TestCommand" 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -eq 0) {
        Write-Host "TESTS PASSED" -ForegroundColor Green
    }
    else {
        Write-Host "TESTS FAILED (exit code: $exitCode)" -ForegroundColor Red
        $revert = Read-Host "Tests FAILED. Revert to original branch? (y/n)"
        if ($revert -eq 'y') {
            git -C $RepoPath checkout - 2>&1 | Out-Null
            git -C $RepoPath branch -D $safeBranch 2>&1 | Out-Null
            Write-Host "Reverted. Safety branch deleted." -ForegroundColor Yellow
        }
    }
    Write-Host $testResult
    $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLIED | tests=$exitCode | $safeBranch |"
}
else {
    $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLIED | no-tests | $safeBranch |"
}

if (-not (Test-Path $logPath)) {
    Set-Content $logPath "# HANDS_LOG.md`n`n| Timestamp | Action | Tests | Patch |`n|-----------|--------|-------|-------|"
}
Add-Content $logPath $log
Write-Host "Logged to HANDS_LOG.md" -ForegroundColor Green
Write-Host "Branch: $safeBranch — merge or delete after verification." -ForegroundColor Cyan
