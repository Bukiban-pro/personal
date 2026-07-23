@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul 2>nul

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
set "CURDIR=%cd%"
set "DEFAULT_LIST=bundle_list.txt"
set "DEFAULT_OUT=review_bundle.txt"
set "LISTFILE="
set "OUTFILE="
set "MODE=smart"
set "RECURSE=0"
set "INCLUDE_META=1"
set "SKIP_BINARY=1"
set "PAUSE_END=1"
set "OVERWRITE=1"
set "IDX=0"
set "TMP=%TEMP%\review_bundle_%RANDOM%_%RANDOM%.tmp"

if /I "%~1"=="--help" goto :help
if /I "%~1"=="-h" goto :help
if /I "%~1"=="/?" goto :help
if "%~1"=="" goto :doubleclick

goto :args

:doubleclick
if exist "%SCRIPT_DIR%\%DEFAULT_LIST%" (
  set "LISTFILE=%SCRIPT_DIR%\%DEFAULT_LIST%"
  set "OUTFILE=%SCRIPT_DIR%\%DEFAULT_OUT%"
  goto :run_list
)
if exist "%CURDIR%\%DEFAULT_LIST%" (
  set "LISTFILE=%CURDIR%\%DEFAULT_LIST%"
  set "OUTFILE=%CURDIR%\%DEFAULT_OUT%"
  goto :run_list
)
echo.
echo No bundle_list.txt found in script dir or current dir.
echo Put bundle_list.txt next to the bat, then double-click again.
echo.
pause
exit /b 1

:args
:parse
if "%~1"=="" goto :dispatch
if /I "%~1"=="--default" (
  set "USE_DEFAULT=1"
  shift
  goto :parse
)
if /I "%~1"=="--from-file" (
  shift
  set "LISTFILE=%~1"
  shift
  goto :parse
)
if /I "%~1"=="--out" (
  shift
  set "OUTFILE=%~1"
  shift
  goto :parse
)
if /I "%~1"=="--recurse" (
  set "RECURSE=1"
  shift
  goto :parse
)
if /I "%~1"=="--no-meta" (
  set "INCLUDE_META=0"
  shift
  goto :parse
)
if /I "%~1"=="--no-binary-skip" (
  set "SKIP_BINARY=0"
  shift
  goto :parse
)
if /I "%~1"=="--no-pause" (
  set "PAUSE_END=0"
  shift
  goto :parse
)
if /I "%~1"=="--mode" (
  shift
  set "MODE=%~1"
  shift
  goto :parse
)
if /I "%~1"=="--append" (
  set "OVERWRITE=0"
  shift
  goto :parse
)
if "%~x1"==".txt" if not defined OUTFILE (
  set "OUTFILE=%~1"
  shift
  goto :parse
)
set /a IDX+=1
set "INPUT_%IDX%=%~1"
shift
goto :parse

:dispatch
if not defined OUTFILE set "OUTFILE=%DEFAULT_OUT%"
if not defined LISTFILE if defined USE_DEFAULT (
  if exist "%SCRIPT_DIR%\%DEFAULT_LIST%" set "LISTFILE=%SCRIPT_DIR%\%DEFAULT_LIST%"
  if not defined LISTFILE if exist "%CURDIR%\%DEFAULT_LIST%" set "LISTFILE=%CURDIR%\%DEFAULT_LIST%"
)
if defined LISTFILE goto :run_list
if %IDX% GTR 0 goto :run_args
if exist "%SCRIPT_DIR%\%DEFAULT_LIST%" (
  set "LISTFILE=%SCRIPT_DIR%\%DEFAULT_LIST%"
  goto :run_list
)
if exist "%CURDIR%\%DEFAULT_LIST%" (
  set "LISTFILE=%CURDIR%\%DEFAULT_LIST%"
  goto :run_list
)
echo.
echo No inputs found. Use --from-file, --default, or pass files/folders directly.
echo.
goto :help

