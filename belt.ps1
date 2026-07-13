param([switch]$Save, [switch]$Install)

$cwd = Get-Location
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sessionFile = Join-Path $cwd "SESSION.md"
$promptFile = Join-Path $scriptDir "BELT.md"
$claudeMdFile = Join-Path $cwd "CLAUDE.md"

if ($Install) {
  $path = [Environment]::GetEnvironmentVariable("Path", "User")
  if ($path -notlike "*$scriptDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$scriptDir;$path", "User")
    Write-Host "belt installed. Run 'belt' from any directory."
  } else {
    Write-Host "belt already in PATH."
  }
  return
}

Add-Type -AssemblyName System.Windows.Forms

if ($Save) {
  $clip = [System.Windows.Forms.Clipboard]::GetText()
  Set-Content $sessionFile $clip -Encoding UTF8
  return
}

$prompt = Get-Content $promptFile -Raw
$context = @()
$context += "`n## CONTEXT"
$context += "Directory: $cwd"

$gitLog = & git log --oneline -5 2>$null
if ($gitLog) { $context += "`nCommits:" + ($gitLog -join "`n") }

$gitStatus = & git status --short 2>$null
if ($gitStatus) { $context += "`nChanges:" + ($gitStatus -join "`n") }

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
if ($tree) { $context += "`nFiles:" + ($tree -join "`n") }

$readmePath = Join-Path $cwd "README.md"
if (Test-Path $readmePath) {
  $readme = Get-Content $readmePath -TotalCount 10 -ErrorAction SilentlyContinue
  if ($readme) { $context += "`nREADME:" + ($readme -join "`n") }
}

if (Test-Path $sessionFile) {
  $carry = Get-Content $sessionFile -Raw
  $context += "`n## CARRY" + $carry
}

$fullPrompt = $prompt + ($context -join "`n")

$claudeCmd = Get-Command "claude" -ErrorAction SilentlyContinue
$opencodeCmd = Get-Command "opencode" -ErrorAction SilentlyContinue

if ($claudeCmd -or $opencodeCmd) {
  $cmd = if ($claudeCmd) { $claudeCmd } else { $opencodeCmd }
  Set-Content $claudeMdFile $fullPrompt -Encoding UTF8
  $isPs1 = $cmd.Source -like "*.ps1"
  $exe = if ($isPs1) { "powershell.exe" } else { $cmd.Source }
  $args = if ($isPs1) { "-NoProfile -ExecutionPolicy Bypass -File `"" + $cmd.Source + "`"" } else { "" }
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $exe
  $psi.Arguments = $args
  $psi.WorkingDirectory = $cwd
  $psi.RedirectStandardInput = $true
  $psi.UseShellExecute = $false
  $p = [System.Diagnostics.Process]::Start($psi)
  Start-Sleep -Milliseconds 2000
  $p.StandardInput.WriteLine("SCAN the repo. Identify the highest-leverage improvement. IMPLEMENT it. Do not ask. Report what you did.")
  $p.StandardInput.WriteLine("")
  $p.StandardInput.Flush()
  $p.WaitForExit()
  return
}

try {
  $ollamaTest = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 2 -ErrorAction Stop
  $models = $ollamaTest.models.name
  if (-not $models -or $models.Count -eq 0) { throw "No models" }
  $preferred = @($models | Where-Object { $_ -match 'llama3.2|llama3|mistral|qwen2|deepseek' })
  $model = if ($preferred) { $preferred[0] } else { $models[0] }
  $body = @{ model = $model; prompt = $fullPrompt; stream = $false; options = @{ num_predict = 4096 } } | ConvertTo-Json
  $response = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 120
  $output = $response.response
  Write-Host $output
  if ($output -match 'NEXT:\s*(.+)') {
    Set-Content $sessionFile ("NEXT: " + $matches[1]) -Encoding UTF8
  }
  Read-Host "`nPress Enter to exit"
  return
}
catch {
  [System.Windows.Forms.Clipboard]::SetText($fullPrompt)
  Start-Process "https://claude.ai/new"
  Write-Host "Copied to clipboard. Claude opened in browser."
  Read-Host "Press Enter to exit"
  return
}
