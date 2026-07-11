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

$clipText = Get-Clipboard

if ([string]::IsNullOrWhiteSpace($clipText)) {
    Write-Host "ERROR: Clipboard is empty. Copy a diff from ChatGPT first." -ForegroundColor Red
    exit 1
}

if ($clipText -notmatch '^diff --git|\-\-\- a\/|\+\+\+ b\/|^Index:') {
    Write-Host "WARNING: Clipboard does not look like a unified diff." -ForegroundColor Yellow
    Write-Host "Starting diff markers found: $($clipText.Substring(0, [Math]::Min(80, $clipText.Length)))" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne 'y') { exit 0 }
}

Set-Content -Path $patchPath -Value $clipText

Write-Host "=== DIFF REVIEW ===" -ForegroundColor Cyan
git -C $RepoPath diff --stat HEAD
Write-Host "---" -ForegroundColor DarkGray

$confirm = Read-Host "Apply this diff? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Diff saved to $PatchFile. Not applied." -ForegroundColor Yellow
    exit 0
}

git -C $RepoPath apply $patchPath 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED to apply diff. Check $PatchFile for errors." -ForegroundColor Red
    $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLY FAILED | see $PatchFile |"
    Add-Content $logPath $log
    exit 1
}

Write-Host "Diff applied successfully." -ForegroundColor Green

if ($TestCommand -ne "") {
    Write-Host "Running tests: $TestCommand" -ForegroundColor Cyan
    $testResult = Invoke-Expression "cd '$RepoPath' && $TestCommand" 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -eq 0) {
        Write-Host "TESTS PASSED" -ForegroundColor Green
    }
    else {
        Write-Host "TESTS FAILED (exit code: $exitCode)" -ForegroundColor Red
    }
    Write-Host $testResult

    $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLIED | tests=$exitCode | $PatchFile |"
}
else {
    $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLIED | no-tests | $PatchFile |"
}

if (-not (Test-Path $logPath)) {
    Set-Content $logPath "# HANDS_LOG.md`n`n| Timestamp | Action | Tests | Patch |`n|-----------|--------|-------|-------|"
}
Add-Content $logPath $log
Write-Host "Logged to HANDS_LOG.md" -ForegroundColor Green
