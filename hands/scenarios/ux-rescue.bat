@echo off
:: Scenario: UX Rescue (Jarvis)
powershell -ExecutionPolicy Bypass -File "%~dp0..\boot-session.ps1" -Mission "UX-RESCUE: %~1" -Profile unlimited
