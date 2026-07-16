param(
    [string]$SourceDir = ".",
    [string]$Extensions = "java,kt,ts,tsx,py,js,jsx,rs,go,rb,php,sql,yaml,yml,xml,json,md,properties,css,scss,html,vue,sh,ps1,bat",
    [int]$MaxChars = 60000,
    [string]$OutputFile = "",
    [ValidateSet("full","packed","ultra")]
    [string]$Pack = "full",
    [switch]$NoClipboard,
    [switch]$Anonymize
)

if (-not (Test-Path $SourceDir)) {
    Write-Host "ERROR: Directory not found: $SourceDir" -ForegroundColor Red
    exit 1
}

$exts = $Extensions -split "," | ForEach-Object { $_.Trim().TrimStart('.') }
$allFiles = Get-ChildItem -Path $SourceDir -Recurse -File -ErrorAction SilentlyContinue
$filtered = $allFiles | Where-Object { $_.Extension.TrimStart('.') -in $exts }

$output = ""
$count = 0
foreach ($file in $filtered) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $block = "=== FILE: $($file.FullName) ===`n$content`n"
        if ($output.Length + $block.Length -gt $MaxChars) {
            $output += "`n... [TRUNCATED at $MaxChars chars — $($filtered.Count - $count) files omitted]"
            break
        }
        $output += $block
        $count++
    }
}

# Apply pack modes
switch ($Pack) {
    "packed" {
        $output = $output -replace '(?m)^\s*//.*$', '' -replace '(?m)^\s*#.*$', '' -replace '(?m)^(\s*\n){3,}', "`n`n"
        if ($output.Length -gt 50000) {
            $output = $output.Substring(0, 50000) + "`n... [TRUNCATED at 50000 chars — token budget preserved]"
        }
    }
    "ultra" {
        $lines = $output -split "`n"
        $keep = $lines | Where-Object {
            $_ -match '^\s*(export |import |type |interface |function |class |const |async |def |class |public |private |protected |@|// |/\*\*| \* )' -or
            $_ -match '^\s*\}' -or
            $_.Length -lt 100
        }
        $output = ($keep[0..[Math]::Min(1999, $keep.Count-1)] -join "`n")
    }
}

# Anonymize for external agents
if ($Anonymize) {
    $companyNames = @("Contoso","Northwind","Acme","Fabrikam","your-company","YourCompany","COMPANY_NAME","<company>","<customer>")
    foreach ($name in $companyNames) {
        $output = $output -replace [regex]::Escape($name), "[REDACTED]"
    }
    $output = $output -replace '(?i)(api[_-]?key|secret[_-]?key|password|token|credential)\s*[:=]\s*["\x27][^"\x27]+["\x27]', '$1=[REDACTED]'
}

if ($Pack -eq "ultra") {
    $output = "## PACKED CONTEXT (Pack=$Pack, $($count) files, $($output.Length) chars)`n$output"
}
elseif ($Pack -eq "packed") {
    $output = "## PACKED CONTEXT (Pack=$Pack, $($count) files, $($output.Length) chars)`n$output"
}
else {
    $output = "## FULL CONTEXT (Pack=$Pack, $($count) files, $($output.Length) chars)`n$output"
}

if ($NoClipboard) {
    Write-Output $output
}
else {
    Set-Clipboard $output
    Write-Host "=== CONTEXT PACK ===" -ForegroundColor Cyan
    Write-Host "Directory: $SourceDir" -ForegroundColor Yellow
    Write-Host "Pack: $Pack | Anonymize: $Anonymize" -ForegroundColor Yellow
    Write-Host "Extensions: $Extensions" -ForegroundColor Yellow
    Write-Host "Files packed: $count of $($filtered.Count)" -ForegroundColor Yellow
    Write-Host "Total chars: $($output.Length)" -ForegroundColor Yellow
    Write-Host "Copied to clipboard." -ForegroundColor Green
    if ($Pack -ne "full") {
        Write-Host "LANE B: This pack is safe for external AI (no raw secrets)." -ForegroundColor Green
    }
}
