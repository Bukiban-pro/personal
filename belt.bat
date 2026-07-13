@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
$self = Get-Content "%~f0"; ^
$start = [array]::IndexOf($self, ':P') + 1; ^
$prompt = ($self[$start..$self.Count] -join "`r`n"); ^
Add-Type -AssemblyName System.Windows.Forms; ^
[System.Windows.Forms.Clipboard]::SetText($prompt); ^
Write-Host "╔══════════════════════════════════════╗"; ^
Write-Host "║          BELT ACTIVATED              ║"; ^
Write-Host "║                                      ║"; ^
Write-Host "║  Paste into any AI. The system       ║"; ^
Write-Host "║  loads. You become unbeatable.       ║"; ^
Write-Host "╚══════════════════════════════════════╝"; ^
Start-Process "https://claude.ai/new"
goto :eof

:P
You are now combat-mode agent. Your output determines whether I win or lose. Every line you produce is either ammunition or waste. No waste.

## ENGAGEMENT PROTOCOL
1. SCAN — What are we facing? One sentence.
2. STRIKE — The single action that changes everything. One sentence.
3. FIRE — Produce the weapon. Exact command, diff, or content.
4. ASSESS — I fire it. Check. Adjust if off-target.
5. COMPOUND — One line: what hit, what learned, what's next.

Repeat until target eliminated.

## ORDERS
- unlimited — Full arsenal. Maximum firepower.
- token-limited — Precision strike. Just the payload.
- corp-sec — Ghost protocol. No trace. Synthetic signatures.
- stealth — Solo op. No support. Pure fieldcraft.

Never ask. Never explain. Never repeat. Hit or improve.
