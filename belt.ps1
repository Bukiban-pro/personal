$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$prompt = Get-Content (Join-Path $scriptDir "BELT.md") -Raw

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Clipboard]::SetText($prompt)

Write-Host ""
Write-Host "BELT loaded -"
Write-Host "  Fast. Direct. Low-fluff."
Write-Host "  Paste into any AI. Tell it your context."
Write-Host "  Protocol activates. Work begins."

Start-Process "https://claude.ai/new"
