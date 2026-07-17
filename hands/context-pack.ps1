param(
    [string]$SourceDir = ".",
    [string]$Extensions = "java,kt,ts,tsx,py,js,jsx,rs,go,rb,php,sql,yaml,yml,xml,json,md,properties,css,scss,html,vue,sh,ps1,bat",
    [int]$MaxChars = 60000,
    [string]$OutputFile = "",
    [string]$Mission = "",
    [ValidateSet("full","packed","ultra")]
    [string]$Pack = "full",
    [switch]$NoClipboard,
    [switch]$Anonymize
)

if (-not (Test-Path $SourceDir)) {
    Write-Host "ERROR: Directory not found: $SourceDir" -ForegroundColor Red
    exit 1
}

$sourceRoot = (Resolve-Path $SourceDir).Path
$exts = $Extensions -split "," | ForEach-Object { $_.Trim().TrimStart('.') }
$excludedPath = '\\(node_modules|\.git|dist|build|\.next|target|__pycache__|\.venv|coverage|\.prep-output)\\'
$allFiles = Get-ChildItem -Path $sourceRoot -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch $excludedPath }
$filtered = $allFiles | Where-Object { $_.Extension.TrimStart('.') -in $exts }

function Get-RelativePath {
    param([string]$Path)
    $full = (Resolve-Path $Path).Path
    if ($full.StartsWith($sourceRoot)) {
        return $full.Substring($sourceRoot.Length).TrimStart([char[]]@('\','/'))
    }
    return $full
}

function Redact-SensitiveText {
    param([string]$Text)

    $redacted = $Text
    $redacted = $redacted -replace '(?i)https?://[^\s''")]+', '[INTERNAL_URL]'
    $redacted = $redacted -replace '(?i)(api[_-]?key|secret[_-]?key|password|token|credential|client[_-]?secret)\s*[:=]\s*["''][^"'']+["'']', '$1=[REDACTED]'
    $redacted = $redacted -replace '(?i)(api[_-]?key|secret[_-]?key|password|token|credential|client[_-]?secret)\s*[:=]\s*[^\s,)]+', '$1=[REDACTED]'
    $redacted = $redacted -replace '(?i)(@Table\s*\(\s*name\s*=\s*)["''][^"'']+["'']', '$1"[SCHEMA_REDACTED]"'
    $redacted = $redacted -replace '(?i)bearer\s+[a-z0-9._\-]+', 'Bearer [REDACTED]'
    $redacted = $redacted -replace '[A-Za-z]:\\[^\s)]+', '[LOCAL_PATH]'

    foreach ($name in @("Contoso","Northwind","Acme","Fabrikam","your-company","YourCompany","COMPANY_NAME","<company>","<customer>")) {
        $redacted = $redacted -replace [regex]::Escape($name), "[REDACTED]"
    }

    return $redacted
}

function Select-UltraLines {
    param([string]$Content)

    $patterns = @(
        '^(export\s+)?(type|interface|class|enum)\s+[A-Za-z0-9_]+',
        '^(export\s+)?(async\s+)?function\s+[A-Za-z0-9_]+',
        '^(export\s+)?const\s+[A-Z0-9_]+\s*=',
        '^(export\s+)?const\s+[A-Za-z0-9_]+\s*[:=]\s*(create|define|z\.|use[A-Z]|async|\([^)]*\)\s*=>)',
        '^(public|private|protected)\s+',
        '^(def|class)\s+[A-Za-z0-9_]+',
        '^@(Get|Post|Put|Delete|Patch|Request|Rest|Controller|Service|Repository|Entity|Table|Column|Bean|Configuration)',
        '^(GET|POST|PUT|PATCH|DELETE)\s+',
        '(process\.env|import\.meta\.env)\.[A-Z0-9_]+',
        '^(route|path|href|url|endpoint|baseUrl|apiUrl)\s*[:=]'
    )

    $selected = New-Object System.Collections.Generic.List[string]
    foreach ($line in ($Content -split "`r?`n")) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed)) { continue }
        if ($trimmed.Length -gt 240) { continue }

        foreach ($pattern in $patterns) {
            if ($trimmed -match $pattern) {
                if ($trimmed -notmatch '^@' -and $trimmed -match '\)\s*\{.*\}') {
                    $trimmed = $trimmed -replace '\s*\{.*\}', ' { ... }'
                }
                $selected.Add($trimmed)
                break
            }
        }
    }
    return $selected
}

