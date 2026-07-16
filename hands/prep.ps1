param(
    [ValidateSet("scan","grid","outside","card","list")]
    [string]$Mode = "list",
    [string]$Card = "",
    [string]$RepoPath = "",
    [string]$Mission = "",
    [string]$Profile = "unlimited",
    [switch]$CorpSec
)

if ($RepoPath -eq "") {
    $RepoPath = Resolve-Path "$PSScriptRoot\.."
}

function Show-Help {
    Write-Host "=== PREP — Three-Mode Prep-Time Weapons Factory ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "USAGE: prep <mode> [options]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "MODES:" -ForegroundColor Green
    Write-Host "  scan       REPO SCAN MODE — CLI brain. Outputs 5 files for architect." -ForegroundColor White
    Write-Host "  grid       AGENT GRID MODE — 4-tab ignition (SCOPE/SHOT/FINDER/WEB)." -ForegroundColor White
    Write-Host "  outside    OUTSIDE BRAIN MODE — redacted structure pack for external AI." -ForegroundColor White
    Write-Host "  card       SCENARIO CARD — select card, execute full prep." -ForegroundColor White
    Write-Host "  list       List available scenario cards." -ForegroundColor White
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor Green
    Write-Host "  -RepoPath  Target repo (default: parent of this script)" -ForegroundColor DarkGray
    Write-Host "  -Mission   One-line mission for grid/outside modes" -ForegroundColor DarkGray
    Write-Host "  -Profile   Profile: unlimited|locked-down|zero-budget|token-limited|stealth|corp-sec|adaptive" -ForegroundColor DarkGray
    Write-Host "  -CorpSec   Enable corp-sec lane constraints (grid mode)" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor Green
    Write-Host "  prep scan -RepoPath .\target-repo" -ForegroundColor White
    Write-Host "  prep grid -Mission 'Ship checkout flow' -Profile corp-sec -CorpSec" -ForegroundColor White
    Write-Host "  prep outside -Mission 'Design auth architecture' -Profile adaptive" -ForegroundColor White
    Write-Host "  prep card ship-feature-unlimited" -ForegroundColor White
    Write-Host ""
}

switch ($Mode) {
    "list" {
        Show-Help
        Write-Host "AVAILABLE SCENARIO CARDS:" -ForegroundColor Green
        $cardsDir = "$PSScriptRoot\..\references\prompts\scenarios"
        if (Test-Path $cardsDir) {
            Get-ChildItem -Path $cardsDir -Filter "*.md" | ForEach-Object {
                $name = $_.BaseName
                $content = Get-Content $_.FullName -Raw
                $formula = if ($content -match '\*\*Formula:\*\*\s*(.+)') { $matches[1] } else { "unknown" }
                Write-Host "  $name  ->  $formula" -ForegroundColor White
            }
        }
        exit 0
    }

    "scan" {
        & "$PSScriptRoot\scan.ps1" -RepoPath $RepoPath
        exit $LASTEXITCODE
    }

    "grid" {
        if ($Mission -eq "") {
            Write-Host "ERROR: -Mission required for grid mode" -ForegroundColor Red
            exit 1
        }
        & "$PSScriptRoot\boot-session.ps1" -Mission $Mission -Profile $Profile -CorpSec:$CorpSec
        exit $LASTEXITCODE
    }

    "outside" {
        if ($Mission -eq "") {
            Write-Host "ERROR: -Mission required for outside mode" -ForegroundColor Red
            exit 1
        }
        & "$PSScriptRoot\context-pack.ps1" -SourceDir $RepoPath -Pack ultra -Anonymize -Mission $Mission
        exit $LASTEXITCODE
    }

    "card" {
        if ($Card -eq "") {
            Write-Host "ERROR: -Card required for card mode" -ForegroundColor Red
            exit 1
        }
        & "$PSScriptRoot\run-card.ps1" -Card $Card -RepoPath $RepoPath -Mission $Mission -Profile $Profile -CorpSec:$CorpSec
        exit $LASTEXITCODE
    }

    default {
        Show-Help
        exit 1
    }
}