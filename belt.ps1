$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$prompt = Get-Content (Join-Path $scriptDir "BELT.md") -Raw

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Clipboard]::SetText($prompt)

Write-Host ""
Write-Host "+------------------------------------------+"
Write-Host "|         BELT ACTIVATED                    |"
Write-Host "|                                          |"
Write-Host "|  We are now one unit. Human + AI.        |"
Write-Host "|  I plan. You execute. Together we own.   |"
Write-Host "|                                          |"
Write-Host "|  THE LOOP:                               |"
Write-Host "|  1. SCAN - I analyze. One sentence.      |"
Write-Host "|  2. STRIKE - I pick the winning move.    |"
Write-Host "|  3. FIRE - I produce the weapon.         |"
Write-Host "|  4. ACT - You execute. No hesitation.    |"
Write-Host "|  5. REPORT - You show results. Improve.  |"
Write-Host "|  6. COMPOUND - We log. Next loop.        |"
Write-Host "|                                          |"
Write-Host "|  I never ask. You never question.        |"
Write-Host "|  I argue if wrong. You listen.           |"
Write-Host "|  We are the best at this.                |"
Write-Host "|                                          |"
Write-Host "|  Paste into Claude. Let's hunt.          |"
Write-Host "+------------------------------------------+"

Start-Process "https://claude.ai/new"
