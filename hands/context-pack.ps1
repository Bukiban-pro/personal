param(
    [string]$SourceDir = ".",
    [string]$Extensions = "java,kt,ts,tsx,py,js,jsx,rs,go,rb,php,sql,yaml,yml,xml,json,md,properties,css,scss,html,vue,sh,ps1,bat",
    [int]$MaxChars = 60000,
    [string]$OutputFile = "",
    [switch]$NoClipboard
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

if ($NoClipboard) {
    Write-Output $output
}
else {
    Set-Clipboard $output
    Write-Host "=== CONTEXT PACK ===" -ForegroundColor Cyan
    Write-Host "Directory: $SourceDir" -ForegroundColor Yellow
    Write-Host "Extensions: $Extensions" -ForegroundColor Yellow
    Write-Host "Files packed: $count of $($filtered.Count)" -ForegroundColor Yellow
    Write-Host "Total chars: $($output.Length)" -ForegroundColor Yellow
    Write-Host "Copied to clipboard." -ForegroundColor Green
}
