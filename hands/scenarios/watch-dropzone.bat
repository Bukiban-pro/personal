@echo off
:: Scenario: Watch DROPZONE for diffs and auto-apply
powershell -ExecutionPolicy Bypass -File "%~dp0..\apply-diff.ps1" -Watch -Dropzone dropzone
