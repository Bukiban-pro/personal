param(
    [string]$RepoPath = "",
    [string]$Task = "",
    [string]$TaskFile = "TASKS.md",
    [string]$Profile = "unlimited",
    [string]$Tool = "chatgpt",
    [ValidateSet("full","packed","ultra")]
    [string]$Pack = "packed"
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$toolUpper = $Tool.ToUpper()
$outputSpec = switch ($toolUpper) {
    "CLAUDE" { "Output: PLAN.md blocks. No code yet." }
    "GEMINI" { "Output: research findings in 5 bullet structured format. No code." }
    default  { "Output: unified diff that can be applied with 'git apply'. Test assertions. Nothing else." }
}

$prompt = @"
You are operating under my engineering OS.
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/BELT.md

PROFILE: $Profile
TARGET TOOL: $toolUpper
$outputSpec

TASK:
"@

if ($Task -ne "") {
    $prompt += "`n$Task`n`n"
}
else {
    $tasksPath = Join-Path $RepoPath $TaskFile
    if (Test-Path $tasksPath) {
        $taskContent = Get-Content $tasksPath -Raw
        $firstTask = ($taskContent -split "(?=## TASK|\d+\. |\[TASK\])") | Where-Object { $_ -match "\S" } | Select-Object -First 1
        if ($firstTask) {
            $prompt += "`n$firstTask`n`n"
        }
        else {
            $prompt += "`nFull TASKS.md:`n$taskContent`n`n"
        }
    }
}

$fileRefs = [regex]::Matches($prompt, '`([^`]+\.(java|kt|ts|tsx|js|jsx|py|rs|go|rb|php|sql|yaml|yml|xml|json|md|properties|css|scss|html|vue|sh|ps1|bat))`')
if ($fileRefs.Count -eq 0) {
    $fileRefs = [regex]::Matches($prompt, '(?<!\w)([\w/\\-]+\.(java|kt|ts|tsx|js|jsx|py|rs|go|rb|php|sql|yaml|yml|xml|json|md|properties|css|scss|html|vue|sh|ps1|bat))')
}

$rawContext = ""
$contextFiles = @()
foreach ($match in $fileRefs) {
    $f = $match.Groups[1].Value
    $path = Join-Path $RepoPath $f
    if (Test-Path $path) {
        $contextFiles += $f
        $content = Get-Content $path -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $rawContext += "`n### $f`n``````$content``````"
        }
    }
}

# Apply token packing
$context = $rawContext
switch ($Pack) {
    "packed" {
        $context = $rawContext -replace '(?m)^\s*//.*$', '' -replace '(?m)^\s*#.*$', '' -replace '(?m)^(\s*\n){3,}', "`n`n"
        if ($context.Length -gt 50000) {
            $context = $context.Substring(0, 50000) + "`n... [TRUNCATED at 50000 chars — token budget preserved]"
        }
    }
    "ultra" {
        $lines = $rawContext -split "`n"
        $keep = $lines | Where-Object {
            $_ -match '^\s*(export |import |type |interface |function |class |const |async |def |class |public |private |protected |@|// |/\*\*| \* )' -or
            $_ -match '^\s*\}' -or
            $_.Length -lt 100
        }
        $context = ($keep[0..[Math]::Min(1999, $keep.Count-1)] -join "`n")
    }
}

$prompt += "CONTEXT FILES:`n$context"
$prompt += "`nOUTPUT: unified diff. Test assertions. Nothing else."

Set-Clipboard $prompt

# Auto-log to HANDS_LOG.md
$logPath = "$RepoPath\HANDS_LOG.md"
$logEntry = "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | TASK-TO-DIFF | profile=$Profile tool=$toolUpper pack=$Pack files=$($contextFiles.Count) len=$($prompt.Length) | pending |"
if (-not (Test-Path $logPath)) {
    Set-Content $logPath "# HANDS_LOG.md`n`n| Timestamp | Action | Details | Branch |`n|-----------|--------|--------|--------|"
}
Add-Content $logPath $logEntry

Write-Host "=== TASK-TO-DIFF ===" -ForegroundColor Cyan
Write-Host "Profile: $Profile | Tool: $toolUpper | Pack: $Pack" -ForegroundColor Yellow
Write-Host "Files: $($contextFiles.Count) | Prompt: $($prompt.Length) chars" -ForegroundColor Yellow
Write-Host "Copied to clipboard. Paste into $toolUpper now." -ForegroundColor Green
Write-Host "Logged to HANDS_LOG.md" -ForegroundColor DarkGray
