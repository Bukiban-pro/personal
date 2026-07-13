param([switch]$Save)

$cwd = Get-Location
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sessionFile = Join-Path $cwd "SESSION.md"
$promptFile = Join-Path $scriptDir "BELT.md"
$claudeMdFile = Join-Path $cwd "CLAUDE.md"

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

$fullPrompt = $prompt + ($context -join "`n")

Write-Host ""
Write-Host "BELT loaded -"
if ($pkg) { Write-Host "  Stack: $pkg" }
if ($gitLog) { Write-Host "  Commits: $((@($gitLog)).Count)" }
if (Test-Path $sessionFile) { Write-Host "  Session carryover loaded" }

Write-Host ""
Write-Host "  Scanning for AI tools..."
Write-Host ""

$claudeCmd = Get-Command "claude" -ErrorAction SilentlyContinue
$opencodeCmd = Get-Command "opencode" -ErrorAction SilentlyContinue

if ($claudeCmd) {
  Write-Host "  [1] Claude Code detected. Writing CLAUDE.md..."
  Set-Content $claudeMdFile $fullPrompt -Encoding UTF8
  Write-Host "  CLAUDE.md written. Starting Claude..."
  Start-Process $claudeCmd.Source -WorkingDirectory $cwd
}
elseif ($opencodeCmd) {
  Write-Host "  [1] OpenCode detected. Starting..."
  Set-Content $claudeMdFile $fullPrompt -Encoding UTF8
  Start-Process $opencodeCmd.Source -WorkingDirectory $cwd
}
else {
  Write-Host "  [1] No agent CLI found."

  try {
    $ollamaTest = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  [2] Ollama detected. Running local..."
    Write-Host ""

    $models = $ollamaTest.models.name
    if (-not $models -or $models.Count -eq 0) { throw "No models" }
    $preferred = @($models | Where-Object { $_ -match 'llama3.2|llama3|mistral|qwen2|deepseek' })
    $model = if ($preferred) { $preferred[0] } else { $models[0] }
    Write-Host "  Using: $model"
    Write-Host ""

    $body = @{
      model = $model
      prompt = $fullPrompt
      stream = $false
      options = @{ num_predict = 4096 }
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 120
    $output = $response.response

    Write-Host ""
    Write-Host ">> AI RESPONSE <<"
    Write-Host "----------------"
    Write-Host $output
    Write-Host "----------------"

    if ($output -match 'NEXT:\s*(.+)') {
      Set-Content $sessionFile ("NEXT: " + $matches[1]) -Encoding UTF8
      Write-Host "NEXT saved. Run 'belt' to continue."
    }
  }
  catch {
    Write-Host "  [2] No Ollama."
    Write-Host ""
    Write-Host "  [3] Using clipboard + browser."

    [System.Windows.Forms.Clipboard]::SetText($fullPrompt)
    Start-Process "https://claude.ai/new"

    Write-Host "  Clipboard loaded. Claude opened."
    Write-Host "  Paste. Work. Copy NEXT. Run 'belt -save'."
  }
}
