param([switch]$Save, [switch]$Install)

$cwd = Get-Location
$scriptDir = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { $cwd }
$sessionFile = Join-Path $cwd "SESSION.md"
if (Test-Path $sessionFile) { Remove-Item $sessionFile -Force -ErrorAction SilentlyContinue }
$promptFile = Join-Path $scriptDir "BELT.md"
$claudeMdFile = Join-Path $cwd "CLAUDE.md"

if ($Install) {
  $p = [Environment]::GetEnvironmentVariable("Path", "User")
  if ($p -notlike "*$scriptDir*") { [Environment]::SetEnvironmentVariable("Path", "$scriptDir;$p", "User") }
  Write-Host "belt ready."
  Write-Host "One-liner: iex (iwr -Uri 'https://raw.githubusercontent.com/Bukiban-pro/personal/main/belt.ps1' -UseBasicParsing).Content"
  return
}

Add-Type -AssemblyName System.Windows.Forms

if ($Save) {
  $c = [System.Windows.Forms.Clipboard]::GetText()
  Set-Content $sessionFile $c -Encoding UTF8
  return
}

$embeddedProtocol = @"
Agent protocol. Works with any AI, anywhere.

On reading this, IMMEDIATELY:
1. SCAN - Analyze the context below. One sentence.
2. MOVE - Identify the highest-leverage improvement. IMPLEMENT it. Do not ask.
3. OUTPUT - What you did, what changed. Code, diff, results.
4. NEXT - One line: what happened, what now.

If I'm wrong, tell me. Show me better. Always end with NEXT.
"@

$prompt = if (Test-Path $promptFile) { Get-Content $promptFile -Raw } else { $embeddedProtocol }
$ctx = @()
$ctx += "`n## CONTEXT"
$ctx += "Directory: $cwd"

$g = & git log --oneline -5 2>$null
if ($g) { $ctx += "`nCommits:" + ($g -join "`n") }

$s = & git status --short 2>$null
if ($s) { $ctx += "`nChanges:" + ($s -join "`n"); $d = & git diff 2>$null; if ($d) { $ctx += "`nDiff:`n" + $d } }

$pkg = ""
if (Test-Path "$cwd\pom.xml") { $pkg = "Java/Maven" } elseif (Test-Path "$cwd\package.json") { $pkg = "Node" } elseif (Test-Path "$cwd\Cargo.toml") { $pkg = "Rust" } elseif (Test-Path "$cwd\go.mod") { $pkg = "Go" } elseif (Test-Path "$cwd\requirements.txt") { $pkg = "Python" } elseif (Test-Path "$cwd\Dockerfile") { $pkg = "Docker" }
if ($pkg) { $ctx += "`nStack: $pkg" }

$t = Get-ChildItem $cwd -Depth 2 -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\(node_modules|target|build|dist|__pycache__|\\.git|\\.venv)' } | ForEach-Object { $_.FullName.Substring($cwd.Path.Length + 1) } | Select-Object -First 30
if ($t) { $ctx += "`nFiles:`n" + ($t -join "`n") }

$r = "$cwd\README.md"
if (Test-Path $r) { $m = Get-Content $r -TotalCount 10 -ErrorAction SilentlyContinue; if ($m) { $ctx += "`nREADME:`n" + ($m -join "`n") } }

if (Test-Path $sessionFile) { $c = Get-Content $sessionFile -Raw; $ctx += "`n## CARRY" + $c }

$fullPrompt = $prompt + ($ctx -join "`n")

function Clean($t) { $t -replace '\x1b\[[0-9;]*[a-zA-Z]','' -replace '[^\x20-\x7E\n]','' -replace '^\s+|\s+$','' }

function SaveNext($t) { if ($t -match 'NEXT:\s*(.+)') { Set-Content $sessionFile ("NEXT: " + $matches[1]) -Encoding UTF8 } }

