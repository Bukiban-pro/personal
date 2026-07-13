param([switch]$Save)

$cwd = Get-Location
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sessionFile = Join-Path $cwd "SESSION.md"
$promptFile = Join-Path $scriptDir "BELT.md"

Add-Type -AssemblyName System.Windows.Forms

if ($Save) {
  $clip = [System.Windows.Forms.Clipboard]::GetText()
  Set-Content $sessionFile $clip -Encoding UTF8
  Write-Host "Session saved to SESSION.md"
  return
}

$prompt = Get-Content $promptFile -Raw
$context = @()
$context += "`n## CONTEXT`n"
$context += "Directory: $cwd"

$gitLog = & git log --oneline -5 2>$null
if ($gitLog) { $context += "`nCommits:`n" + ($gitLog -join "`n") }

$gitStatus = & git status --short 2>$null
if ($gitStatus) { $context += "`nChanges:`n" + ($gitStatus -join "`n") }

$pkg = ""
if (Test-Path (Join-Path $cwd "pom.xml")) { $pkg = "Java/Maven" }
elseif (Test-Path (Join-Path $cwd "package.json")) { $pkg = "Node" }
elseif (Test-Path (Join-Path $cwd "Cargo.toml")) { $pkg = "Rust" }
elseif (Test-Path (Join-Path $cwd "go.mod")) { $pkg = "Go" }
elseif (Test-Path (Join-Path $cwd "requirements.txt")) { $pkg = "Python" }
elseif (Test-Path (Join-Path $cwd "Dockerfile")) { $pkg = "Docker" }
if ($pkg) { $context += "`nStack: $pkg" }

$tree = Get-ChildItem -Path $cwd -Depth 2 -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\(node_modules|target|build|dist|__pycache__|\\.git|\\.venv)' } |
  ForEach-Object { $_.FullName.Substring($cwd.Path.Length + 1) } |
  Select-Object -First 30
if ($tree) { $context += "`nFiles:`n" + ($tree -join "`n") }

$readmePath = Join-Path $cwd "README.md"
if (Test-Path $readmePath) {
  $readme = Get-Content $readmePath -TotalCount 10 -ErrorAction SilentlyContinue
  if ($readme) { $context += "`nREADME:`n" + ($readme -join "`n") }
}

if (Test-Path $sessionFile) {
  $carry = Get-Content $sessionFile -Raw
  $context += "`n## CARRY`n" + $carry
}

$final = $prompt + ($context -join "`n")

[System.Windows.Forms.Clipboard]::SetText($final)

Write-Host ""
Write-Host "BELT loaded -"
if ($pkg) { Write-Host "  Stack: $pkg" }
if ($gitLog) { Write-Host "  Commits: $((@($gitLog)).Count)" }
if (Test-Path $sessionFile) { Write-Host "  Session carryover loaded" }
Write-Host "  Paste into AI. Protocol + context ready."
Write-Host "  After AI responds: copy NEXT line, run 'belt -save'"

Start-Process "https://claude.ai/new"
