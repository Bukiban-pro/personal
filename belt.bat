@echo off
setlocal enabledelayedexpansion
set MODE=unlimited
if not "%1"=="" set MODE=%1

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
$mode = "%MODE%"; ^
$self = Get-Content "%~f0"; ^
$start = [array]::IndexOf($self, ':BELT') + 1; ^
$prompt = ($self[$start..$self.Count] -join "`r`n"); ^
$context = @(); ^
$cwd = Get-Location; ^
$context += "Current directory: $cwd"; ^
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
$sessionPath = Join-Path $cwd "SESSION.md"; ^
if (Test-Path $sessionPath) { $context += "`n## CARRY`n" + (Get-Content $sessionPath -Raw) }; ^
$final = $prompt -replace "\[MODE\]", $mode; ^
$final = $final + "`n" + ($context -join "`n"); ^
Add-Type -AssemblyName System.Windows.Forms; ^
[System.Windows.Forms.Clipboard]::SetText($final); ^
Write-Host ""; ^
Write-Host "╔══════════════════════════════════════╗"; ^
Write-Host "║        BELT LOADED                   ║"; ^
Write-Host ("║  Mode: $mode" + " "*28) -NoNewline; ^
Write-Host if ($pkg) { "║  Stack: $pkg" } else { "║  Stack: (detected)" }; ^
if ($gitLog) { Write-Host "║  Commits: 10 loaded           ║" }; ^
Write-Host "║                                      ║"; ^
Write-Host "║  Open your AI. Paste (Ctrl+V).       ║"; ^
Write-Host "║  The system is ready.                ║"; ^
Write-Host "╚══════════════════════════════════════╝"; ^
Start-Process "https://claude.ai/new"
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
