@echo off
:: Scenario: Legacy Debug (Inquisitor)
powershell -ExecutionPolicy Bypass -File "%~dp0..\boot-session.ps1" -Mission "DEBUG: %~1" -Profile unlimited
