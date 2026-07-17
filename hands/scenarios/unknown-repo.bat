@echo off
:: Scenario: Unknown Repo -- canonical prep scan + grid flow
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=%CD%"
powershell -ExecutionPolicy Bypass -File "%~dp0..\prep.ps1" card 01-unknown-repo -RepoPath "%TARGET%" -Mission "Unknown repo" -Profile adaptive