:run_list
call :ensure_outdir "%OUTFILE%" || exit /b 1
if "%OVERWRITE%"=="1" (
  >"%TMP%" (
    call :write_header "%TMP%" "%OUTFILE%"
  )
) else (
  if not exist "%OUTFILE%" (
    >"%TMP%" call :write_header "%TMP%" "%OUTFILE%"
  ) else (
    copy /b "%OUTFILE%"+NUL "%TMP%" >nul
  )
)
call :append_list "%LISTFILE%" "%TMP%"
move /y "%TMP%" "%OUTFILE%" >nul
if errorlevel 1 (
  echo Failed to write output: %OUTFILE%
  del "%TMP%" >nul 2>nul
  exit /b 1
)
echo Wrote: %OUTFILE%
if "%PAUSE_END%"=="1" pause
exit /b 0

:run_args
call :ensure_outdir "%OUTFILE%" || exit /b 1
>"%TMP%" call :write_header "%TMP%" "%OUTFILE%"
for /L %%I in (1,1,%IDX%) do (
  call set "CUR=%%INPUT_%%I%%"
  call :emit_target "%TMP%" "%%CUR%%"
)
move /y "%TMP%" "%OUTFILE%" >nul
if errorlevel 1 (
  echo Failed to write output: %OUTFILE%
  del "%TMP%" >nul 2>nul
  exit /b 1
)
echo Wrote: %OUTFILE%
if "%PAUSE_END%"=="1" pause
exit /b 0

:ensure_outdir
set "OF=%~1"
for %%D in ("%OF%") do set "ODIR=%%~dpD"
if defined ODIR if not exist "%ODIR%" mkdir "%ODIR%" >nul 2>nul
exit /b 0

:append_list
set "LFILE=%~1"
set "TARGET=%~2"
if not exist "%LFILE%" (
  call :section "%TARGET%" "MISSING LIST FILE: %LFILE%"
  exit /b 0
)
for /f "usebackq delims=" %%L in ("%LFILE%") do (
  set "LINE=%%L"
  call :append_line "%TARGET%" "%%L"
)
exit /b 0

:append_line
set "TARGET=%~1"
set "LINE=%~2"
call :trim_line LINE
if not defined LINE exit /b 0
if "%LINE:~0,1%"=="#" exit /b 0
if /I "%LINE%"=="[dir]" exit /b 0
if /I "%LINE:~0,6%"=="[dir] " (
  set "DIR=%LINE:~6%"
  call :emit_dir "%TARGET%" "%DIR%"
  exit /b 0
)
if /I "%LINE:~0,7%"=="[glob] " (
  set "PAT=%LINE:~7%"
  call :emit_glob "%TARGET%" "%PAT%"
  exit /b 0
)
call :emit_target "%TARGET%" "%LINE%"
exit /b 0

:trim_line
setlocal EnableDelayedExpansion
set "S=!%~1!"
for /f "tokens=* delims= " %%A in ("!S!") do set "S=%%A"
:trim_right
if defined S if "!S:~-1!"==" " (
  set "S=!S:~0,-1!"
  goto :trim_right
)
endlocal & set "%~1=%S%"
exit /b 0

:emit_dir
set "TARGET=%~1"
set "DIR=%~2"
if not exist "%DIR%" (
  call :section "%TARGET%" "MISSING DIR: %DIR%"
  exit /b 0
)
if "%RECURSE%"=="1" (
  for /r "%DIR%" %%F in (*) do call :emit_target "%TARGET%" "%%~fF"
) else (
  for %%F in ("%DIR%\*") do if not exist "%%~fF\*" call :emit_target "%TARGET%" "%%~fF"
)
exit /b 0

:emit_glob
set "TARGET=%~1"
set "PAT=%~2"
set /a MATCH=0
for %%F in (%PAT%) do (
  if exist "%%~fF" (
    set /a MATCH+=1
    call :emit_target "%TARGET%" "%%~fF"
  )
)
if %MATCH%==0 call :section "%TARGET%" "NO GLOB MATCHES: %PAT%"
exit /b 0

