@echo off
setlocal enabledelayedexpansion

:: Parse args: belt.bat [repo-path] [mode]
set MODE=unlimited
set REPO=
if not "%1"=="" (
  if exist "%1\*" ( set REPO=%1 ) else ( set MODE=%1 )
)
if not "%2"=="" (
  if exist "%2\*" ( set REPO=%2 ) else ( set MODE=%2 )
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
$mode = "%MODE%"; ^
$repoPath = "%REPO%"; ^
if ($repoPath -eq "") { $cwd = Get-Location } else { $cwd = Resolve-Path $repoPath }; ^
$sessionFile = Join-Path $cwd "SESSION.md"; ^
$logFile = Join-Path $cwd "BELT_LOG.md"; ^
^
:: --- LOAD: Build prompt + context ---^
$self = Get-Content "%~f0"; ^
$start = [array]::IndexOf($self, ':BELT') + 1; ^
$prompt = ($self[$start..$self.Count] -join "`r`n"); ^
$context = @(); ^
$context += "Target: $cwd"; ^
$gitLog = & git log --oneline -10 2>$null; ^
if ($gitLog) { $context += "`n## COMMITS`n" + ($gitLog -join "`n") }; ^
$gitStatus = & git status --short 2>$null; ^
if ($gitStatus) { $context += "`n## CHANGES`n" + ($gitStatus -join "`n") }; ^
$pkg = ""; ^
if (Test-Path (Join-Path $cwd "pom.xml")) { $xml = [xml](Get-Content (Join-Path $cwd "pom.xml")); $pkg = "Java/" + $xml.project.artifactId + " (" + $xml.project.parent.version + ")" } ^
elseif (Test-Path (Join-Path $cwd "package.json")) { $json = Get-Content (Join-Path $cwd "package.json") -Raw | ConvertFrom-Json; $pkg = "Node/" + $json.name } ^
elseif (Test-Path (Join-Path $cwd "Cargo.toml")) { $pkg = "Rust" } ^
elseif (Test-Path (Join-Path $cwd "go.mod")) { $pkg = "Go" } ^
elseif (Test-Path (Join-Path $cwd "requirements.txt")) { $pkg = "Python" } ^
elseif (Test-Path (Join-Path $cwd "Makefile")) { $pkg = "Make" } ^
elseif (Test-Path (Join-Path $cwd "Dockerfile")) { $pkg = "Docker" }; ^
if ($pkg) { $context += "`n## STACK`n$pkg" }; ^
$tree = Get-ChildItem -Path $cwd -Depth 2 -ErrorAction SilentlyContinue ^
  | Where-Object { $_.FullName -notmatch '\\(node_modules|target|build|dist|__pycache__|\\.git|\\.venv|\\.idea|\\.vs)' } ^
  | ForEach-Object { $_.FullName.Substring($cwd.Path.Length + 1) } ^
  | Select-Object -First 60; ^
if ($tree) { $context += "`n## TREE`n" + ($tree -join "`n") }; ^
$readmePath = Join-Path $cwd "README.md"; ^
if (Test-Path $readmePath) { $readme = Get-Content $readmePath -TotalCount 20 -ErrorAction SilentlyContinue; if ($readme) { $context += "`n## README`n" + ($readme -join "`n") } }; ^
if (Test-Path $sessionFile) { $context += "`n## CARRY`n" + (Get-Content $sessionFile -Raw) }; ^
$final = $prompt -replace "\[MODE\]", $mode; ^
$final = $final + "`n" + ($context -join "`n"); ^
^
:: --- OUTPUT: Copy to clipboard + open browser ---^
Add-Type -AssemblyName System.Windows.Forms; ^
[System.Windows.Forms.Clipboard]::SetText($final); ^
Write-Host ""; ^
Write-Host "╔══════════════════════════════════════════════╗"; ^
Write-Host "║          BELT ACTIVE — WATCH MODE           ║"; ^
Write-Host "║──────────────────────────────────────────────║"; ^
Write-Host ("║  Mode: $mode"); ^
if ($pkg) { Write-Host ("║  Stack: $pkg") } else { Write-Host ("║  Stack: (detected)") }; ^
if ($gitLog) { Write-Host "║  Commits: 10 loaded" }; ^
Write-Host "║──────────────────────────────────────────────║"; ^
Write-Host "║  1. PASTE into your AI                      ║"; ^
Write-Host "║  2. AI responds — COPY the output            ║"; ^
Write-Host "║  3. BELT detects clipboard — auto-applies    ║"; ^
Write-Host "║  4. Tests run. Session saved. Loop repeats.  ║"; ^
Write-Host "║──────────────────────────────────────────────║"; ^
Write-Host "║  Ctrl+C to stop. Close window to end.        ║"; ^
Write-Host "╚══════════════════════════════════════════════╝"; ^
Write-Host ""; ^
Start-Process "https://claude.ai/new"; ^
^
:: --- WATCH: Monitor clipboard for AI responses ---^
Write-Host "Watching for AI response..." -ForegroundColor Cyan; ^
$lastClip = [System.Windows.Forms.Clipboard]::GetText(); ^
$loopCount = 0; ^
while ($true) { ^
  Start-Sleep -Seconds 2; ^
  $loopCount++; ^
  try { $currentClip = [System.Windows.Forms.Clipboard]::GetText() } catch { continue }; ^
  if ($currentClip -ne $lastClip -and $currentClip.Length -gt 20) { ^
    $lastClip = $currentClip; ^
    Write-Host ("`n[$(Get-Date -Format 'HH:mm:ss')] Detected new clipboard content " -ForegroundColor Yellow); ^
    ^
    if ($currentClip -match '```diff\s*\r?\n([\s\S]*?)```') { ^
      $diffContent = $matches[1]; ^
      $diffFile = Join-Path $env:TEMP "belt_diff_$(Get-Date -Format 'HHmmss').patch"; ^
      Set-Content $diffFile $diffContent -Encoding UTF8; ^
      Write-Host "  Applying diff..." -ForegroundColor Yellow; ^
      & git -C $cwd apply $diffFile 2>&1 | ForEach-Object { Write-Host "    $_" }; ^
      if ($LASTEXITCODE -eq 0) { ^
        Write-Host "  Diff applied." -ForegroundColor Green; ^
        ^
        $testCmd = $null; ^
        if (Test-Path (Join-Path $cwd "pom.xml")) { $testCmd = "mvn test -q" } ^
        elseif (Test-Path (Join-Path $cwd "package.json")) { $testCmd = "npm test -- --watchAll=false 2>&1" } ^
        elseif (Test-Path (Join-Path $cwd "requirements.txt")) { $testCmd = "python -m pytest -q" } ^
        elseif (Test-Path (Join-Path $cwd "Cargo.toml")) { $testCmd = "cargo test -q" }; ^
        if ($testCmd) { ^
          Write-Host "  Running tests..." -ForegroundColor Yellow; ^
          Invoke-Expression $testCmd; ^
          if ($LASTEXITCODE -eq 0) { Write-Host "  Tests passed." -ForegroundColor Green } ^
          else { Write-Host "  Tests FAILED." -ForegroundColor Red }; ^
        }; ^
        Remove-Item $diffFile -Force -ErrorAction SilentlyContinue; ^
      } else { ^
        Write-Host "  Diff failed. Copy may not be a valid git diff." -ForegroundColor Red; ^
      }; ^
      ^
    } elseif ($currentClip -match '(?i)COMPOUND:\s*(.+)') { ^
      $compoundLine = $matches[1]; ^
      Set-Content $sessionFile $compoundLine -Encoding UTF8; ^
      Write-Host ("  Session saved: $compoundLine") -ForegroundColor Green; ^
    }; ^
    ^
    Write-Host "Watching for next AI response..." -ForegroundColor Cyan; ^
  }; ^
};
goto :EOF

:BELT
You are now the operating system. Amplify the human. Every interaction produces maximum value. No questions. No dead cycles. Follow the loop exactly.

## LOOP
1. CONTEXT — What are we looking at? One sentence.
2. PLAN — The single highest-leverage action. One sentence.
3. EXECUTE — Produce output. Exact command, diff, or content. Ready to use.
4. VERIFY — Human runs it. Check. Fix if broken.
5. COMPOUND — One line: what changed, what learned, what's next.

## MODE
unlimited — Full production. Max output. No limits.
token-limited — Just the diff/command. Zero commentary.
corp-sec — Synthetic data. No real URLs. Every step audited.
stealth — Zero deps. Zero internet. Pure stdlib. Self-contained.

Current mode: [MODE]

## RULES
- Never ask a question. Use the loop.
- If the human's request is suboptimal, argue. Then produce the better version.
- Every output is immediately usable. No setup, no follow-ups.
- Mode fidelity is absolute. unlimited = max output. token-limited = minimal output.
- End every interaction with COMPOUND. The next interaction starts from it.
- When you output a diff, format it as a fenced ```diff block.
- When you output a plan, end with an exact command the human runs.
- When you end a loop, output COMPOUND: [what changed] | [what learned] | [what next]
