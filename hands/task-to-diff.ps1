param(
    [string]$RepoPath = "",
    [string]$Task = "",
    [string]$TaskFile = "TASKS.md",
    [string]$Profile = "unlimited",
    [string]$Tool = "chatgpt"
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$toolUpper = $Tool.ToUpper()
$outputSpec = switch ($toolUpper) {
    "CLAUDE" { "Output: PLAN.md blocks. No code yet." }
    "GEMINI" { "Output: research findings in 5 bullet structured format. No code." }
    default { "Output: unified diff that can be applied with 'git apply'. Test assertions. Nothing else." }
}

$prompt = @"
You are operating under my engineering OS.
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/references/prompts/core-philosophy.md

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

$contextFiles = @()
foreach ($match in $fileRefs) {
    $f = $match.Groups[1].Value
    $path = Join-Path $RepoPath $f
    if (Test-Path $path) {
        $contextFiles += $f
    }
}

$prompt += "CONTEXT FILES:`n"
foreach ($f in $contextFiles) {
    $path = Join-Path $RepoPath $f
    $content = Get-Content $path -Raw -ErrorAction SilentlyContinue
    if ($content) {
        if ($content.Length -gt 50000) {
            $content = $content.Substring(0, 50000) + "`n... [TRUNCATED at 50000 chars]"
        }
        $prompt += "`n### $f`n``````$content``````"
    }
}

Set-Clipboard $prompt
Write-Host "=== TASK-TO-DIFF ===" -ForegroundColor Cyan
Write-Host "Profile: $Profile" -ForegroundColor Yellow
Write-Host "Target: $toolUpper" -ForegroundColor Yellow
Write-Host "Task from: $(if ($Task -ne '') { 'parameter' } else { $TaskFile })" -ForegroundColor Yellow
Write-Host "Files collected: $($contextFiles.Count)" -ForegroundColor Yellow
Write-Host "Prompt length: $($prompt.Length) chars" -ForegroundColor Yellow
Write-Host "Copied to clipboard. Paste into $toolUpper now." -ForegroundColor Green
