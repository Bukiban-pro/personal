@echo off
:: Scenario: Unknown Repo — recon + scope
powershell -ExecutionPolicy Bypass -File "%~dp0..\repo-recon.ps1" -RepoPath "%~1"
echo.
echo Now paste recon output + BELT.md into any AI agent.
