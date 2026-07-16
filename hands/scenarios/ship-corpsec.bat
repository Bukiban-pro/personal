@echo off
:: Scenario: Ship Feature (Corp-Sec)
powershell -ExecutionPolicy Bypass -File "%~dp0..\boot-session.ps1" -Mission "%~1" -Profile corp-sec
