@echo off
setlocal enabledelayedexpansion
title BATMAN UTILITY BELT

set "GH_USER=Bukiban-pro"
set "GH_REPO=personal"
set "GH_BRANCH=main"
set "HANDLES=%USERPROFILE%\handles"
set "RAW=https://raw.githubusercontent.com/%GH_USER%/%GH_REPO%/%GH_BRANCH%"
set "SELF=%~f0"

:: === INSTALL MODE ===
if /i "%1"=="--install" goto :install
if /i "%1"=="--headless" set "HEADLESS=1"

echo.
echo === BATMAN UTILITY BELT ===
echo.

:: Self-update
powershell -ExecutionPolicy Bypass -Command "$u='%RAW%/init.bat';try{$r=Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 5;if($r.Content.Length -gt 100 -and $r.Content.Length -ne (Get-Item '%SELF%').Length){[System.IO.File]::WriteAllText('%SELF%',$r.Content);Write-Host 'SELF-UPDATED';exit 42}}catch{}"
if %errorlevel% equ 42 (start "" "%SELF%" --headless & exit /b)

if not exist "%HANDLES%" mkdir "%HANDLES%" >nul 2>&1

:: Download scripts
for %%s in (boot.ps1 task.ps1 apply.ps1 context-pack.ps1) do (
  powershell -ExecutionPolicy Bypass -Command "try{$r=Invoke-WebRequest '%RAW%/hands/%%s' -UseBasicParsing -TimeoutSec 5;[System.IO.File]::WriteAllText('%HANDLES%\%%s',$r.Content)}catch{}"
)

:: Create .bat wrappers (bypasses PowerShell execution policy)
echo @echo off ^& powershell -ExecutionPolicy Bypass -File "%HANDLES%\boot.ps1" %%* > "%HANDLES%\boot.bat"
echo @echo off ^& powershell -ExecutionPolicy Bypass -File "%HANDLES%\task.ps1" %%* > "%HANDLES%\task.bat"
echo @echo off ^& powershell -ExecutionPolicy Bypass -File "%HANDLES%\apply.ps1" %%* > "%HANDLES%\apply.bat"
echo @echo off ^& powershell -ExecutionPolicy Bypass -File "%HANDLES%\context-pack.ps1" %%* > "%HANDLES%\pack.bat"

:: Add to PATH
for /f "tokens=2*" %%p in ('reg query "HKCU\Environment" /v PATH 2^>nul') do set "USER_PATH=%%q"
echo !USER_PATH! | find /i "%HANDLES%" >nul
if errorlevel 1 (
  reg add "HKCU\Environment" /v PATH /t REG_EXPAND_SZ /d "!USER_PATH!;%HANDLES%" /f >nul
)

:: Launch (skip if headless)
if defined HEADLESS goto :done

start "" "chrome" "https://claude.ai/new" "https://chatgpt.com" "https://gemini.google.com" "https://perplexity.ai"

powershell -ExecutionPolicy Bypass -Command "$s='';$sp='%USERPROFILE%\references\session\SESSION.md';if(Test-Path $sp){$s=(gc $sp -Raw).Substring(0,[Math]::Min(500,(gc $sp -Raw).Length))};$p='Read and adopt: %RAW%/references/prompts/core-philosophy.md';$p+='`n`nSESSION:`n'+$s+'`n`nBoot the OS. Show PLAN.md.';Set-Clipboard $p"
echo   4 tabs opened. OS prompt copied to clipboard.
goto :done

:: === INSTALL PERSISTENT INFRASTRUCTURE ===
:install
echo.
echo === INSTALLING PERSISTENT SYSTEM ===

:: Copy init.bat to a stable location
copy "%SELF%" "%USERPROFILE%\belt.bat" /y >nul
echo   Installed to %%USERPROFILE%%\belt.bat

:: Add to Startup (HKCU Run)
powershell -ExecutionPolicy Bypass -Command "$v='\"'+'%USERPROFILE%\belt.bat --headless'+'\"';Set-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' 'BATMAN-BELT' $v -ErrorAction SilentlyContinue;Write-Host '  Startup entry added.'"

:: Create scheduled task for daily boot
schtasks /create /tn "BATMAN-BELT-BOOT" /tr "powershell -ExecutionPolicy Bypass -File \"%HANDLES%\boot.ps1\" -Mission 'daily-standup'" /sc daily /st 08:00 /f >nul 2>&1
echo   Scheduled task: daily boot at 08:00

:: Create desktop shortcuts
set "DESKTOP=%USERPROFILE%\Desktop"
powershell -ExecutionPolicy Bypass -Command "$ws=New-Object -ComObject WScript.Shell;$s=$ws.CreateShortcut('%DESKTOP%\BOOT.lnk');$s.TargetPath='powershell.exe';$s.Arguments='-ExecutionPolicy Bypass -Command \"boot''''daily-mission''''''''''''\"';$s.Save();$s2=$ws.CreateShortcut('%DESKTOP%\TASKS.lnk');$s2.TargetPath='%RAW%/../TASKS.md -notepad';$s2.Save()" 2>nul
echo   Desktop shortcuts created.

:: Pin to Quick Access
powershell -ExecutionPolicy Bypass -Command "$app=New-Object -ComObject Shell.Application;$app.Namespace('%HANDLES%').Self.InvokeVerb('pintohome')" 2>nul

:: Run initial boot
echo   Running initial boot...
start "" "chrome" "https://claude.ai/new" "https://chatgpt.com" "https://gemini.google.com" "https://perplexity.ai"
powershell -ExecutionPolicy Bypass -Command "$s='';$sp='%USERPROFILE%\references\session\SESSION.md';if(Test-Path $sp){$s=(gc $sp -Raw).Substring(0,[Math]::Min(500,(gc $sp -Raw).Length))};$p='Read and adopt: %RAW%/references/prompts/core-philosophy.md';$p+='`n`nSESSION:`n'+$s+'`n`nBoot the OS. Show PLAN.md.';Set-Clipboard $p"
echo   Booted. OS prompt in clipboard.
echo.
echo === INSTALL COMPLETE ===
echo   From now on:
echo   - Double-click belt.bat on desktop ^(or type boot^)
echo   - Or just let the 08:00 daily boot handle it
echo   - All scripts auto-update from GitHub
echo   - No PowerShell policy issues ^(.bat wrappers^)
echo   - The system persists across reboots, reinstalls, anything
echo.

:done
endlocal
