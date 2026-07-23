@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul 2>nul

set "SCRIPT_DIR=%~dp0"
set "ROOT=%cd%"
set "DEFAULT_LIST=bundle_list.txt"
set "DEFAULT_OUT=review_bundle.txt"
set "TMP=%TEMP%\review_bundle_%RANDOM%_%RANDOM%.tmp"
set "MODE=SMART"
set "INCLUDE_META=1"
set "RECURSE=0"
set "ALLOW_GLOBS=1"
set "PAUSE_AT_END=1"
set "HAS_INPUT=0"

if /I "%~1"=="--help" goto :help
if /I "%~1"=="-h" goto :help

if "%~1"=="" goto :doubleclick_mode

goto :arg_mode

:doubleclick_mode
if exist "%SCRIPT_DIR%%DEFAULT_LIST%" (
  call :run_with_list "%SCRIPT_DIR%%DEFAULT_LIST%" "%SCRIPT_DIR%%DEFAULT_OUT%"
  goto :finish
)
if exist "%ROOT%\%DEFAULT_LIST%" (
  call :run_with_list "%ROOT%\%DEFAULT_LIST%" "%ROOT%\%DEFAULT_OUT%"
  goto :finish
)
echo No default list file found.
echo Expected one of:
echo   %SCRIPT_DIR%%DEFAULT_LIST%
echo   %ROOT%\%DEFAULT_LIST%
echo.
set /p USER_LIST=Enter list file path ^(or press Enter to cancel^): 
if "%USER_LIST%"=="" goto :finish
set /p USER_OUT=Enter output file path ^(default: %DEFAULT_OUT%^): 
if "%USER_OUT%"=="" set "USER_OUT=%DEFAULT_OUT%"
call :run_with_list "%USER_LIST%" "%USER_OUT%"
goto :finish

:arg_mode
set "OUT="
set "LISTFILE="

:parse_args
if "%~1"=="" goto :dispatch

if /I "%~1"=="--out" (
  shift
  set "OUT=%~1"
  shift
  goto :parse_args
)
if /I "%~1"=="--from-file" (
  shift
  set "LISTFILE=%~1"
  set "HAS_INPUT=1"
  shift
  goto :parse_args
)
if /I "%~1"=="--mode" (
  shift
  set "MODE=%~1"
  shift
  goto :parse_args
)
if /I "%~1"=="--recurse" (
  set "RECURSE=1"
  shift
  goto :parse_args
)
if /I "%~1"=="--no-meta" (
  set "INCLUDE_META=0"
  shift
  goto :parse_args
)
if /I "%~1"=="--no-pause" (
  set "PAUSE_AT_END=0"
  shift
  goto :parse_args
)
if /I "%~1"=="--default" (
  set "HAS_INPUT=2"
  shift
  goto :parse_args
)
if /I "%~1"=="--glob-off" (
  set "ALLOW_GLOBS=0"
  shift
  goto :parse_args
)

if not defined OUT (
  if /I not "%~x1"=="" (
    if /I "%~x1"==".txt" (
      set "OUT=%~1"
      shift
      goto :parse_args
    )
  )
)

set /a IDX+=1
set "INPUT_!IDX!=%~1"
set "HAS_INPUT=1"
shift
goto :parse_args

:dispatch
if not defined OUT set "OUT=%DEFAULT_OUT%"

if "%HAS_INPUT%"=="2" (
  if exist "%SCRIPT_DIR%%DEFAULT_LIST%" (
    call :run_with_list "%SCRIPT_DIR%%DEFAULT_LIST%" "%OUT%"
    goto :finish
  )
  if exist "%ROOT%\%DEFAULT_LIST%" (
    call :run_with_list "%ROOT%\%DEFAULT_LIST%" "%OUT%"
    goto :finish
  )
  echo Default list file not found.
  goto :finish
)

if defined LISTFILE (
  call :run_with_list "%LISTFILE%" "%OUT%"
  goto :finish
)

if %IDX% GTR 0 (
  call :run_with_args "%OUT%"
  goto :finish
)

goto :doubleclick_mode

:run_with_list
set "USE_LIST=%~1"
set "USE_OUT=%~2"
break > "%TMP%" || (
  echo Failed to create temp file.
  exit /b 1
)
call :write_header "%TMP%" "%USE_OUT%"
call :append_list_file "%TMP%" "%USE_LIST%"
move /Y "%TMP%" "%USE_OUT%" >nul
if errorlevel 1 (
  echo Failed to write output file: %USE_OUT%
  del "%TMP%" >nul 2>nul
  exit /b 1
)
echo Wrote review bundle: %USE_OUT%
exit /b 0

:run_with_args
set "USE_OUT=%~1"
break > "%TMP%" || (
  echo Failed to create temp file.
  exit /b 1
)
call :write_header "%TMP%" "%USE_OUT%"
for /L %%N in (1,1,%IDX%) do (
  call set "CURRENT=%%INPUT_%%N%%"
  call :consume_input "%TMP%" "!CURRENT!"
)
move /Y "%TMP%" "%USE_OUT%" >nul
if errorlevel 1 (
  echo Failed to write output file: %USE_OUT%
  del "%TMP%" >nul 2>nul
  exit /b 1
)
echo Wrote review bundle: %USE_OUT%
exit /b 0

