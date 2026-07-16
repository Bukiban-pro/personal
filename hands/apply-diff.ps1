param(
    [string]$RepoPath = "",
    [string]$TestCommand = "",
    [string]$PatchFile = "clipboard.diff",
    [switch]$Watch,
    [string]$Dropzone = "DROPZONE.md"
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$patchPath = Join-Path $RepoPath $PatchFile
$logPath = Join-Path $RepoPath "HANDS_LOG.md"
$dropzonePath = Join-Path $RepoPath $Dropzone

function Extract-DiffsFromMarkdown {
    param([string]$Content)
    $diffs = @()
    $inDiff = $false
    $currentDiff = @()
    foreach ($line in ($Content -split "`n")) {
        if ($line -match '^```diff\s*$') {
            $inDiff = $true
            $currentDiff = @()
        }
        elseif ($inDiff -and $line -match '^```\s*$') {
            $inDiff = $false
            if ($currentDiff.Count -gt 0) {
                $diffs += ($currentDiff -join "`n")
            }
        }
        elseif ($inDiff) {
            $currentDiff += $line
        }
    }
    return $diffs
}

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
    Write-Host "Branch: $safeBranch â€” merge to main after verification." -ForegroundColor Cyan
}

# === DROPZONE WATCH MODE ===
if ($Watch) {
    if (-not (Test-Path $dropzonePath)) {
        Set-Content -Path $dropzonePath -Value "# DROPZONE.md`n`nDrop unified diffs in \`\`\`diff blocks below. Watcher auto-applies on save.`n`n---" -Encoding UTF8
        Write-Host "Created DROPZONE.md: $dropzonePath" -ForegroundColor DarkGray
    }

    Write-Host "=== DROPZONE WATCHER ===" -ForegroundColor Cyan
    Write-Host "Write \`\`\`diff blocks to: $dropzonePath" -ForegroundColor Yellow
    Write-Host "Watcher auto-applies on every save. Ctrl+C to stop." -ForegroundColor DarkGray
    Write-Host ""

    $lastContent = ""
    $appliedHashes = @{}

    while ($true) {
        if (Test-Path $dropzonePath) {
            $content = Get-Content $dropzonePath -Raw -ErrorAction SilentlyContinue
            if ($content -ne $lastContent) {
                $lastContent = $content
                $diffs = Extract-DiffsFromMarkdown -Content $content
                foreach ($diff in $diffs) {
                    $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($diff))
                    $hashStr = [System.BitConverter]::ToString($hash).Replace("-", "")
                    if (-not $appliedHashes.ContainsKey($hashStr)) {
                        Write-Host ">>> Detected new diff block" -ForegroundColor Green
                        Apply-Diff -DiffContent $diff -Source "DROPZONE.md"
                        $appliedHashes[$hashStr] = $true
                    }
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
    Write-Host "Or use -Watch to watch DROPZONE.md for \`\`\`diff blocks." -ForegroundColor DarkGray
    exit 1
}

Apply-Diff -DiffContent $clipText -Source "clipboard"

