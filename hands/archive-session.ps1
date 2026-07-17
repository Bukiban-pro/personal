param(
    [string]$RepoPath = ""
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "."
}

$sessionPath = Join-Path $RepoPath "SESSION.md"
$historyPath = Join-Path $RepoPath "SESSION_HISTORY.md"
$weekStamp = "Week of $(Get-Date -Format 'yyyy-MM-dd')"

if (-not (Test-Path $sessionPath)) {
    Write-Host "No SESSION.md found. Nothing to archive." -ForegroundColor Yellow
    exit 0
}

$current = Get-Content $sessionPath -Raw
if ([string]::IsNullOrWhiteSpace($current)) {
    Write-Host "SESSION.md is empty. Nothing to archive." -ForegroundColor Yellow
    exit 0
}

$archiveEntry = @"

---
# $weekStamp
_Archived: $(Get-Date -Format 'yyyy-MM-dd HH:mm')_
$current
"@

Add-Content -Path $historyPath -Value $archiveEntry

$freshStart = @"
# SESSION â€” Fresh Start

_Archived: $(Get-Date -Format 'yyyy-MM-dd')_
_Open this file and begin._

## Mission:

## Energy:

## PREFs to carry forward:
"@
Set-Content -Path $sessionPath -Value $freshStart

Write-Host "=== SESSION ARCHIVED ===" -ForegroundColor Cyan
Write-Host "Week: $weekStamp" -ForegroundColor Yellow
Write-Host "Archived to: SESSION_HISTORY.md" -ForegroundColor Green
Write-Host "SESSION.md reset to fresh start." -ForegroundColor Yellow