:emit_target
set "TARGET=%~1"
set "ITEM=%~2"
if not exist "%ITEM%" (
  call :section "%TARGET%" "MISSING: %ITEM%"
  exit /b 0
)
if exist "%ITEM%\*" (
  call :emit_dir "%TARGET%" "%ITEM%"
  exit /b 0
)
if /I "%SKIP_BINARY%"=="1" call :is_binary "%ITEM%"
if /I "%SKIP_BINARY%"=="1" if "%BINFLAG%"=="1" (
  call :section "%TARGET%" "SKIPPED_BINARY: %ITEM%"
  exit /b 0
)
call :section "%TARGET%" "FILE: %ITEM%"
if "%INCLUDE_META%"=="1" (
  for %%A in ("%ITEM%") do (
    >> "%TARGET%" echo SIZE_BYTES: %%~zA
    >> "%TARGET%" echo MODIFIED: %%~tA
  )
)
>> "%TARGET%" echo.
type "%ITEM%" >> "%TARGET%" 2>nul
>> "%TARGET%" echo.
>> "%TARGET%" echo.
exit /b 0

:section
>> "%~1" echo ============================================================
>> "%~1" echo %~2
>> "%~1" echo ============================================================
>> "%~1" echo.
exit /b 0

:is_binary
set "BINFLAG=0"
set "E=%~x1"
for %%B in (.png .jpg .jpeg .gif .webp .bmp .ico .pdf .zip .7z .rar .gz .xz .parquet .db .sqlite .exe .dll .pkl .feather .arrow .bin .mp3 .mp4 .wav .avi .mov .xlsx .docx .pptx) do (
  if /I "%%B"=="%E%" set "BINFLAG=1"
)
exit /b 0

:write_header
>> "%~1" echo REVIEW BUNDLE
>> "%~1" echo GENERATED_AT_LOCAL: %date% %time%
>> "%~1" echo ROOT: %CURDIR%
>> "%~1" echo OUTPUT: %~2
>> "%~1" echo MODE: %MODE%
>> "%~1" echo RECURSE: %RECURSE%
>> "%~1" echo INCLUDE_META: %INCLUDE_META%
>> "%~1" echo SKIP_BINARY: %SKIP_BINARY%
>> "%~1" echo.
exit /b 0

:help
echo.
echo make_review_bundle_ultra.bat
>echo.
echo Defaults:
echo   bundle_list.txt   -> input list if present at script dir or current dir
echo   review_bundle.txt -> output file
echo.
echo Double-click behavior:
echo   - If bundle_list.txt exists, it is used automatically.
echo   - Otherwise you are prompted for a list path and output path.
echo.
echo Commands:
echo   make_review_bundle_ultra.bat
    echo   make_review_bundle_ultra.bat --default
    echo   make_review_bundle_ultra.bat --from-file bundle_list.txt
    echo   make_review_bundle_ultra.bat --out review_bundle.txt --from-file bundle_list.txt
    echo   make_review_bundle_ultra.bat --out review_bundle.txt artifacts\baselinesuite\manifest.json artifacts\baselinesuite\reports\*.md
    echo   make_review_bundle_ultra.bat --out review_bundle.txt [dir] artifacts\baselinesuite\reports
    echo   make_review_bundle_ultra.bat --out review_bundle.txt [glob] artifacts\baselinesuite\diagnostics\*.json
    echo.
echo List file format:
echo   blank lines ignored
echo   # comments ignored
echo   [dir] PATH    include a directory
echo   [glob] PAT    include wildcard matches
echo   any other line is treated as a file/folder/pattern
echo.
echo Examples for bundle_list.txt:
echo   artifacts\baselinesuite\manifest.json
echo   artifacts\baselinesuite\diagnostics\leakage_checks.json
echo   [glob] artifacts\baselinesuite\reports\*.md
echo   [dir] artifacts\baselinesuite\splits
echo.
if "%PAUSE_END%"=="1" pause
exit /b 0