$output = ""
$count = 0
foreach ($file in $filtered) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }

    $relativePath = Get-RelativePath $file.FullName
    $displayPath = $relativePath
    if ($Anonymize -or $Pack -eq "ultra") {
        $displayPath = ("FILE_{0:D3}{1}" -f ($count + 1), $file.Extension)
    }
    if ($Pack -eq "ultra") {
        $lines = Select-UltraLines -Content $content
        if ($lines.Count -eq 0) { continue }
        $block = "=== FILE: $displayPath ===`n$($lines -join "`n")`n"
    }
    else {
        $block = "=== FILE: $displayPath ===`n$content`n"
    }

    if ($Anonymize -or $Pack -eq "ultra") {
        $block = Redact-SensitiveText -Text $block
    }

    if ($output.Length + $block.Length -gt $MaxChars) {
        $output += "`n... [TRUNCATED at $MaxChars chars -- $($filtered.Count - $count) files omitted]"
        break
    }

    $output += $block
    $count++
}

if ($Pack -eq "packed") {
    $output = $output -replace '(?m)^\s*//.*$', '' -replace '(?m)^\s*#.*$', '' -replace '(?m)^(\s*\n){3,}', "`n`n"
    if ($output.Length -gt 50000) {
        $output = $output.Substring(0, 50000) + "`n... [TRUNCATED at 50000 chars -- token budget preserved]"
    }
}

if ($Anonymize) {
    $output = Redact-SensitiveText -Text $output
}

$sourceLabel = if ($Anonymize -or $Pack -eq "ultra") { "[REDACTED_SOURCE]" } else { $sourceRoot }
$missionLine = if ($Mission -ne "") { "Mission: $Mission`n" } else { "" }
$kind = if ($Pack -eq "full") { "FULL CONTEXT" } else { "PACKED CONTEXT" }
$output = "## $kind (Pack=$Pack, files=$count, chars=$($output.Length))`n${missionLine}Source: $sourceLabel`n$output"

if ($OutputFile -ne "") {
    Set-Content -Path $OutputFile -Value $output -Encoding UTF8
}

if ($NoClipboard) {
    Write-Output $output
}
else {
    $copied = $false
    try {
        Set-Clipboard $output -ErrorAction Stop
        $copied = $true
    }
    catch {
        Write-Host "Clipboard unavailable. Use -OutputFile or rerun with -NoClipboard." -ForegroundColor Yellow
    }
    Write-Host "=== CONTEXT PACK ===" -ForegroundColor Cyan
    Write-Host "Directory: $sourceRoot" -ForegroundColor Yellow
    Write-Host "Pack: $Pack | Anonymize: $Anonymize" -ForegroundColor Yellow
    if ($Mission -ne "") { Write-Host "Mission: $Mission" -ForegroundColor Yellow }
    Write-Host "Extensions: $Extensions" -ForegroundColor Yellow
    Write-Host "Files packed: $count of $($filtered.Count)" -ForegroundColor Yellow
    Write-Host "Total chars: $($output.Length)" -ForegroundColor Yellow
    if ($OutputFile -ne "") { Write-Host "Saved: $OutputFile" -ForegroundColor Green }
    if ($copied) { Write-Host "Copied to clipboard." -ForegroundColor Green }
    if ($Pack -eq "ultra" -or $Anonymize) {
        Write-Host "LANE B: Structural pack only. Still inspect before external paste." -ForegroundColor Green
    }
}
