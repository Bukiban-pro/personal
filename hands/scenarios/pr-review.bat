@echo off
:: Scenario: PR Review
powershell -ExecutionPolicy Bypass -File "%~dp0..\boot-session.ps1" -Mission "REVIEW: %~1" -Profile unlimited