:consume_input
set "TARGET=%~1"
set "RAW=%~2"
if exist "%RAW%" (
  if exist "%RAW%\*" (
    call :append_directory "%TARGET%" "%RAW%"
    goto :eof
  ) else (
    call :append_path "%TARGET%" "%RAW%"
    goto :eof
  )
)
if "%ALLOW_GLOBS%"=="1" (
  for %%F in (%RAW%) do (
    if exist "%%~fF" call :append_path "%TARGET%" "%%~fF"
  )
  goto :eof
)
call :append_missing "%TARGET%" "%RAW%"
goto :eof

:append_list_file
set "TARGET=%~1"
set "LISTFILE=%~2"
if not exist "%LISTFILE%" (
  call :append_missing "%TARGET%" "%LISTFILE%"
  goto :eof
)
for /f "usebackq tokens=* delims=" %%L in ("%LISTFILE%") do (
  set "LINE=%%L"
  if not "!LINE!"=="" (
    if not "!LINE:~0,1!"=="#" (
      call :consume_input "%TARGET%" "!LINE!"
    )
  )
)
goto :eof

:append_directory
set "TARGET=%~1"
set "DIR=%~2"
if "%RECURSE%"=="1" (
  for /r "%DIR%" %%F in (*) do call :append_path "%TARGET%" "%%~fF"
) else (
  for %%F in ("%DIR%\*") do if not exist "%%~fF\*" call :append_path "%TARGET%" "%%~fF"
)
goto :eof

:append_path
set "TARGET=%~1"
set "P=%~2"
if not exist "%P%" (
  call :append_missing "%TARGET%" "%P%"
  goto :eof
)
if exist "%P%\*" goto :eof
if /I "%MODE%"=="SMART" call :is_probably_binary "%P%"
if /I "%MODE%"=="SMART" if "!BINARY!"=="1" (
  >> "%TARGET%" echo ============================================================
  >> "%TARGET%" echo SKIPPED_BINARY: %P%
  for %%A in ("%P%") do >> "%TARGET%" echo SIZE_BYTES: %%~zA
  >> "%TARGET%" echo ============================================================
  >> "%TARGET%" echo.
  goto :eof
)
>> "%TARGET%" echo ============================================================
>> "%TARGET%" echo FILE: %P%
if "%INCLUDE_META%"=="1" (
  for %%A in ("%P%") do (
    >> "%TARGET%" echo SIZE_BYTES: %%~zA
    >> "%TARGET%" echo MODIFIED: %%~tA
  )
)
>> "%TARGET%" echo ============================================================
>> "%TARGET%" echo.
type "%P%" >> "%TARGET%" 2>nul
>> "%TARGET%" echo.
>> "%TARGET%" echo.
goto :eof

:append_missing
set "TARGET=%~1"
set "P=%~2"
>> "%TARGET%" echo ============================================================
>> "%TARGET%" echo MISSING: %P%
>> "%TARGET%" echo ============================================================
>> "%TARGET%" echo.
goto :eof

:is_probably_binary
set "BINARY=0"
set "EXT=%~x1"
for %%E in (.png .jpg .jpeg .gif .webp .bmp .ico .pdf .zip .7z .rar .gz .parquet .db .sqlite .dll .exe .pkl .feather .arrow .bin .mp3 .mp4 .wav .avi .mov .pptx .xlsx .docx) do (
  if /I "%%E"=="%EXT%" set "BINARY=1"
)
goto :eof

:write_header
set "TARGET=%~1"
set "OUTFILE=%~2"
>> "%TARGET%" echo REVIEW BUNDLE
>> "%TARGET%" echo GENERATED_AT_LOCAL: %DATE% %TIME%
>> "%TARGET%" echo ROOT: %ROOT%
>> "%TARGET%" echo OUTPUT: %OUTFILE%
>> "%TARGET%" echo MODE: %MODE%
>> "%TARGET%" echo RECURSE: %RECURSE%
>> "%TARGET%" echo INCLUDE_META: %INCLUDE_META%
>> "%TARGET%" echo.
goto :eof

:finish
if "%PAUSE_AT_END%"=="1" pause
exit /b 0

:help
echo.
echo make_review_bundle_pro.bat - universal review bundler for text artifacts

echo Double-click behavior:
echo   - looks for bundle_list.txt next to the script, then in current directory
echo   - writes review_bundle.txt next to the script or in current directory path used

echo Usage:
echo   make_review_bundle_pro.bat
echo   make_review_bundle_pro.bat --default
echo   make_review_bundle_pro.bat --from-file bundle_list.txt
echo   make_review_bundle_pro.bat --out review_bundle.txt --from-file bundle_list.txt
echo   make_review_bundle_pro.bat --out bundle.txt file1 file2 file3
echo   make_review_bundle_pro.bat --out bundle.txt artifacts\baselinesuite\reports\*.md

echo Features:
echo   - drag and drop files onto the bat
echo   - default input list: bundle_list.txt
echo   - default output file: review_bundle.txt
echo   - supports files, folders, and globs

echo Flags:
echo   --from-file PATH   read targets from a list file
   echo   --out PATH         output bundle path
   echo   --recurse          recurse into directories
   echo   --no-meta          omit size and modified metadata
   echo   --glob-off         disable wildcard expansion
   echo   --no-pause         do not pause at end
   echo   --default          use default bundle_list.txt

echo List file format:
echo   - one target per line
   echo   - blank lines allowed
   echo   - lines starting with # ignored
   echo   - each target can be a file, folder, or wildcard pattern
exit /b 0
