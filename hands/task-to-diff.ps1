param(
    [string]$RepoPath = "",
    [string]$Task = "",
    [string]$TaskFile = "TASKS.md"
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

$prompt = @"
You are operating under my engineering OS.
Read and adopt: https://raw.githubusercontent.com/Bukiban-pro/personal/main/references/prompts/core-philosophy.md

PROFILE: unlimited
MODE: You produce only artifacts. No commentary. No explanations. No greetings.

TASK:
"@

if ($Task -ne "") {
    $prompt += "`n$Task`n`n"
}
else {
    $tasksPath = Join-Path $RepoPath $TaskFile
    if (Test-Path $tasksPath) {
        $taskContent = Get-Content $tasksPath -Raw
        $firstTask = ($taskContent -split "(?=## TASK|\d+\. )") | Where-Object { $_ -match "\S" } | Select-Object -First 1
        if ($firstTask) {
            $prompt += "`n$firstTask`n`n"
        }
        else {
            $prompt += "`nFull TASKS.md:`n$taskContent`n`n"
        }
    }
}

$fileRefs = [regex]::Matches($prompt, '`([^`]+\.(java|kt|ts|tsx|js|jsx|py|rs|go|rb|php|sql|yaml|yml|xml|json|md|properties|css|scss|html|vue))`')
if ($fileRefs.Count -eq 0) {
    $fileRefs = [regex]::Matches($prompt, '(?<!\w)([\w/\\-]+\.(java|kt|ts|tsx|js|jsx|py|rs|go|rb|php|sql|yaml|yml|xml|json|md|properties|css|scss|html|vue))')
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
    $content = Get-Content $path -Raw
    if ($content.Length -gt 50000) {
        $content = $content.Substring(0, 50000) + "`n... [TRUNCATED at 50000 chars]"
    }
    $prompt += "`n### $f`n``````$content``````"
}

$prompt += "`nOUTPUT: unified diff that can be applied with 'git apply'. Test assertions. Nothing else."

Set-Clipboard $prompt
Write-Host "=== TASK-TO-DIFF ===" -ForegroundColor Cyan
Write-Host "Task read from: $(if ($Task -ne '') { 'parameter' } else { $TaskFile })" -ForegroundColor Yellow
Write-Host "Files collected: $($contextFiles.Count)" -ForegroundColor Yellow
Write-Host "Total prompt length: $($prompt.Length) chars" -ForegroundColor Yellow
Write-Host "Prompt copied to clipboard." -ForegroundColor Green
Write-Host "PASTE INTO CHATGPT TAB 2 NOW." -ForegroundColor Magenta
