@echo off
:: Scenario: Token-Limited Emergency
powershell -ExecutionPolicy Bypass -File "%~dp0..\boot-session.ps1" -Mission "%~1" -Profile token-limited -NoTabs