function Run-Cli($src, $runArgs) {
  $outFile = Join-Path ([System.IO.Path]::GetTempPath()) "belt_out_$([System.Guid]::NewGuid().ToString('N')).txt"
  $inFile = Join-Path ([System.IO.Path]::GetTempPath()) "belt_in_$([System.Guid]::NewGuid().ToString('N')).txt"
  Set-Content $inFile $fullPrompt -Encoding UTF8
  $isPs1 = $src -like "*.ps1"
  if ($isPs1) {
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"Get-Content '$inFile' | & '$src' $runArgs 2>&1 | Out-File '$outFile' -Encoding UTF8`"" -WorkingDirectory $cwd -NoNewWindow -Wait
  } else {
    Start-Process "$env:windir\System32\cmd.exe" -ArgumentList "/c type `"$inFile`" | `"$src`" $runArgs > `"$outFile`" 2>&1" -WorkingDirectory $cwd -NoNewWindow -Wait
  }
  Remove-Item $inFile -ErrorAction SilentlyContinue
  if (Test-Path $outFile) { $o = Get-Content $outFile -Raw; Remove-Item $outFile -ErrorAction SilentlyContinue; return $o }
  return $null
}

# Priority 1: AI CLI tools (detect, pipe, capture)
$tools = @(
  @{ cmd = "opencode"; run = "run --auto --no-replay" },
  @{ cmd = "claude"; run = "run --auto --no-replay" },
  @{ cmd = "aider"; run = "--message 'BELT online' --yes" },
  @{ cmd = "codex"; run = "--input" },
  @{ cmd = "cursor"; run = "--message 'BELT online'" }
)

$ran = $false
foreach ($tool in $tools) {
  $c = Get-Command $tool.cmd -ErrorAction SilentlyContinue
  if ($c) {
    Set-Content $claudeMdFile $fullPrompt -Encoding UTF8
    $out = Run-Cli $c.Source $tool.run
    if ($out) { $clean = Clean $out; Write-Host $clean; SaveNext $clean; $ran = $true; break }
    Write-Warning "$($tool.cmd) found but produced no output, trying next tool"
  }
}

# Priority 2: Ollama
if (-not $ran) {
  try {
    $t = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 2 -ErrorAction Stop
    $m = $t.models.name
    if ($m -and $m.Count -gt 0) {
      $p = @($m | Where-Object { $_ -match 'llama3.2|llama3|mistral|qwen2|deepseek' })
      $model = if ($p) { $p[0] } else { $m[0] }
      $body = @{ model = $model; prompt = $fullPrompt; stream = $false; options = @{ num_predict = 4096 } } | ConvertTo-Json
      $r = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 120
      if ($r.response) { Write-Host $r.response; SaveNext $r.response }
      $ran = $true
    }
  } catch {}
}

# Priority 3: OpenAI-compatible API (detect env vars)
if (-not $ran) {
  $key = if ($env:OPENAI_API_KEY) { $env:OPENAI_API_KEY } else { $null }
  $url = if ($env:OPENAI_BASE_URL) { "$($env:OPENAI_BASE_URL)/chat/completions" } else { "https://api.openai.com/v1/chat/completions" }
  $model = $env:OPENAI_MODEL

  if ($key) {
    try {
      if (-not $model) { $model = "gpt-4o" }
      $body = @{ model = $model; messages = @(@{ role = "user"; content = $fullPrompt }); max_tokens = 4096 } | ConvertTo-Json
      $h = @{ Authorization = "Bearer $key"; "Content-Type" = "application/json" }
      $r = Invoke-RestMethod -Uri $url -Method Post -Headers $h -Body $body -TimeoutSec 120
      $t = $r.choices[0].message.content
      if ($t) { Write-Host $t; SaveNext $t }
      $ran = $true
    } catch {}
  }
}

# Priority 4: Anthropic API
if (-not $ran -and $env:ANTHROPIC_API_KEY) {
  try {
    $model = if ($env:ANTHROPIC_MODEL) { $env:ANTHROPIC_MODEL } else { "claude-3-5-sonnet-20241022" }
    $body = @{ model = $model; max_tokens = 4096; messages = @(@{ role = "user"; content = $fullPrompt }) } | ConvertTo-Json
    $h = @{ "x-api-key" = $env:ANTHROPIC_API_KEY; "anthropic-version" = "2023-06-01"; "Content-Type" = "application/json" }
    $r = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method Post -Headers $h -Body $body -TimeoutSec 120
    $t = $r.content[0].text
    if ($t) { Write-Host $t; SaveNext $t }
    $ran = $true
  } catch {}
}

# Fallback: clipboard + browser
if (-not $ran) {
  [System.Windows.Forms.Clipboard]::SetText($fullPrompt)
  Start-Process "https://claude.ai/new"
}
