param(
    [string]$RepoPath = "",
    [string]$TestCommand = "",
    [string]$PatchFile = "clipboard.diff",
    [switch]$Watch,
    [string]$Dropzone = "dropzone"
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$patchPath = Join-Path $RepoPath $PatchFile
$logPath = Join-Path $RepoPath "HANDS_LOG.md"
$dropzonePath = Join-Path $RepoPath $Dropzone

function Apply-Diff {
    param([string]$DiffContent, [string]$Source)

    if ($DiffContent -notmatch '^diff --git|\-\-\- a\/|\+\+\+ b\/|^Index:|^From ') {
        Write-Host "WARNING: $Source does not look like a unified diff." -ForegroundColor Yellow
        Write-Host "First 80 chars: $($DiffContent.Substring(0, [Math]::Min(80, $DiffContent.Length)))" -ForegroundColor Yellow
        if (-not $Watch) {
            $confirm = Read-Host "Continue anyway? (y/n)"
            if ($confirm -ne 'y') { return }
        }
    }

    Set-Content -Path $patchPath -Value $DiffContent -NoNewline

    Write-Host "=== DIFF REVIEW ($Source) ===" -ForegroundColor Cyan
    git -C $RepoPath diff --stat HEAD
    Write-Host "---" -ForegroundColor DarkGray

    $stashResult = git -C $RepoPath stash push -m "hands-pre-apply-$(Get-Date -Format 'HHmmss')" 2>&1
    $stashCreated = $stashResult -notmatch "No local changes"
    if ($stashCreated) { Write-Host "Working changes stashed." -ForegroundColor DarkGray }

    $safeBranch = "hands-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    git -C $RepoPath checkout -b $safeBranch 2>&1 | Out-Null
    Write-Host "Safety branch: $safeBranch" -ForegroundColor DarkGray

    if (-not $Watch) {
        $confirm = Read-Host "Apply this diff? (y/n)"
        if ($confirm -ne 'y') {
            git -C $RepoPath checkout - 2>&1 | Out-Null
            git -C $RepoPath branch -D $safeBranch 2>&1 | Out-Null
            if ($stashCreated) { git -C $RepoPath stash pop 2>&1 | Out-Null }
            Write-Host "Reverted. Clean state." -ForegroundColor Yellow
            return
        }
    }

    git -C $RepoPath apply $patchPath 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAILED to apply diff. Check $PatchFile for errors." -ForegroundColor Red
        git -C $RepoPath checkout - 2>&1 | Out-Null
        git -C $RepoPath branch -D $safeBranch 2>&1 | Out-Null
        if ($stashCreated) { git -C $RepoPath stash pop 2>&1 | Out-Null }
        $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLY FAILED | see $PatchFile |"
        if (-not (Test-Path $logPath)) {
            Set-Content $logPath "# HANDS_LOG.md`n`n| Timestamp | Action | Details | Branch |`n|-----------|--------|--------|--------|"
        }
        Add-Content $logPath $log
        return
    }

    Write-Host "Diff applied successfully on branch: $safeBranch" -ForegroundColor Green

    $exitCode = -1
    if ($TestCommand -ne "") {
        Write-Host "Running tests: $TestCommand" -ForegroundColor Cyan
        $testResult = Invoke-Expression "cd '$RepoPath' && $TestCommand" 2>&1
        $exitCode = $LASTEXITCODE
        if ($exitCode -eq 0) {
            Write-Host "TESTS PASSED" -ForegroundColor Green
        }
        else {
            Write-Host "TESTS FAILED (exit code: $exitCode)" -ForegroundColor Red
            if (-not $Watch) {
                $r = Read-Host "Nuke and revert? (y/n)"
                if ($r -eq 'y') {
                    git -C $RepoPath checkout - 2>&1 | Out-Null
                    git -C $RepoPath branch -D $safeBranch 2>&1 | Out-Null
                    if ($stashCreated) { git -C $RepoPath stash pop 2>&1 | Out-Null }
                    Write-Host "Clean. You are back where you started." -ForegroundColor Yellow
                }
            }
        }
        Write-Host $testResult
        $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLIED | tests=$exitCode branch=$safeBranch | $PatchFile |"
    }
    else {
        $log = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | APPLIED | no-tests branch=$safeBranch | $PatchFile |"
    }

    if (-not (Test-Path $logPath)) {
        Set-Content $logPath "# HANDS_LOG.md`n`n| Timestamp | Action | Details | Branch |`n|-----------|--------|--------|--------|"
    }
    Add-Content $logPath $log
    Write-Host "Logged to HANDS_LOG.md" -ForegroundColor Green
    Write-Host "Branch: $safeBranch — merge to main after verification." -ForegroundColor Cyan
}

# === DROPZONE WATCH MODE ===
if ($Watch) {
    if (-not (Test-Path $dropzonePath)) {
        New-Item -ItemType Directory -Path $dropzonePath -Force | Out-Null
        Write-Host "Created DROPZONE: $dropzonePath" -ForegroundColor DarkGray
    }

    Write-Host "=== DROPZONE WATCHER ===" -ForegroundColor Cyan
    Write-Host "Drop .diff files into: $dropzonePath" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray
    Write-Host ""

    $applied = @{}
    while ($true) {
        $diffs = Get-ChildItem -Path $dropzonePath -Filter "*.diff" -ErrorAction SilentlyContinue
        foreach ($f in $diffs) {
            if (-not $applied.ContainsKey($f.FullName)) {
                $content = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
                if ($content) {
                    Write-Host ">>> Detected: $($f.Name)" -ForegroundColor Green
                    Apply-Diff -DiffContent $content -Source $f.Name
                    $applied[$f.FullName] = $true
                }
            }
        }
        Start-Sleep -Seconds 2
    }
}

# === SINGLE-SHOT MODE (default) ===
$clipText = Get-Clipboard -TextFormatType Text -ErrorAction SilentlyContinue
if (-not $clipText) {
    $clipText = Get-Clipboard
}

if ([string]::IsNullOrWhiteSpace($clipText)) {
    Write-Host "ERROR: Clipboard is empty. Copy a diff from ChatGPT first." -ForegroundColor Red
    Write-Host "Or use -Watch to watch a DROPZONE directory for .diff files." -ForegroundColor DarkGray
    exit 1
}

Apply-Diff -DiffContent $clipText -Source "clipboard"
