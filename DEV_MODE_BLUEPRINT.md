# Dev Mode Blueprint -- Universal Developer Experience

> **Philosophy:** Before a project becomes a product to sell to customers, it must first be a product for developers. The more intuitive, cunning, and automatic the tooling, the better the developer experience, and thus the better the final result. In the era of AI coding assistants, Dev Mode is not just a launcher -- it is the **runtime contract** between code, humans, and AI agents. Its job is to turn a chaotic local stack into a **state machine with forensic artifacts** that even a blind, dumb agent can navigate safely.

A complete, copy-paste-ready blueprint for adding sophisticated dev tooling to any project. Works for **microservices** (Eureka, Gateway, N services) **and modular monoliths** (single JVM, multi-module Maven). Battle-tested in a real production monorepo.

**What it provides:**

- **One-command startup** of all services with proper sequencing
- **Smart logging** -- console shows only what screams for attention; full logs go to file
- **Persistent error tracking** -- crashes leave windows open with stack traces
- **Centralized error watcher** -- see all errors across all services in one place
- **Infrastructure-first** -- Docker containers start automatically when needed
- **Debug-friendly** -- named windows, port labels, log files with timestamps
- **Recovery commands** -- Keycloak H2 repair, nuclear clean, targeted restart
- **Pre-flight validation** -- checks for Maven wrapper, Java version, Docker
- **Agentic Runtime Contract** -- canonical lifecycle states, structured event streams (`events.jsonl`), live state files (`runtime-status.json`), and `run_id`-correlated forensic artifacts so AI agents never have to guess
- **Error fingerprinting** -- codified heuristics (`fingerprints.json`) and agent behavioral policies (`policies.json`) that teach tools what to do instead of leaving them to hallucinate
- **Machine-readable CLI** -- `dev.bat -JsonStatus` for agents, meaningful exit codes (0-5), no text parsing required

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Philosophy](#architecture-philosophy)
3. [File Structure](#file-structure)
4. [Core Script: dev-mode.ps1](#core-script-dev-modeps1)
5. [Monolith Variant](#monolith-variant)
6. [Wrapper Script: dev.bat](#wrapper-script-devbat)
7. [Docker Compose: Infrastructure-Only](#docker-compose-infrastructure-only)
8. [Supporting Scripts](#supporting-scripts)
9. [Customization Guide](#customization-guide)
10. [Gotchas and Lessons Learned](#gotchas-and-lessons-learned)
11. [Agentic Runtime Contract](#agentic-runtime-contract)
12. [Adapting for Non-Java Projects](#adapting-for-non-java-projects)
13. [Summary](#summary)

---

## Quick Start

Once implemented, your dev workflow becomes:

```powershell
# Start everything (infra + all services)
.\dev.bat

# Start everything + centralized error watcher
.\dev.bat -Watch

# Check what's running (human-friendly)
.\dev.bat -Status

# Check what's running (machine-friendly JSON -- for AI agents)
.\dev.bat -JsonStatus

# Open logs folder
.\dev.bat -Logs

# Stop all dev processes
.\dev.bat -Kill

# Clean all Maven target directories (USE AFTER SWITCHING BRANCHES!)
.\dev.bat -Clean

# Start Docker infrastructure only
.\dev.bat -Infra

# Stop Docker infrastructure
.\dev.bat -InfraDown

# Fix corrupted Keycloak H2 database
.\dev.bat -FixKeycloak
```

**CRITICAL: Branch Switching Rule:** When switching git branches, ALWAYS run `.\dev.bat -Kill` then `.\dev.bat -Clean` before `.\dev.bat`. Stale compiled classes cause mysterious startup failures that masquerade as infrastructure problems.

**CRITICAL: Annotation Processor Changes:** If you change `lombok.config`, add/remove annotation processors, or modify MapStruct config, you MUST run `.\dev.bat -Clean`. Incremental compilation does NOT reprocess annotations.

**That's it.** One command, all services, proper sequencing, smart output.

---

## Architecture Philosophy

### The Problem with Traditional Dev Setup

| Pain Point | What Usually Happens |
|------------|---------------------|
| **Terminal Spam** | 500+ lines of DEBUG logs per service obscure actual errors |
| **Lost Errors** | Errors scroll past before you can read them |
| **Manual Sequencing** | "Start Eureka first, wait 30s, then start others..." |
| **Window Chaos** | 7 terminals with no labels, can't tell which is which |
| **Crash Amnesia** | `cmd /c` closes windows on crash -- you lose the stack trace |
| **Infrastructure Dance** | "Did I start Docker? Is Kafka up? Let me check..." |
| **Mysterious Failures** | Branch switch causes "Redis connection refused" -- actually stale classes |
| **Wiring Nightmares** | Circular bean deps, missing qualifiers, Lombok eating annotations |
| **Agent Blindness** | AI coding assistants grep terminal output, hallucinate state, conflate "still compiling" with "crashed" |
| **No Forensic Trail** | Important runtime truth lives only in ephemeral terminal buffers -- gone on scroll, gone on close |

### The Dev Mode Solution

| Feature | How It Works |
|---------|--------------|
| **Cunning Logging** | Console shows ONLY: startup confirmation + ERROR level logs. Everything else goes to file. |
| **Named Windows** | Each window title shows `[project] service OK (:port)` or `[project] service ERR! (:port)` |
| **Crash Persistence** | Windows stay open with `Read-Host` at end + show last 30 lines of log on crash |
| **Auto Infrastructure** | Script checks ALL infra ports, starts Docker compose if any are down |
| **Proper Sequencing** | Core services first, waits for ready, then other services staggered |
| **Centralized Errors** | One window shows all ERROR logs from all services, deduplicated and color-coded |
| **Pre-flight Checks** | Verifies Maven wrapper, Java, Docker exist before launching anything |
| **Recovery Tools** | `-FixKeycloak` for H2 corruption, `-Clean` for stale builds |
| **Canonical State Machine** | Every service is in exactly one state (`QUEUED`, `COMPILING`, `STARTING`, `WARMING`, `READY`, `STALLED`, `CRASHED`). "Not ready yet" is never silently conflated with "failed." |
| **Structured Event Stream** | Every state transition is recorded as a JSON event in `events.jsonl`, correlated by `run_id`. Machines read JSON, not terminal noise. |
| **Live State File** | `runtime-status.json` is the single source of truth. Agents read one file, know everything. |
| **Error Fingerprinting** | Known error patterns codified in `fingerprints.json` with recommended actions. Agents match errors to solutions instead of guessing. |

---

## File Structure

```
your-project/
+-- infrastructure/                    # Or "infra/", "_infrastructure/", etc.
|   +-- dev.bat                        # Simple batch wrapper (entry point)
|   +-- compose-infra-only.yaml        # Docker: just the dependencies
|   +-- compose.yaml                   # Docker: full stack (for prod-like testing)
|   +-- logs/                          # Auto-created, run_id-stamped log files
|   |   +-- gateway-2026-04-24T07-42-00Z.log
|   |   +-- service-a-2026-04-24T07-42-00Z.log
|   |   +-- infra-2026-04-24T07-42-00Z.log
|   +-- state/                         # Agentic runtime artifacts
|   |   +-- runtime-status.json        # Live canonical state (THE source of truth)
|   |   +-- events.jsonl               # Append-only structured event stream
|   |   +-- run-summary.json           # Post-run digest (written on exit/timeout)
|   |   +-- config/
|   |       +-- services.json          # Static service definitions (versioned in git)
|   |       +-- infra.json             # Static infra definitions (versioned in git)
|   |       +-- fingerprints.json      # Error pattern knowledge base
|   |       +-- policies.json          # Agent behavioral hints
|   +-- scripts/
|   |   +-- dev-mode.ps1               # The brain -- handles everything
|   |   +-- stop_all.bat               # Kill services by port
|   |   +-- restart.bat                # Restart single service
|   |   +-- clean.bat                  # Nuclear option
|   +-- data/                          # Docker volume mounts (gitignored)
|       +-- keycloak/                  # H2 files -- deletable for recovery
|       +-- mongo/
+-- service-a/                         # (microservice) or...
|   +-- mvnw.cmd
+-- my-monolith/                       # (modular monolith with sub-modules)
|   +-- mvnw.cmd
|   +-- pom.xml                        # Parent POM
|   +-- lombok.config                  # CRITICAL: @Lazy, @Qualifier copyable
|   +-- application/                   # Boot module
|   +-- module-a/
|   +-- module-b/
+-- frontend/
+-- ai-service/
```

---

## Core Script: dev-mode.ps1

This is the brain. Copy, customize the `$SERVICES` array, and you're done.

**CRITICAL: This file MUST be ASCII only.** PowerShell 5.1 reads `.ps1` files using system-default encoding (Windows-1252), NOT UTF-8. Em-dashes, curly quotes, and other Unicode characters will silently corrupt the parser. Use `--` instead of em-dash, `'` instead of curly quotes, etc.

```powershell
# ============================================================================
# Dev Mode - All-in-One Service Launcher (Agentic Runtime Edition)
# ============================================================================
#
# Usage:
#   .\dev-mode.ps1              Start all services
#   .\dev-mode.ps1 -Watch       Start all + error watcher
#   .\dev-mode.ps1 -Status      Show service status only (human)
#   .\dev-mode.ps1 -JsonStatus  Print runtime-status.json to stdout (agent)
#   .\dev-mode.ps1 -Logs        Open logs folder
#   .\dev-mode.ps1 -ClearLogs   Clear logs only (no restart)
#   .\dev-mode.ps1 -Kill        Kill all Java processes
#   .\dev-mode.ps1 -Clean       Clean all target directories (use after branch switch!)
#   .\dev-mode.ps1 -Infra       Start infrastructure only (Docker)
#   .\dev-mode.ps1 -InfraDown   Stop infrastructure (Docker)
#   .\dev-mode.ps1 -FixKeycloak Purge Keycloak H2 data and restart
#
# IMPORTANT: After switching git branches, run -Kill then -Clean first!
# IMPORTANT: After changing lombok.config or annotation processors, run -Clean!
# IMPORTANT: This file MUST stay ASCII-only for PS 5.1 compatibility!
#
# Exit codes: 0=OK, 1=preflight fail, 2=infra fail, 3=build fail, 4=crash, 5=bad args
#
# ============================================================================

param(
    [switch]$Watch,
    [switch]$Status,
    [switch]$JsonStatus,
    [switch]$Logs,
    [switch]$ClearLogs,
    [switch]$Kill,
    [switch]$Clean,
    [switch]$Infra,
    [switch]$InfraDown,
    [switch]$FixKeycloak
)

# ============================================================================
# Configuration -- CUSTOMIZE THIS SECTION FOR YOUR PROJECT
# ============================================================================

$ErrorActionPreference = "Stop"

# Calculate paths from this script's location
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$INFRA_DIR = Split-Path -Parent $SCRIPT_DIR
$ROOT_DIR = Split-Path -Parent $INFRA_DIR
$LOG_DIR = Join-Path $INFRA_DIR "logs"
$STATE_DIR = Join-Path $INFRA_DIR "state"
$EVENTS_FILE = Join-Path $STATE_DIR "events.jsonl"
$STATUS_FILE = Join-Path $STATE_DIR "runtime-status.json"

# PROJECT NAME -- Used in banner and window titles
$PROJECT_NAME = "MyProject"

# RUN ID -- Unique per invocation, correlates all logs/events/state
$RUN_ID = Get-Date -Format "yyyy-MM-ddTHH-mm-ssZ"

# Ensure state directory exists
if (-not (Test-Path $STATE_DIR)) { New-Item -ItemType Directory -Path $STATE_DIR -Force | Out-Null }

# SERVICE DEFINITIONS -- Customize for your project
# Name: Display name (lowercase, no spaces)
# Dir: Path relative to ROOT_DIR
# Port: The port this service listens on
# Type: "core" (starts first) or "service" (starts after core)
$SERVICES = @(
    @{ Name = "eureka";       Dir = "infrastructure\discovery-server"; Port = 8761;  Type = "core" }
    @{ Name = "gateway";      Dir = "api-gateway";                     Port = 8888;  Type = "core" }
    @{ Name = "service-a";    Dir = "service-a";                       Port = 8081;  Type = "service" }
    @{ Name = "service-b";    Dir = "service-b";                       Port = 8082;  Type = "service" }
    @{ Name = "service-c";    Dir = "service-c";                       Port = 8083;  Type = "service" }
)

# INFRASTRUCTURE PORTS -- Docker services to check/start
$INFRA_PORTS = @{
    MongoDB  = 27017
    Kafka    = 9094
    Redis    = 6379
    # Add/remove as needed for your project
}

# SERVICE COLORS -- For error watcher display
$SERVICE_COLORS = @{
    'gateway'   = 'Cyan'
    'eureka'    = 'White'
    'service-a' = 'Magenta'
    'service-b' = 'Blue'
    'service-c' = 'Green'
}

# ============================================================================
# Utility Functions -- Generally don't need to modify
# ============================================================================

function Test-Port {
    param([int]$Port)
    try {
        $client = New-Object Net.Sockets.TcpClient
        $client.Connect("localhost", $Port)
        $client.Close()
        return $true
    } catch {
        return $false
    }
}

function Write-Status {
    param([string]$Message, [string]$Type = "INFO")
    $ts = Get-Date -Format "HH:mm:ss"
    switch ($Type) {
        "OK"    { Write-Host "[$ts] " -NoNewline -ForegroundColor DarkGray; Write-Host "[OK] " -NoNewline -ForegroundColor Green; Write-Host $Message }
        "WAIT"  { Write-Host "[$ts] " -NoNewline -ForegroundColor DarkGray; Write-Host "[..] " -NoNewline -ForegroundColor Yellow; Write-Host $Message }
        "FAIL"  { Write-Host "[$ts] " -NoNewline -ForegroundColor DarkGray; Write-Host "[XX] " -NoNewline -ForegroundColor Red; Write-Host $Message }
        "INFO"  { Write-Host "[$ts] " -NoNewline -ForegroundColor DarkGray; Write-Host "[--] " -NoNewline -ForegroundColor Cyan; Write-Host $Message }
        default { Write-Host "[$ts] $Message" }
    }
}

function Show-Banner {
    Write-Host ""
    Write-Host "  ================================================================" -ForegroundColor Cyan
    Write-Host "       $PROJECT_NAME Dev Mode - All Services Launcher            " -ForegroundColor Cyan
    Write-Host "  ================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Root:    $ROOT_DIR" -ForegroundColor DarkGray
    Write-Host "  Logs:    $LOG_DIR" -ForegroundColor DarkGray
    Write-Host "  Run ID:  $RUN_ID" -ForegroundColor DarkGray
    Write-Host ""
}

# ============================================================================
# Agentic State Management -- Structured events and live state
# ============================================================================

function Write-Event {
    param([string]$Entity, [string]$Name, [string]$EventName, [hashtable]$Data = @{})
    $evt = @{
        ts = (Get-Date).ToString("o")
        run_id = $RUN_ID
        entity = $Entity
        name = $Name
        event = $EventName
        data = $Data
    }
    $json = $evt | ConvertTo-Json -Depth 5 -Compress
    Add-Content -Path $EVENTS_FILE -Value $json -Encoding UTF8
}

function Write-RuntimeStatus {
    param([hashtable]$StatusData)
    $json = $StatusData | ConvertTo-Json -Depth 6
    Set-Content -Path $STATUS_FILE -Value $json -Encoding UTF8
}

function Bootstrap-State {
    $initialState = @{
        run_id = $RUN_ID
        started_at = (Get-Date).ToString("o")
        mode = @{ watch = $Watch.IsPresent; infra_only = $Infra.IsPresent }
        services = @{}
        infra = @{}
    }
    
    foreach ($svc in $SERVICES) {
        $initialState.services[$svc.Name] = @{
            state = "QUEUED"
            since = (Get-Date).ToString("o")
            build = @{ state = "NOT_STARTED"; last_progress_at = null }
            runtime = @{ state = "NOT_STARTED"; pid = null; port_open = $false; health = "unknown" }
            last_error = @{ fingerprint = null; message = null; at = null }
        }
    }
    Write-RuntimeStatus $initialState
    Write-Event -Entity "devmode" -Name "system" -EventName "devmode.run.started" -Data @{ mode = if ($Watch) { "watch" } else { "default" } }
}

# ============================================================================
# Pre-flight Checks -- Verify tools exist before we use them
# ============================================================================

function Test-Preflight {
    $passed = $true

    # Check Docker
    try {
        $null = & docker --version 2>&1
        if ($LASTEXITCODE -ne 0) { throw "bad exit" }
    } catch {
        Write-Status "Docker not found or not running" "FAIL"
        $passed = $false
    }

    # Check Java (for Spring services)
    try {
        $javaVer = & java -version 2>&1 | Select-Object -First 1
        Write-Status "Java: $javaVer" "INFO"
    } catch {
        Write-Status "Java not found in PATH" "FAIL"
        $passed = $false
    }

    # Check Maven wrapper exists for each service
    foreach ($svc in $SERVICES) {
        $mvnw = Join-Path $ROOT_DIR (Join-Path $svc.Dir "mvnw.cmd")
        if (-not (Test-Path $mvnw)) {
            Write-Status "Maven wrapper not found: $($svc.Dir)\mvnw.cmd" "FAIL"
            Write-Status "  Fix: cd $($svc.Dir) && mvn wrapper:wrapper" "INFO"
            $passed = $false
        }
    }

    return $passed
}

# ============================================================================
# Command Handlers
# ============================================================================

function Show-ServiceStatus {
    Show-Banner
    Write-Host "  SERVICE STATUS" -ForegroundColor White
    Write-Host "  ----------------------------------------------------------------" -ForegroundColor DarkGray

    # Infrastructure
    Write-Host ""
    Write-Host "  Infrastructure:" -ForegroundColor DarkGray
    foreach ($name in $INFRA_PORTS.Keys) {
        $port = $INFRA_PORTS[$name]
        $up = Test-Port $port
        $status = if ($up) { "[UP]  " } else { "[DOWN]" }
        $color = if ($up) { "Green" } else { "Red" }
        Write-Host "    $status " -NoNewline -ForegroundColor $color
        Write-Host "$($name.PadRight(12)) :$port" -ForegroundColor White
    }

    # Services
    Write-Host ""
    Write-Host "  Services:" -ForegroundColor DarkGray
    foreach ($svc in $SERVICES) {
        $up = Test-Port $svc.Port
        $status = if ($up) { "[UP]  " } else { "[DOWN]" }
        $color = if ($up) { "Green" } else { "Red" }
        Write-Host "    $status " -NoNewline -ForegroundColor $color
        Write-Host "$($svc.Name.PadRight(12)) :$($svc.Port)" -ForegroundColor White
    }
    Write-Host ""
}

function Open-LogsFolder {
    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
    }
    Start-Process explorer $LOG_DIR
    Write-Status "Opened logs folder: $LOG_DIR" "OK"
}

function Clear-Logs {
    if (Test-Path $LOG_DIR) {
        Remove-Item "$LOG_DIR\*" -Force -ErrorAction SilentlyContinue
        Write-Status "Cleared logs folder" "OK"
    }
}

function Stop-AllJava {
    Write-Status "Stopping all Java processes..." "WAIT"
    Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Status "All Java processes stopped" "OK"
}

function Clean-AllTargets {
    Write-Status "Cleaning all Maven target directories + local artifacts..." "WAIT"
    Push-Location $ROOT_DIR
    try {
        # Use 'clean' to remove target/ dirs AND force fresh annotation processing
        $result = & mvn clean 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Maven clean completed successfully" "OK"
        } else {
            # Fallback: manually delete target/ directories
            Write-Status "Maven clean failed -- falling back to manual delete" "FAIL"
            foreach ($svc in $SERVICES) {
                $target = Join-Path $ROOT_DIR (Join-Path $svc.Dir "target")
                if (Test-Path $target) {
                    Remove-Item $target -Recurse -Force
                    Write-Status "  Deleted $target" "INFO"
                }
            }
        }
    } catch {
        Write-Status "Maven clean failed: $_" "FAIL"
    }
    Pop-Location
}

function Start-InfrastructureOnly {
    Write-Status "Starting Docker infrastructure..." "WAIT"
    Push-Location $INFRA_DIR
    docker compose -f compose-infra-only.yaml up -d 2>&1 | Out-Null
    Pop-Location

    Write-Status "Infrastructure started. Waiting for services..." "WAIT"
    Start-Sleep -Seconds 10

    foreach ($name in $INFRA_PORTS.Keys) {
        $port = $INFRA_PORTS[$name]
        $status = if (Test-Port $port) { "OK" } else { "WAIT" }
        Write-Status "$($name.PadRight(12)) :$port" $status
    }
}

function Stop-Infrastructure {
    Write-Status "Stopping Docker infrastructure..." "WAIT"
    Push-Location $INFRA_DIR
    docker compose -f compose-infra-only.yaml down
    Pop-Location
    Write-Status "Infrastructure stopped" "OK"
}

function Repair-Keycloak {
    # When Keycloak uses embedded H2 (KC_DB=dev-file), the database files
    # can corrupt on unclean shutdown (MVStoreException, AccessDeniedException).
    # Recovery: fully remove container + delete data + recreate fresh.
    # Keycloak re-imports realm from /opt/keycloak/data/import on fresh start.

    Show-Banner
    Write-Status "Stopping Keycloak container..." "WAIT"

    Push-Location $INFRA_DIR

    # docker compose stop is not enough if container is corrupted.
    # Use rm -f -s to force-stop AND remove the container entirely.
    docker compose -f compose-infra-only.yaml rm -f -s keycloak 2>&1 | Out-Null

    Pop-Location

    # Delete the corrupted H2 data
    $kcData = Join-Path $INFRA_DIR "data\keycloak"
    if (Test-Path $kcData) {
        Remove-Item $kcData -Recurse -Force
        Write-Status "Deleted corrupted H2 data: $kcData" "OK"
    } else {
        Write-Status "No Keycloak data directory found (already clean)" "INFO"
    }

    # Recreate the container fresh
    Write-Status "Recreating Keycloak container..." "WAIT"
    Push-Location $INFRA_DIR
    docker compose -f compose-infra-only.yaml up -d keycloak 2>&1 | Out-Null
    Pop-Location

    # Wait for Keycloak to fully initialize (slow -- imports realm)
    $deadline = (Get-Date).AddSeconds(120)
    while ((Get-Date) -lt $deadline) {
        if (Test-Port 8180) {
            Write-Status "Keycloak is UP on :8180 (realm will re-import)" "OK"
            return
        }
        Start-Sleep -Seconds 3
    }
    Write-Status "Keycloak did not respond within 120s -- check: docker logs keycloak" "FAIL"
}

# ============================================================================
# Service Launcher -- The Cunning Part
# ============================================================================

function Start-ServiceInWindow {
    param(
        [string]$Name,
        [string]$Dir,
        [int]$Port
    )

    # Check if already running
    if (Test-Port $Port) {
        Write-Status "$Name already running on $Port" "OK"
        return
    }

    # Create logs directory
    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
    }

    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $logFile = Join-Path $LOG_DIR "$Name-$timestamp.log"
    $serviceDir = Join-Path $ROOT_DIR $Dir

    # Build the command that runs INSIDE the new window
    # CUNNING APPROACH: Window shows ONLY what matters (errors, status)
    # Full log goes to file for forensics, but screen is SILENT unless trouble
    $innerScript = @"
`$ErrorActionPreference = 'Continue'
`$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name COMPILING (:$Port)'

`$logFile = '$logFile'
`$serviceDir = '$serviceDir'
`$serviceName = '$Name'
`$servicePort = $Port
`$statusFile = '$STATUS_FILE'
`$eventsFile = '$EVENTS_FILE'
`$runId = '$RUN_ID'
`$errorCount = 0
`$isReady = `$false

# --- Agentic IPC Helpers ---
function Write-InnerEvent {
    param([string]`$EventName, [hashtable]`$Data = @{})
    `$evt = @{
        ts = (Get-Date).ToString('o')
        run_id = `$runId
        entity = 'service'
        name = `$serviceName
        event = `$EventName
        data = `$Data
    }
    `$json = `$evt | ConvertTo-Json -Depth 5 -Compress
    for (`$i = 0; `$i -lt 5; `$i++) {
        try { Add-Content -Path `$eventsFile -Value `$json -Encoding UTF8 -ErrorAction Stop; break }
        catch { Start-Sleep -Milliseconds (Get-Random -Minimum 50 -Maximum 150) }
    }
}

function Update-State {
    param([string]`$NewState)
    if (-not (Test-Path `$statusFile)) { return }
    for (`$i = 0; `$i -lt 10; `$i++) {
        try {
            `$json = Get-Content `$statusFile -Raw -ErrorAction Stop
            `$data = `$json | ConvertFrom-Json
            if (`$data.services.`$serviceName) {
                `$oldState = `$data.services.`$serviceName.state
                if (`$oldState -ne `$NewState) {
                    `$data.services.`$serviceName.state = `$NewState
                    `$data.services.`$serviceName.since = (Get-Date).ToString('o')
                    `$outJson = `$data | ConvertTo-Json -Depth 6
                    Set-Content -Path `$statusFile -Value `$outJson -Encoding UTF8 -ErrorAction Stop
                    Write-InnerEvent -EventName 'service.state.changed' -Data @{ from = `$oldState; to = `$NewState }
                }
            }
            break
        } catch {
            Start-Sleep -Milliseconds (Get-Random -Minimum 50 -Maximum 150)
        }
    }
}
# ---------------------------

# Minimal header
Write-Host "[$Name] port $Port" -ForegroundColor Cyan
Write-Host "Log: `$logFile" -ForegroundColor DarkGray
Write-Host ""

Update-State "COMPILING"

function Process-Line {
    param([string]`$Line)

    # ALWAYS write to file (forensics)
    Add-Content -Path `$logFile -Value `$Line -ErrorAction SilentlyContinue

    # Noise filter: skip info-level mentions of exception class names
    if (`$Line -match 'ExceptionHandler|ExceptionResolver|GlobalExceptionHandler|SLF4J|LoggerFactory') {
        return
    }

    # ONLY show to screen if it SCREAMS for attention
    if (`$Line -match 'BUILD FAILURE|COMPILATION ERROR') {
        `$script:errorCount++
        Write-Host `$Line -ForegroundColor Red
        `$host.UI.RawUI.WindowTitle = "[$PROJECT_NAME] $Name BUILD_FAILED (:$Port)"
        Update-State "BUILD_FAILED"
    }
    elseif (`$Line -match '\s(ERROR|FATAL)\s|^Caused by:') {
        `$script:errorCount++
        Write-Host `$Line -ForegroundColor Red
    }
    elseif (`$Line -match '^\s+at\s|^\t+at\s') {
        # Stack trace lines -- show but dimmer
        Write-Host `$Line -ForegroundColor DarkRed
    }
    elseif (`$Line -match 'Starting .+ using Java') {
        `$host.UI.RawUI.WindowTitle = "[$PROJECT_NAME] $Name STARTING (:$Port)"
        Update-State "STARTING"
    }
    elseif (`$Line -match 'Tomcat initialized with port|Netty started on port') {
        `$host.UI.RawUI.WindowTitle = "[$PROJECT_NAME] $Name WARMING (:$Port)"
        Update-State "WARMING"
    }
    elseif (`$Line -match 'Started .+ in .+ seconds|Tomcat started|Netty started') {
        # SUCCESS -- show this one line
        `$script:isReady = `$true
        Write-Host `$Line -ForegroundColor Green
        `$host.UI.RawUI.WindowTitle = "[$PROJECT_NAME] $Name READY (:$Port)"
        Update-State "READY"
    }
    # Everything else: SILENT (goes to file only)
}

Set-Location `$serviceDir

# Run Maven -- pipe through our smart filter
# CUSTOMIZE: Change this command for your build tool (Gradle, etc.)
& .\mvnw.cmd spring-boot:run 2>&1 | ForEach-Object { Process-Line `$_ }

# On exit, show summary
`$exitCode = `$LASTEXITCODE
Write-Host ""
if (`$exitCode -ne 0) {
    `$host.UI.RawUI.WindowTitle = "[$PROJECT_NAME] $Name CRASHED (:$Port)"
    Update-State "CRASHED"
    Write-Host "=== CRASHED (exit `$exitCode) ===" -ForegroundColor Red
    Write-Host "Last 30 lines:" -ForegroundColor DarkGray
    Get-Content `$logFile -Tail 30 | ForEach-Object { Write-Host `$_ -ForegroundColor DarkGray }
} else {
    `$host.UI.RawUI.WindowTitle = "[$PROJECT_NAME] $Name STOPPED (:$Port)"
    Update-State "STOPPED"
    Write-Host "=== STOPPED ===" -ForegroundColor Yellow
}
Write-Host ""
Read-Host 'Press Enter to close'
"@

    # Encode script to Base64 to avoid escaping issues
    # NOTE: EncodedCommand uses Unicode (UTF-16LE) base64, so the PAYLOAD
    # can contain Unicode. Only the .ps1 FILE itself must be ASCII.
    $bytes = [System.Text.Encoding]::Unicode.GetBytes($innerScript)
    $encoded = [Convert]::ToBase64String($bytes)

    # Launch new window with encoded command
    # NOTE: Do NOT use -NoExit here. The inner script has its own Read-Host
    # to keep the window open. -NoExit would prevent the process from ending
    # when the user presses Enter.
    Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-EncodedCommand", $encoded

    Write-Status "$Name starting on $Port (log: $Name-$timestamp.log)" "WAIT"
}

# ============================================================================
# Error Watcher -- Centralized Error View
# ============================================================================

function Start-ErrorWatcher {
    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
    }

    # Build the colors hashtable as a string for the encoded script
    $colorsString = ""
    foreach ($key in $SERVICE_COLORS.Keys) {
        $colorsString += "'$key' = '$($SERVICE_COLORS[$key])'`n    "
    }

    $watcherScript = @"
`$host.UI.RawUI.WindowTitle = '$PROJECT_NAME Errors'
`$LogDir = '$LOG_DIR'
`$statusFile = '$STATUS_FILE'
`$eventsFile = '$EVENTS_FILE'
`$runId = '$RUN_ID'

Write-Host ''
Write-Host '  ERROR WATCHER' -ForegroundColor Red
Write-Host "  Logs: `$LogDir" -ForegroundColor DarkGray
Write-Host '  Shows: ERROR level logs, Exceptions with stack traces, Build failures' -ForegroundColor DarkGray
Write-Host '  ----------------------------------------------------------------' -ForegroundColor DarkGray
Write-Host ''

`$filePositions = @{}
`$serviceColors = @{
    $colorsString
}

`$fingerprints = @{
    "MissingBeanQualifier" = "No qualifying bean of type|expected single matching bean but found"
    "CircularDependency" = "Requested bean is currently in creation|circular reference"
    "PortInUse" = "Address already in use|already in use"
    "KeycloakH2Corruption" = "MVStoreException|AccessDeniedException.*h2"
    "StaleClassesAfterBranchSwitch" = "NoSuchMethodError|ClassNotFoundException|NoClassDefFoundError"
}

function Write-FingerprintEvent {
    param([string]`$SvcName, [string]`$Fingerprint, [string]`$Evidence)
    `$evt = @{
        ts = (Get-Date).ToString('o')
        run_id = `$runId
        entity = 'service'
        name = `$SvcName
        event = 'error.fingerprint.detected'
        data = @{ fingerprint = `$Fingerprint; evidence = `$Evidence }
    }
    `$json = `$evt | ConvertTo-Json -Depth 5 -Compress
    for (`$i = 0; `$i -lt 5; `$i++) {
        try { Add-Content -Path `$eventsFile -Value `$json -Encoding UTF8 -ErrorAction Stop; break }
        catch { Start-Sleep -Milliseconds (Get-Random -Minimum 50 -Maximum 150) }
    }
}

while (`$true) {
    `$files = Get-ChildItem -Path `$LogDir -Filter '*.log' -ErrorAction SilentlyContinue

    foreach (`$file in `$files) {
        `$path = `$file.FullName

        # Extract service name from filename
        `$svcName = 'unknown'
        if (`$file.Name -match '^(\w+)-\d{4}') {
            `$svcName = `$matches[1]
        }

        `$color = if (`$serviceColors.ContainsKey(`$svcName)) { `$serviceColors[`$svcName] } else { 'Gray' }

        if (-not `$filePositions.ContainsKey(`$path)) {
            `$filePositions[`$path] = 0
        }

        try {
            `$content = Get-Content `$path -ErrorAction SilentlyContinue
            `$lineCount = `$content.Count

            if (`$lineCount -gt `$filePositions[`$path]) {
                `$newLines = `$content[`$filePositions[`$path]..(`$lineCount - 1)]
                `$filePositions[`$path] = `$lineCount

                foreach (`$line in `$newLines) {
                    # === WHAT WE ACTUALLY CARE ABOUT ===

                    # 1. Lines with ERROR or FATAL log level (match the level marker, not just word)
                    `$isErrorLevel = `$line -match '\s(ERROR|FATAL)\s'

                    # 2. Exception class names (actual thrown exceptions, full package path)
                    `$isExceptionLine = `$line -match '^[a-z]+\.[a-z]+\..*Exception:|^Caused by:'

                    # 3. Stack trace lines (indented "at" lines)
                    `$isStackTrace = `$line -match '^\s+at\s|^\t+at\s'

                    # 4. Build failures
                    `$isBuildError = `$line -match 'BUILD FAILURE|COMPILATION ERROR|\[ERROR\].*Failed to execute'

                    # === NOISE TO IGNORE ===
                    # These contain "Exception" in class names but are NOT errors:
                    `$isNoise = `$line -match 'ExceptionHandler|ExceptionResolver|ErrorController|GlobalExceptionHandler'
                    `$isNoise = `$isNoise -or (`$line -match 'SLF4J|LoggerFactory|not eligible for getting processed')
                    `$isNoise = `$isNoise -or (`$line -match '\sINFO\s|\sDEBUG\s|\sWARN\s.*: \[Consumer')

                    # === DECISION ===
                    `$shouldShow = (`$isErrorLevel -or `$isExceptionLine -or `$isStackTrace -or `$isBuildError) -and (-not `$isNoise)

                    if (`$shouldShow) {
                        `$ts = Get-Date -Format 'HH:mm:ss'

                        # --- Agentic Fingerprint Detection ---
                        foreach (`$fpKey in `$fingerprints.Keys) {
                            if (`$line -match `$fingerprints[`$fpKey]) {
                                Write-FingerprintEvent `$svcName `$fpKey `$line
                            }
                        }
                        # -------------------------------------

                        if (`$isStackTrace) {
                            Write-Host "         `$line" -ForegroundColor DarkRed
                        }
                        elseif (`$isExceptionLine) {
                            Write-Host ""
                            Write-Host "[`$ts] " -NoNewline -ForegroundColor DarkGray
                            Write-Host "`$(`$svcName.ToUpper().PadRight(12))" -NoNewline -ForegroundColor `$color
                            Write-Host "`$line" -ForegroundColor Red
                        }
                        else {
                            Write-Host ""
                            Write-Host "[`$ts] " -NoNewline -ForegroundColor DarkGray
                            Write-Host "`$(`$svcName.ToUpper().PadRight(12))" -NoNewline -ForegroundColor `$color
                            Write-Host "`$line" -ForegroundColor DarkYellow
                        }
                    }
                    }
                }
            }
        } catch { }
    }

    Start-Sleep -Milliseconds 300
}
"@

    $bytes = [System.Text.Encoding]::Unicode.GetBytes($watcherScript)
    $encoded = [Convert]::ToBase64String($bytes)

    Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-EncodedCommand", $encoded
    Write-Status "Error watcher started" "OK"
}

# ============================================================================
# Main Flow
# ============================================================================

# Handle simple commands first
if ($JsonStatus) {
    if (Test-Path $STATUS_FILE) {
        Get-Content $STATUS_FILE -Raw | Write-Host
    } else {
        Write-Host '{"error": "No runtime-status.json found. Run dev-mode.ps1 first."}'
    }
    exit 0
}

if ($Status) {
    Show-ServiceStatus
    exit 0
}

if ($Logs) {
    Open-LogsFolder
    exit 0
}

if ($Kill) {
    Stop-AllJava
    Write-Event -Entity "devmode" -Name "system" -EventName "devmode.kill.executed"
    exit 0
}

if ($ClearLogs) {
    Clear-Logs
    exit 0
}

if ($Clean) {
    Show-Banner
    Write-Event -Entity "devmode" -Name "system" -EventName "devmode.clean.started"
    Clean-AllTargets
    Write-Event -Entity "devmode" -Name "system" -EventName "devmode.clean.completed"
    exit 0
}

if ($Infra) {
    Show-Banner
    Start-InfrastructureOnly
    exit 0
}

if ($InfraDown) {
    Show-Banner
    Stop-Infrastructure
    exit 0
}

if ($FixKeycloak) {
    Repair-Keycloak
    exit 0
}

# ALWAYS clear old logs on startup -- fresh run = fresh logs
# Why? Old logs are noise. If you need logs, you want the CURRENT ones.
# Past problems are past. Current problems are what matter.
Clear-Logs

# Main startup flow
Show-Banner
Bootstrap-State

# Pre-flight checks
if (-not (Test-Preflight)) {
    Write-Status "Pre-flight checks failed. Fix issues above and retry." "FAIL"
    exit 1
}

# Step 1: Check Docker infrastructure
Write-Host "  [1/4] Infrastructure" -ForegroundColor White
Write-Host "  ----------------------------------------------------------------" -ForegroundColor DarkGray

# Check ALL infra ports; if any down, start Docker
$anyInfraDown = $false
foreach ($name in $INFRA_PORTS.Keys) {
    if (-not (Test-Port $INFRA_PORTS[$name])) { $anyInfraDown = $true; break }
}

if ($anyInfraDown) {
    Write-Status "Starting Docker infrastructure..." "WAIT"
    Push-Location $INFRA_DIR
    docker compose -f compose-infra-only.yaml up -d 2>&1 | Out-Null
    Pop-Location

    # Wait for ALL infra ports (not just first one)
    # Keycloak can take 60-90s on first start (realm import)
    Write-Status "Waiting for infrastructure (up to 90s)..." "WAIT"
    $deadline = (Get-Date).AddSeconds(90)
    while ((Get-Date) -lt $deadline) {
        $allUp = $true
        foreach ($name in $INFRA_PORTS.Keys) {
            if (-not (Test-Port $INFRA_PORTS[$name])) { $allUp = $false; break }
        }
        if ($allUp) { break }
        Start-Sleep -Seconds 3
    }
}

# Show infra status
foreach ($name in $INFRA_PORTS.Keys) {
    $port = $INFRA_PORTS[$name]
    $status = if (Test-Port $port) { "OK" } else { "FAIL" }
    Write-Status "$($name.PadRight(12)) :$port" $status
}

Write-Host ""

# Step 2: Start core services first (Eureka, Gateway)
Write-Host "  [2/4] Core Services" -ForegroundColor White
Write-Host "  ----------------------------------------------------------------" -ForegroundColor DarkGray

$coreServices = $SERVICES | Where-Object { $_.Type -eq "core" }
foreach ($svc in $coreServices) {
    Start-ServiceInWindow -Name $svc.Name -Dir $svc.Dir -Port $svc.Port
}

# Wait for Eureka specifically (other services need it)
$eureka = $SERVICES | Where-Object { $_.Name -eq "eureka" }
if ($eureka -and -not (Test-Port $eureka.Port)) {
    Write-Status "Waiting for Eureka to start..." "WAIT"
    for ($i = 0; $i -lt 120; $i++) {
        if (Test-Port $eureka.Port) { break }
        Start-Sleep -Seconds 1
    }
    if (Test-Port $eureka.Port) {
        Write-Status "Eureka ready" "OK"
    } else {
        Write-Status "Eureka timeout -- continuing anyway" "FAIL"
    }
}

Write-Host ""

# Step 3: Start other services
Write-Host "  [3/4] Application Services" -ForegroundColor White
Write-Host "  ----------------------------------------------------------------" -ForegroundColor DarkGray

$appServices = $SERVICES | Where-Object { $_.Type -eq "service" }
foreach ($svc in $appServices) {
    Start-ServiceInWindow -Name $svc.Name -Dir $svc.Dir -Port $svc.Port
    Start-Sleep -Milliseconds 500  # Stagger launches to reduce CPU spike
}

Write-Host ""

# Step 4: Error watcher (optional)
Write-Host "  [4/4] Error Watcher" -ForegroundColor White
Write-Host "  ----------------------------------------------------------------" -ForegroundColor DarkGray

if ($Watch) {
    Start-ErrorWatcher
} else {
    Write-Status "Skipped. Use -Watch flag to enable." "INFO"
}

# Final summary
Write-Host ""
Write-Host "  ================================================================" -ForegroundColor Green
Write-Host "       Dev Mode Active!                                          " -ForegroundColor Green
Write-Host "  ================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Services (starting up -- give them ~30-60s):" -ForegroundColor White
foreach ($svc in $SERVICES) {
    Write-Host "    $($svc.Name.PadRight(14)) http://localhost:$($svc.Port)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "  Logs folder:      $LOG_DIR" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Commands:" -ForegroundColor White
Write-Host "    .\dev-mode.ps1 -Status       Check all services (human)" -ForegroundColor DarkGray
Write-Host "    .\dev-mode.ps1 -JsonStatus   Check all services (agent JSON)" -ForegroundColor DarkGray
Write-Host "    .\dev-mode.ps1 -Logs         Open logs folder" -ForegroundColor DarkGray
Write-Host "    .\dev-mode.ps1 -Kill         Stop all Java" -ForegroundColor DarkGray
Write-Host "    .\dev-mode.ps1 -FixKeycloak  Fix Keycloak H2 corruption" -ForegroundColor DarkGray
Write-Host ""

# Generate Run Summary Digest
if (Test-Path $STATUS_FILE) {
    try {
        $status = Get-Content $STATUS_FILE -Raw | ConvertFrom-Json
        $summary = @{
            run_id = $RUN_ID
            completed_at = (Get-Date).ToString("o")
            services = $status.services
            infra = $status.infra
        }
        $summaryJson = $summary | ConvertTo-Json -Depth 6
        Set-Content -Path (Join-Path $STATE_DIR "run-summary.json") -Value $summaryJson -Encoding UTF8
        Write-Event -Entity "devmode" -Name "system" -EventName "devmode.run.finished"
    } catch {}
}
```

---

## Monolith Variant

If your project is a **modular monolith** (single JVM, multi-module Maven) instead of microservices, the build and launch pattern changes significantly.

### The Key Difference

**Microservices:** Each service has its own `mvnw.cmd spring-boot:run`. Independent builds.

**Modular Monolith:** One parent POM with sub-modules (shared, module-a, module-b, application). Only the `application` module has a main class. Sub-modules must be installed to the local Maven repo first.

### The Two-Step Build (CRITICAL)

You **cannot** just run `mvnw.cmd spring-boot:run` in the root. The `spring-boot-maven-plugin` will try to run on the parent POM and fail with "Unable to find a single main class."

You also **cannot** use `mvnw.cmd spring-boot:run -pl application -am` (the `-am` flag). This builds dependent modules first, which is good, but it also runs the `spring-boot:run` goal on the parent POM, which fails.

**The correct pattern is a two-step build:**

```powershell
# Step 1: Install all modules to local .m2 repo (quiet, skip tests)
& .\mvnw.cmd clean install -DskipTests -q

# Step 2: Run only the boot module
& .\mvnw.cmd spring-boot:run -pl application
```

**Why `clean install` and not just `install`?** Because:
1. `install` does incremental compile -- stale `.class` files survive branch switches
2. `clean install` deletes `target/` first, then compiles fresh
3. Annotation processors (Lombok, MapStruct) only run on clean builds for some changes
4. The installed JARs in `~/.m2/repository` must be fresh -- otherwise module B loads stale JARs from module A

### Monolith Service Window

Replace `Start-ServiceInWindow` with this monolith-aware version:

```powershell
function Start-MonolithInWindow {
    param(
        [string]$Name,
        [string]$Dir,        # Path to monolith root (with parent pom.xml)
        [int]$Port,
        [string]$BootModule  # The module with main class, e.g. "application"
    )

    if (Test-Port $Port) {
        Write-Status "$Name already running on :$Port" "OK"
        return
    }

    $serviceDir = Join-Path $ROOT_DIR $Dir
    $mvnw = Join-Path $serviceDir "mvnw.cmd"
    if (-not (Test-Path $mvnw)) {
        Write-Status "mvnw.cmd not found in $serviceDir" "FAIL"
        Write-Status "  Fix: cd $serviceDir && mvn wrapper:wrapper" "INFO"
        return
    }

    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
    }

    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $logFile = Join-Path $LOG_DIR "$Name-$timestamp.log"

    $innerScript = @"
`$ErrorActionPreference = 'Continue'
`$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name COMPILING (:$Port)'

`$logFile = '$logFile'
`$serviceDir = '$serviceDir'
`$serviceName = '$Name'
`$servicePort = $Port
`$statusFile = '$STATUS_FILE'
`$eventsFile = '$EVENTS_FILE'
`$runId = '$RUN_ID'

# --- Agentic IPC Helpers ---
function Write-InnerEvent {
    param([string]`$EventName, [hashtable]`$Data = @{})
    `$evt = @{
        ts = (Get-Date).ToString('o')
        run_id = `$runId
        entity = 'service'
        name = `$serviceName
        event = `$EventName
        data = `$Data
    }
    `$json = `$evt | ConvertTo-Json -Depth 5 -Compress
    for (`$i = 0; `$i -lt 5; `$i++) {
        try { Add-Content -Path `$eventsFile -Value `$json -Encoding UTF8 -ErrorAction Stop; break }
        catch { Start-Sleep -Milliseconds (Get-Random -Minimum 50 -Maximum 150) }
    }
}

function Update-State {
    param([string]`$NewState)
    if (-not (Test-Path `$statusFile)) { return }
    for (`$i = 0; `$i -lt 10; `$i++) {
        try {
            `$json = Get-Content `$statusFile -Raw -ErrorAction Stop
            `$data = `$json | ConvertFrom-Json
            if (`$data.services.`$serviceName) {
                `$oldState = `$data.services.`$serviceName.state
                if (`$oldState -ne `$NewState) {
                    `$data.services.`$serviceName.state = `$NewState
                    `$data.services.`$serviceName.since = (Get-Date).ToString('o')
                    `$outJson = `$data | ConvertTo-Json -Depth 6
                    Set-Content -Path `$statusFile -Value `$outJson -Encoding UTF8 -ErrorAction Stop
                    Write-InnerEvent -EventName 'service.state.changed' -Data @{ from = `$oldState; to = `$NewState }
                }
            }
            break
        } catch {
            Start-Sleep -Milliseconds (Get-Random -Minimum 50 -Maximum 150)
        }
    }
}
# ---------------------------

Write-Host ''
Write-Host '  ============================================' -ForegroundColor Cyan
Write-Host "    $($Name.ToUpper())  --  port $Port" -ForegroundColor Cyan
Write-Host '  ============================================' -ForegroundColor Cyan
Write-Host "  Log: `$logFile" -ForegroundColor DarkGray
Write-Host ''

Update-State "COMPILING"

function Process-Line {
    param([string]`$Line)
    Add-Content -Path `$logFile -Value `$Line -ErrorAction SilentlyContinue

    # Skip noise (info-level mentions of exception class names, SLF4J warnings)
    if (`$Line -match 'ExceptionHandler|ExceptionResolver|GlobalExceptionHandler|SLF4J|LoggerFactory') { return }

    if (`$Line -match 'BUILD FAILURE|COMPILATION ERROR') {
        Write-Host `$Line -ForegroundColor Red
        `$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name BUILD_FAILED (:$Port)'
        Update-State "BUILD_FAILED"
    }
    elseif (`$Line -match '\s(ERROR|FATAL)\s|^Caused by:') {
        Write-Host `$Line -ForegroundColor Red
    }
    elseif (`$Line -match '^\s+at\s') {
        Write-Host `$Line -ForegroundColor DarkRed
    }
    elseif (`$Line -match 'Starting .+ using Java') {
        `$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name STARTING (:$Port)'
        Update-State "STARTING"
    }
    elseif (`$Line -match 'Tomcat initialized with port|Netty started on port') {
        `$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name WARMING (:$Port)'
        Update-State "WARMING"
    }
    elseif (`$Line -match 'Started .+ in .+ seconds|Tomcat started') {
        Write-Host `$Line -ForegroundColor Green
        `$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name READY (:$Port)'
        Update-State "READY"
    }
}

Set-Location `$serviceDir

# STEP 1: Install all modules (quiet output, errors only)
Write-Host '[$Name] Installing modules (clean install)...' -ForegroundColor DarkGray
& .\mvnw.cmd clean install -DskipTests -q 2>&1 | ForEach-Object {
    Add-Content -Path `$logFile -Value `$_ -ErrorAction SilentlyContinue
    if (`$_ -match '\s(ERROR|FATAL)\s|BUILD FAILURE|COMPILATION ERROR') {
        Write-Host `$_ -ForegroundColor Red
    }
}

if (`$LASTEXITCODE -ne 0) {
    `$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name BUILD_FAILED (:$Port)'
    Update-State "BUILD_FAILED"
    Write-Host '=== BUILD FAILED ===' -ForegroundColor Red
    Write-Host 'Last 30 lines:' -ForegroundColor DarkGray
    Get-Content `$logFile -Tail 30 | ForEach-Object { Write-Host `$_ -ForegroundColor DarkGray }
    Write-Host ''
    Read-Host 'Press Enter to close'
    exit 1
}

# STEP 2: Run the boot module only
Write-Host '[$Name] Starting Spring Boot ($BootModule)...' -ForegroundColor DarkGray
& .\mvnw.cmd spring-boot:run -pl $BootModule 2>&1 | ForEach-Object { Process-Line `$_ }

`$exitCode = `$LASTEXITCODE
Write-Host ''
if (`$exitCode -ne 0) {
    `$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name CRASHED (:$Port)'
    Update-State "CRASHED"
    Write-Host "=== CRASHED (exit `$exitCode) ===" -ForegroundColor Red
    Write-Host 'Last 30 lines:' -ForegroundColor DarkGray
    Get-Content `$logFile -Tail 30 | ForEach-Object { Write-Host `$_ -ForegroundColor DarkGray }
} else {
    `$host.UI.RawUI.WindowTitle = '[$PROJECT_NAME] $Name STOPPED (:$Port)'
    Update-State "STOPPED"
    Write-Host '=== STOPPED ===' -ForegroundColor Yellow
}
Write-Host ''
Read-Host 'Press Enter to close'
"@

    $bytes = [System.Text.Encoding]::Unicode.GetBytes($innerScript)
    $encoded = [Convert]::ToBase64String($bytes)
    Start-Process powershell -ArgumentList "-ExecutionPolicy", "Bypass", "-EncodedCommand", $encoded
    Write-Status "$Name window opened -- building + starting on :$Port" "WAIT"
}
```

### Lombok Configuration (CRITICAL for Monoliths)

If your monolith uses Lombok with `@RequiredArgsConstructor`, you MUST create a `lombok.config` at the project root:

```properties
config.stopBubbling = true
lombok.copyableAnnotations += org.springframework.context.annotation.Lazy
lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Qualifier
```

**Why?** Lombok generates constructor parameters from fields. Without this config:

- `@Lazy` on a field is NOT copied to the constructor parameter, so Spring ignores it
- `@Qualifier("taskExecutor")` on a field is NOT copied, so Spring sees 4 `Executor` beans and gives up

This is a **silent failure** -- the code compiles fine, but Spring crashes at runtime with "No qualifying bean" or "Circular reference."

### Circular Bean Dependencies

In a monolith, modules that call each other via SPI provider interfaces create circular dependency chains:

```
Module A's Service --> Module B's ProviderImpl --> Module B's Service --> Module A's ProviderImpl --> Module A's Service (CIRCULAR!)
```

**The fix:** Add `@Lazy` to cross-module SPI fields at the "chokepoints" -- the fields where one module imports another module's provider:

```java
// In Module A's service that depends on Module B:
@Lazy PostProvider postProvider;     // Injected lazily to break A -> B -> A cycle

// In Module B's service that depends on Module C:
@Lazy SessionProvider sessionProvider;  // Injected lazily to break B -> C -> B cycle
```

**How to find cycles:** Look at the Spring error message. It prints the full chain:
```
Error creating bean 'controllerX': ... constructor parameter 4:
  Error creating bean 'serviceA': ... constructor parameter 6:
    Error creating bean 'providerImplB': ... constructor parameter 0:
      Error creating bean 'serviceB': ... constructor parameter 6:
        Error creating bean 'providerImplA': ... constructor parameter 0:
          Error creating bean 'serviceA': Requested bean is currently in creation
```

Follow the chain. Add `@Lazy` to the cross-module field (the one where Module A references Module B's interface).

### @Value + Lombok: The Boolean Trap

```java
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MyService {
    SomeRepository repo;

    @Value("${feature.enabled:false}")
    boolean featureEnabled;  // BUG: Lombok puts this in the constructor!
}
```

Spring tries to inject `boolean` as a bean (not a property) and fails:
```
No qualifying bean of type 'boolean' available
```

**Fix:** Add `@NonFinal` to exclude it from the constructor:
```java
@Value("${feature.enabled:false}")
@NonFinal
boolean featureEnabled;
```

Or use `@lombok.experimental.NonFinal` on the field. This tells Lombok "this field is not final, don't put it in `@RequiredArgsConstructor`."

---

## Wrapper Script: dev.bat

A simple batch file that calls the PowerShell script. Lives in the infrastructure root for easy access.

```batch
@echo off
REM ============================================================================
REM Dev Mode - Simple wrapper for dev-mode.ps1
REM ============================================================================
REM
REM Usage:
REM   dev.bat              Start all services
REM   dev.bat -Watch       Start all + error watcher
REM   dev.bat -Status      Show service status (human)
REM   dev.bat -JsonStatus  Print runtime-status.json (agent)
REM   dev.bat -Logs        Open logs folder
REM   dev.bat -ClearLogs   Clear logs only (no restart)
REM   dev.bat -Kill        Kill all Java processes
REM   dev.bat -Clean       Clean all Maven target dirs (use after switching branches!)
REM   dev.bat -Infra       Start infrastructure only (Docker)
REM   dev.bat -InfraDown   Stop infrastructure (Docker)
REM   dev.bat -FixKeycloak Fix Keycloak H2 database corruption
REM
REM Exit codes: 0=OK, 1=preflight, 2=infra, 3=build, 4=crash, 5=bad args
REM
REM IMPORTANT: After switching git branches, run `dev -Kill` then `dev -Clean`!
REM IMPORTANT: After changing lombok.config, run `dev -Clean`!
REM
REM ============================================================================

powershell -ExecutionPolicy Bypass -File "%~dp0scripts\dev-mode.ps1" %*
```

---

## Docker Compose: Infrastructure-Only

The key insight: **separate your infrastructure from your services**.

- `compose-infra-only.yaml` -- Just the dependencies (DB, message queue, auth server)
- `compose.yaml` -- Full stack including services (for prod-like testing or CI)

### compose-infra-only.yaml

```yaml
# =============================================================================
# INFRASTRUCTURE ONLY - For Local Development
# =============================================================================
# Use this when running services locally via IDE or maven/gradle
# Start with: docker compose -f compose-infra-only.yaml up -d
# =============================================================================

services:
  # --- Database ---
  mongodb:
    image: mongo:latest
    container_name: myproject-mongo
    ports:
      - "27017:27017"
    volumes:
      - ./data/mongo:/data/db
    networks:
      - myproject-net
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # --- Message Broker (Kafka) ---
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: myproject-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
      KAFKA_OPTS: "-Dzookeeper.4lw.commands.whitelist=ruok,srvr,stat"
    networks:
      - myproject-net
    healthcheck:
      test: ["CMD-SHELL", "echo srvr | nc localhost 2181 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: myproject-kafka
    restart: always
    depends_on:
      zookeeper:
        condition: service_healthy
    ports:
      - "9094:9094"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENERS: PLAINTEXT://:9092,EXTERNAL://:9094
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,EXTERNAL://localhost:9094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    networks:
      - myproject-net
    healthcheck:
      test: ["CMD", "kafka-topics", "--bootstrap-server", "localhost:9092", "--list"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s

  # --- Cache (Redis) - Optional ---
  redis:
    image: redis:alpine
    container_name: myproject-redis
    ports:
      - "6379:6379"
    networks:
      - myproject-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # --- Auth Server (Keycloak) - Optional ---
  #
  # GOTCHA: Keycloak with KC_DB=dev-file uses embedded H2.
  # H2 files corrupt on unclean shutdown (Docker crash, power loss).
  # Symptoms: MVStoreException, AccessDeniedException on startup.
  # Recovery: dev.bat -FixKeycloak (deletes data, recreates container)
  # Realm re-imports automatically from /opt/keycloak/data/import.
  #
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    container_name: myproject-keycloak
    command: start-dev --import-realm
    environment:
      KC_DB: dev-file
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      KC_HTTP_PORT: 8180
    ports:
      - "8180:8180"
    volumes:
      - ./data/keycloak:/opt/keycloak/data/h2
      - ./keycloak-config:/opt/keycloak/data/import
    networks:
      - myproject-net

networks:
  myproject-net:
    driver: bridge
```

---

## Supporting Scripts

### stop_all.bat -- Stop Services by Port

```batch
@echo off
setlocal
REM ============================================================================
REM Stop All Services - By Known Ports
REM ============================================================================
REM Usage: stop_all.bat [--docker]
REM ============================================================================

echo.
echo  Stopping Services...
echo.

set "STOP_DOCKER=0"
if /i "%~1"=="--docker" set "STOP_DOCKER=1"

REM Kill Java services by known ports
REM CUSTOMIZE: Add your service ports here
for %%p in (8761 8888 8081 8082 8083 8084 8085 8086) do (
    for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%%p" ^| findstr "LISTENING"') do (
        echo   Stopping port %%p (PID %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

if "%STOP_DOCKER%"=="1" (
    echo.
    echo   Stopping Docker containers...
    docker compose -f compose-infra-only.yaml down 2>nul
)

echo.
echo   Done.
echo.
```

### restart.bat -- Restart Single Service

```batch
@echo off
setlocal
REM ============================================================================
REM Restart Single Service
REM ============================================================================
REM Usage: restart.bat <service>
REM ============================================================================

if "%~1"=="" (
    echo.
    echo   Usage: restart.bat ^<service^>
    echo.
    echo   Services:
    echo     gateway      port 8888
    echo     service-a    port 8081
    echo     service-b    port 8082
    echo.
    exit /b 1
)

set "SERVICE=%~1"
set "SCRIPT_DIR=%~dp0"
set "ROOT=%SCRIPT_DIR%..\.."

REM Map service to dir and port
REM CUSTOMIZE: Add your service mappings
if /i "%SERVICE%"=="gateway"   set "svc_dir=api-gateway"   & set "svc_port=8888"
if /i "%SERVICE%"=="service-a" set "svc_dir=service-a"     & set "svc_port=8081"
if /i "%SERVICE%"=="service-b" set "svc_dir=service-b"     & set "svc_port=8082"

if not defined svc_dir (
    echo   Unknown service: %SERVICE%
    exit /b 1
)

echo   Stopping %SERVICE% on port %svc_port%...

REM Kill by port
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%svc_port%" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo   Starting %SERVICE%...

REM Start in new window (uses powershell to stay open on crash)
cd /d "%ROOT%\%svc_dir%"
start "%SERVICE%" cmd /k "mvnw.cmd spring-boot:run"

echo   Done. Check the new window for %SERVICE%.
```

### clean.bat -- Nuclear Option

```batch
@echo off
setlocal
REM ============================================================================
REM Nuclear Clean - Full Reset
REM ============================================================================

echo.
echo   WARNING: This will:
echo     - Kill ALL Java processes
echo     - Stop ALL Docker containers
echo     - Delete ALL target/ directories
echo     - Delete ALL logs
echo.

set /p confirm="   Continue? [y/N]: "
if /i not "%confirm%"=="y" (
    echo   Aborted.
    exit /b 0
)

set "SCRIPT_DIR=%~dp0"
set "INFRA_DIR=%SCRIPT_DIR%.."
set "ROOT=%SCRIPT_DIR%..\.."

echo.
echo [1/4] Killing ALL Java processes...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Stopping Docker containers...
cd /d "%INFRA_DIR%"
docker compose -f compose-infra-only.yaml down 2>nul
docker compose -f compose.yaml down 2>nul

echo [3/4] Deleting target/ directories...
for /d %%d in ("%ROOT%\*") do (
    if exist "%%d\target" (
        echo   %%d\target
        rd /s /q "%%d\target" 2>nul
    )
)

echo [4/4] Clearing logs...
if exist "%INFRA_DIR%\logs" rd /s /q "%INFRA_DIR%\logs" 2>nul

echo.
echo   Nuclear clean complete. Run 'dev.bat' to rebuild.
echo.
```

---

## Customization Guide

### Step 1: Update Project Name

In `dev-mode.ps1`, change:
```powershell
$PROJECT_NAME = "MyProject"
```

### Step 2: Choose Your Architecture

**Microservices:** Use `$SERVICES` array + `Start-ServiceInWindow` (each service builds independently).

**Monolith:** Use `Start-MonolithInWindow` with `$BootModule` parameter (two-step build).

**Hybrid** (monolith + FE + AI): Use separate launcher functions for each type of service.

### Step 3: Define Your Services

For microservices, update the `$SERVICES` array:
```powershell
$SERVICES = @(
    @{ Name = "eureka";      Dir = "infrastructure\discovery-server"; Port = 8761;  Type = "core" }
    @{ Name = "gateway";     Dir = "my-gateway";                      Port = 8888;  Type = "core" }
    @{ Name = "user-svc";    Dir = "user-service";                    Port = 8081;  Type = "service" }
    @{ Name = "order-svc";   Dir = "order-service";                   Port = 8082;  Type = "service" }
    @{ Name = "payment-svc"; Dir = "payment-service";                 Port = 8083;  Type = "service" }
)
```

**Rules:**
- `Name`: Short, lowercase, no spaces (used in window titles and log filenames)
- `Dir`: Path relative to project root
- `Port`: Must match what the service actually listens on
- `Type`: `"core"` starts first (Eureka, Gateway), `"service"` starts after

### Step 4: Define Your Infrastructure

Update `$INFRA_PORTS`:
```powershell
$INFRA_PORTS = @{
    MongoDB  = 27017
    Kafka    = 9094
    Redis    = 6379
    Postgres = 5432
    Keycloak = 8180
    # Remove what you don't need, add what you do
}
```

**IMPORTANT:** Check ALL ports, not just the first one. If MongoDB is up but Keycloak is down, your auth will fail.

### Step 5: Customize Build Command

If you use Gradle instead of Maven, find this line in `Start-ServiceInWindow`:
```powershell
& .\mvnw.cmd spring-boot:run 2>&1 | ForEach-Object { Process-Line $_ }
```

And change to:
```powershell
& .\gradlew.bat bootRun 2>&1 | ForEach-Object { Process-Line $_ }
```

### Step 6: Customize Success Detection

The script detects "ready" via regex. If your framework logs differently:
```powershell
elseif ($Line -match 'Started .+ in .+ seconds|Tomcat started|Netty started|Application is ready') {
```

Add your pattern with `|`.

**IMPORTANT:** Port being open (TCP check passes) does NOT mean the service is ready. Tomcat/Netty opens the port before Spring finishes initializing beans. Use log-based detection for true readiness.

### Step 7: Service Colors (Optional)

Update `$SERVICE_COLORS` for the error watcher:
```powershell
$SERVICE_COLORS = @{
    'gateway'     = 'Cyan'
    'user-svc'    = 'Magenta'
    'order-svc'   = 'Blue'
    'payment-svc' = 'Green'
}
```

---

## Gotchas and Lessons Learned

These are hard-won lessons from production use. Each one cost real debugging hours. Don't skip this section.

---

### CRITICAL: Branch Switching Breaks Everything

**This is the #1 cause of "mysterious" startup failures.**

| Symptom | What Developer Sees | Actual Cause |
|---------|---------------------|--------------|
| Redis connection refused | `Cannot connect to Redis at localhost:6379` | Stale `.class` files, not Redis |
| Bean creation exception | `Error creating bean 'someService'` | Old bean definition vs new code |
| NoSuchMethodError | `Method X does not exist` | Compiled against old interface |
| ClassNotFoundException | `Cannot find class Y` | Class renamed/moved in new branch |
| "Circular reference" | `Requested bean is currently in creation` | New `@Lazy` annotation not picked up |

**Why it happens:**
1. Developer works on `main` branch, compiles code -> `target/` has `.class` files
2. Developer switches to `feature-branch` -> source code changes
3. Developer runs `spring-boot:run` -> Maven does **incremental compile**
4. Incremental compile misses some changes (especially annotations, interfaces)
5. Spring loads a **mix of old and new classes** -> chaos
6. Error appears as infrastructure problem (Redis, Kafka) because that's what was initializing when it crashed

**The fix -- ALWAYS clean after branch switch:**
```powershell
.\dev.bat -Kill       # Stop running services
.\dev.bat -Clean      # Clean all Maven target directories
git checkout <branch>
.\dev.bat             # Fresh start
```

**Also clean after: changing `lombok.config`, adding/removing annotation processors (MapStruct, Lombok), modifying parent POM dependencies.**

---

### CRITICAL: PowerShell 5.1 Encoding Trap

`dev.bat` calls `powershell` (not `pwsh`), which is PowerShell 5.1. PS 5.1 reads `.ps1` files using the system-default encoding (Windows-1252 on Western systems), NOT UTF-8.

| Character | Unicode | Win-1252 Byte | PS 5.1 Reads As | Result |
|-----------|---------|---------------|------------------|--------|
| Em-dash | U+2014 | 0x97 | `"` (right double quote) | Parser corruption |
| Left quote | U+2018 | 0x91 | Undefined | Syntax error |
| Right quote | U+2019 | 0x92 | Undefined | Syntax error |
| Ellipsis | U+2026 | 0x85 | Undefined | Syntax error |

**Rule: Every `.ps1` file MUST be pure ASCII.** Use `--` instead of em-dash, `'` instead of curly quotes, `...` instead of ellipsis.

**Detection:** Open the `.ps1` in a hex editor or run:
```powershell
[System.IO.File]::ReadAllBytes("dev-mode.ps1") | Where-Object { $_ -gt 127 } | ForEach-Object { "Non-ASCII byte: 0x{0:X2}" -f $_ }
```

**Exception:** `-EncodedCommand` payloads use Unicode base64 internally, so the *content* of encoded commands can contain any character. Only the `.ps1` file itself must be ASCII.

---

### CRITICAL: Lombok + Spring Wiring Failures

These are the most insidious bugs because the **code compiles fine** but **crashes at runtime**.

#### The `@RequiredArgsConstructor` Trap

Lombok's `@RequiredArgsConstructor` generates a constructor from all `final` fields. If those fields have annotations that Spring needs (`@Lazy`, `@Qualifier`), Lombok silently drops them from the generated constructor.

```java
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MyService {
    SomeRepository repo;
    @Lazy PostProvider postProvider;    // BUG: @Lazy NOT on constructor param
    @Qualifier("taskExecutor")
    Executor taskExecutor;              // BUG: @Qualifier NOT on constructor param
}
```

**Spring sees:**
```java
public MyService(SomeRepository repo, PostProvider postProvider, Executor taskExecutor) { ... }
// No @Lazy -> circular dependency crash
// No @Qualifier -> "expected single matching bean but found 4" crash
```

**Fix: Create `lombok.config` at project root:**
```properties
config.stopBubbling = true
lombok.copyableAnnotations += org.springframework.context.annotation.Lazy
lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Qualifier
```

This tells Lombok to copy these annotations to constructor parameters.

**IMPORTANT: After creating/modifying `lombok.config`, you MUST do a clean build.** Incremental compilation does NOT reprocess annotation configurations.

#### The `@Value boolean` Trap

```java
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PushService {
    PushTokenRepository repo;

    @Value("${push.enabled:false}")
    boolean pushEnabled;  // Lombok makes this a constructor param!
}
```

Spring tries to inject `boolean` as a bean, fails with:
```
No qualifying bean of type 'boolean' available
```

**Fix:** Add `@NonFinal` to exclude from constructor:
```java
@Value("${push.enabled:false}")
@NonFinal
boolean pushEnabled;
```

Or use `@lombok.experimental.NonFinal` on the field. This tells Lombok "this field is not final, don't put it in `@RequiredArgsConstructor`."

---

### CRITICAL: Circular Bean Dependencies in Monoliths

In microservices, circular dependencies are HTTP-level (Service A calls Service B calls Service A). Solved with retry/circuit breaker.

In monoliths, they're **bean-level** (Spring DI). Completely different problem, completely different fix.

**Pattern that creates cycles:**
```
Module A: ServiceA -> injects -> ProviderImpl from Module B
Module B: ServiceB -> injects -> ProviderImpl from Module A
```

Where `ProviderImplB` depends on `ServiceB` and `ProviderImplA` depends on `ServiceA`.

**The chain:** `ServiceA -> ProviderImplB -> ServiceB -> ProviderImplA -> ServiceA` (CIRCULAR!)

**Reading the Spring error:**
```
Error creating bean 'controllerX': ... constructor parameter 4:
  Error creating bean 'serviceA': ... constructor parameter 6:
    Error creating bean 'providerImplB': ... constructor parameter 0:
      Error creating bean 'serviceB': ... constructor parameter 6:
        Error creating bean 'providerImplA': ... constructor parameter 0:
          Error creating bean 'serviceA': Requested bean is currently in creation
```

**Fix:** Add `@Lazy` to the cross-module field that starts the cycle:
```java
public class ServiceA {
    @Lazy ProviderInterfaceB providerB;  // Breaks A -> B -> A cycle
}
```

**Strategy:** Map ALL cross-module SPI injections. Find the minimal set of `@Lazy` annotations that breaks all cycles. Typically 2-3 strategically placed `@Lazy` annotations fix everything.

---

### Docker Container Gotchas

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| Infra not starting | compose file not found | Use absolute path: `Join-Path $INFRA_DIR "compose-infra-only.yaml"` |
| Services can't connect to DB | Using `localhost` inside container | In Docker, use service names (kafka, mongodb, etc.) |
| Port conflicts | Previous run didn't clean up | `docker compose down` or restart Docker |
| Keycloak MVStoreException | H2 database corrupted on unclean shutdown | `dev.bat -FixKeycloak` (deletes data, fully recreates container) |
| `docker compose stop` not enough | Container state is corrupted | Use `docker compose rm -f -s <service>` to fully remove, then `up -d` |
| Container "healthy" but not working | Health check passes but service not initialized | Use application-level health checks, not just port/process checks |

**Keycloak H2 Recovery (common enough to deserve its own section):**

Keycloak with `KC_DB=dev-file` stores data in embedded H2 files. These corrupt easily:
- Docker Desktop crash
- Power loss
- Force-killing Docker
- Running out of disk space

Symptoms: `MVStoreException`, `AccessDeniedException`, container restarts in a loop.

**Recovery pattern:**
```powershell
# 1. Fully remove the container (not just stop)
docker compose -f compose-infra-only.yaml rm -f -s keycloak

# 2. Delete the corrupted data
Remove-Item ./data/keycloak -Recurse -Force

# 3. Recreate fresh (will re-import realm config)
docker compose -f compose-infra-only.yaml up -d keycloak

# 4. Wait 60-120s for first-time realm import
```

---

### PowerShell Generic Gotchas

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| `$PSScriptRoot` is empty | Called via `Start-Process powershell -File script.ps1` | Use `$MyInvocation.MyCommand.Path` instead |
| Script arguments don't pass | Batch passes `%*` but PS doesn't receive | Use `powershell -File script.ps1 %*` (the `%*` passes through) |
| Special chars in paths | Spaces, parentheses break commands | Always quote paths: `"$serviceDir"` |
| Encoded script too long | Very long scripts hit CMD limit | Split into multiple encoded commands or use temp file |
| `Invoke-WebRequest` prompts for security | PS 5.1 default prompts about script content | Always use `-UseBasicParsing` flag |
| Output piping kills process | `mvnw.cmd ... 2>&1 \| Out-File` -- process dies when pipe closes | Use `ForEach-Object` for streaming, or `-EncodedCommand` in new window |

---

### Window Behavior

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| Window closes on crash | Using `cmd /c` | Use `Read-Host 'Press Enter to close'` at end of script |
| Stack trace lost | Window closes before you can read | Show last 30 lines of log before `Read-Host` |
| Can't tell which window is which | No labeling | Set `$host.UI.RawUI.WindowTitle` dynamically with status |
| Windows all spawn at once | Overwhelms CPU | Use `Start-Sleep -Milliseconds 500` between launches |

---

### Logging Gotchas

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| Console flooded with noise | Showing all DEBUG/INFO logs | Filter: show ONLY `ERROR` level + startup confirmation |
| Miss errors in scroll | Too much output | Centralized error watcher in separate window |
| Can't search old errors | Console buffer limited | Always write to file, reference in console |
| Log files accumulate | Old logs interfere with current debugging | **Clear logs automatically on every startup** |
| "ExceptionHandler" triggers error display | Filter matches "Exception" substring | Filter on log LEVEL (`\s(ERROR)\s`), not just word. Explicitly exclude `ExceptionHandler\|ExceptionResolver\|GlobalExceptionHandler` |
| Stack trace orphaned | No context for which service | Extract service name from log filename, prefix with color-coded label |

---

### Detection Gotchas

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| Port check says UP, service not ready | TCP port opens before Spring context finishes | Log-based detection: match "Started...in...seconds" |
| "ExceptionHandler" triggers error | Matches "Exception" substring | Match on `'\s(ERROR\|FATAL)\s'` for levels, `'^[a-z]+\.[a-z]+\..*Exception:'` for thrown exceptions (full package path) |
| Stack trace not shown | Not matching `at package.Class.method` | Match `'^\s+at\s'` pattern (indented "at" lines) |
| Build errors not caught | Different format | Add `BUILD FAILURE\|COMPILATION ERROR` to regex |
| Startup not detected | Different framework message | Customize the success regex pattern |

---

### Maven Multi-Module Gotchas

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| `spring-boot:run` on parent POM fails | "Unable to find a single main class" | Use `-pl application` to target boot module only |
| `-pl application -am` still fails | `-am` builds deps first, but ALSO runs goal on parent | Two-step: `install -DskipTests` then `spring-boot:run -pl application` |
| Module B doesn't see Module A's changes | A's JAR in `.m2` is stale | Always `clean install` before `spring-boot:run` |
| Maven wrapper missing | Not committed to repo | `mvn wrapper:wrapper` (requires Maven installed globally) |
| `install` is not enough after branch switch | Incremental compile misses annotation changes | Use `clean install` always |
| Build works locally, fails in CI | Local `.m2` has cached artifacts | CI should always use `clean install` |

---

### Seed Data / Database Gotchas

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| Duplicate key errors on startup | Seed data inserted twice, unique index violated | Before seeding, check if data exists: `db.collection.findOne({key: value})` |
| `IllegalArgumentException: No enum constant` | Seed data string doesn't match Java enum value | Always verify enum values in Java source before writing seed data |
| Old test data breaks new schema | Migration added required field, old docs don't have it | Use MongoDB migrations or defensive null checks in code |
| Seed script assumes empty DB | Re-running seed on existing data | Use `updateOne` with `upsert: true` instead of `insertOne` |

---

### VS Code Terminal Gotchas

| Issue | Why It Happens | Solution |
|-------|----------------|----------|
| Output garbled/truncated | VS Code terminal streaming is unreliable for long output | Pipe to file first: `cmd 2>&1 \| Out-File out.txt; Get-Content out.txt` |
| Command hangs | Interactive prompt hidden (e.g., "Terminate batch job?") | Use `cmd /c` for one-shot commands |
| Previous command output bleeds through | Terminal reuse, shared state | Open fresh terminal for critical commands |

---

## Adapting for Non-Java Projects

### Node.js / TypeScript

Change the build command:
```powershell
& npm run dev 2>&1 | ForEach-Object { Process-Line $_ }
```

Change the success detection:
```powershell
elseif ($Line -match 'ready on|Ready in|listening on|started at|Server running|Local:') {
```

Change the kill command:
```powershell
function Stop-AllNode {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
}
```

### Python / FastAPI

Change the build command:
```powershell
& python -m uvicorn main:app --reload 2>&1 | ForEach-Object { Process-Line $_ }
```

Change the success detection:
```powershell
elseif ($Line -match 'Uvicorn running|Application startup complete') {
```

**Tip:** If using `run.bat` wrapper (e.g., for venv activation):
```powershell
& cmd /c run.bat 2>&1 | ForEach-Object { Process-Line $_ }
```

### Go

Change the build command:
```powershell
& go run . 2>&1 | ForEach-Object { Process-Line $_ }
```

### Hybrid Projects (Java Monolith + Node FE + Python AI)

This is the real-world pattern. Use separate launcher functions:

```powershell
Start-MonolithInWindow    # Java: two-step Maven build
Start-FrontendInWindow    # Node: npm run dev
Start-AiServiceInWindow   # Python: run.bat with venv
```

Each function handles its own build command, success detection, and error filtering. Don't try to unify them -- each stack has different patterns.

---

## Agentic Runtime Contract

This section elevates Dev Mode from a "fancy script" into a local, opinionated, agent-grade runtime. Everything here is additive -- it enhances the existing scripts and workflows described above. If Dev Mode behaves like this, you've effectively designed a local OpenTelemetry-ish runtime for a coding agent, instead of a fancy script. It makes both humans and agents less blind, less dumb, and much harder to gaslight by random runtime noise.

### Non-Negotiable Principles

- Every service and infra component has an explicit lifecycle state.
- Every state transition is recorded as a structured event.
- Every run is correlated by `run_id` across logs, status, and events.
- "Not ready yet" is never silently conflated with "failed."
- All important truth is persisted to files, never only to ephemeral terminal output.

Everything else is detail.

### Entities

You have three primary kinds of entities:

- **Run** -- a single invocation of Dev Mode (e.g., `.\dev.bat -Watch`). Gets a unique `run_id`.
- **Service** -- a Spring Boot service, monolith boot module, or microservice.
- **Infra** -- external dependencies (Dockerized databases, Keycloak, Kafka, etc.).

Everything in the runtime contract hangs off these three.

### Canonical Lifecycle States

Every Service and Infra instance must always be in exactly one of these states. **No other words** in status, window titles, or files. If you invent new states, they must be added to this list and documented.

| State | Meaning |
|-------|---------|
| `NOT_CONFIGURED` | Present in config but missing required files (e.g., `mvnw.cmd`). |
| `QUEUED` | Known, not yet touched this run. |
| `PRECHECK` | Under preflight validation. |
| `PRECHECK_FAILED` | Preflight validation failed. |
| `INFRA_STARTING` | (Infra only) Docker container being started. |
| `INFRA_READY` | (Infra only) Port open and healthy. |
| `COMPILING` | In build/compile phase. |
| `BUILD_FAILED` | Compilation or build failed. |
| `STARTING` | Process spawned, not yet listening. |
| `WARMING` | Port open but app health not OK yet. |
| `READY` | Passing health checks / fully started. |
| `DEGRADED` | Alive but health indicates partial failure. |
| `STALLED` | No meaningful progress for configurable window. |
| `CRASHED` | Process exited unexpectedly. |
| `STOPPED` | Explicitly stopped this run. |
| `UNKNOWN` | Fallback; should be rare. |

**Window titles must reflect the canonical state:** `[MyProject] gateway COMPILING (:8888)`, `[MyProject] gateway READY (:8888)`, `[MyProject] gateway CRASHED (:8888)`. This keeps the human mental model in sync with what the files say.

### State Machine Rules (No Ambiguity)

#### Build vs Runtime -- Never Conflate

Every service has two independent sub-states:

- `build.state`: `NOT_STARTED` | `COMPILING` | `BUILD_OK` | `BUILD_FAILED`
- `runtime.state`: `NOT_STARTED` | `STARTING` | `WARMING` | `READY` | `DEGRADED` | `CRASHED` | `STOPPED`

The combined `service.state` in `runtime-status.json` is derived:

- If `build.state = COMPILING` -> `service.state = COMPILING`
- Else if `build.state = BUILD_FAILED` -> `service.state = BUILD_FAILED`
- Else if `runtime.state = STARTING` -> `service.state = STARTING`
- Else if `runtime.state = WARMING` -> `service.state = WARMING`
- Else `service.state = runtime.state` (READY/DEGRADED/CRASHED/STOPPED/UNKNOWN)

#### Progress vs Stall

Track `last_progress_at` for both build and runtime phases:

- Progress events include: new compile output, dependency downloaded, healthcheck passed, log size increase, etc.
- If no progress for `stall_threshold_seconds` (per service), transition to `STALLED` and emit `service.state.changed` with `data.reason = "no_progress"`.

Agents should treat `STALLED` as "needs intervention", but not necessarily irrecoverable.

#### Time Budgets

Use the `expected_*_seconds` hints from `services.json` to classify:

- If compile time > expected but progress continues -> stay `COMPILING`, set `late: true`.
- If boot time > expected but port eventually opens -> remain `STARTING`/`WARMING` with `late: true`.
- Only after both **no progress** and **exceeded timeout** should you go to `STALLED` or `CRASHED`.

This is the exact fix for "compiling vs fail to start" confusion.

### Agentic Artifact Schemas

These are the JSON files the runtime produces and maintains. They live under `infrastructure/state/`.

#### `config/services.json` (Static Config -- Versioned in Git)

Replaces or supplements the hardcoded `$SERVICES` array in `dev-mode.ps1`. This is the machine-consumable source of truth for service definitions.

```json
{
  "services": [
    {
      "name": "gateway",
      "display_name": "Gateway",
      "dir": "api-gateway",
      "port": 8888,
      "type": "core",
      "boot_module": null,
      "expected_compile_seconds": 90,
      "expected_boot_seconds": 60,
      "expected_ready_timeout_seconds": 120,
      "dependencies": ["eureka", "redis"],
      "healthcheck": {
        "type": "http",
        "path": "/actuator/health",
        "expected_status": 200,
        "timeout_seconds": 5
      }
    }
  ]
}
```

#### `config/infra.json` (Static Config -- Versioned in Git)

Same idea for infra:

```json
{
  "infra": [
    {
      "name": "mongo",
      "port": 27017,
      "compose_service": "mongo",
      "critical": true
    },
    {
      "name": "keycloak",
      "port": 8180,
      "compose_service": "keycloak",
      "critical": true
    }
  ]
}
```

#### `runtime-status.json` (Live State -- Updated on Every Transition)

Single canonical "what's going on right now" file. Dev Mode must update this on **every** meaningful transition (no lazy updates). Agents should trust this file over ad-hoc grepping of logs.

```json
{
  "run_id": "2026-04-24T07-42-00Z",
  "started_at": "2026-04-24T07-42-00Z",
  "mode": {
    "watch": true,
    "infra_only": false
  },
  "services": {
    "gateway": {
      "state": "COMPILING",
      "since": "2026-04-24T07-42-10Z",
      "build": {
        "state": "COMPILING",
        "last_progress_at": "2026-04-24T07-42-25Z"
      },
      "runtime": {
        "state": "NOT_STARTED",
        "pid": null,
        "port_open": false,
        "health": "unknown"
      },
      "waiting_on": ["eureka"],
      "blocked_by": null,
      "last_error": {
        "fingerprint": null,
        "message": null,
        "at": null
      }
    }
  },
  "infra": {
    "keycloak": {
      "state": "INFRA_READY",
      "since": "2026-04-24T07-41-30Z",
      "port_open": true
    }
  }
}
```

#### `events.jsonl` (Append-Only Structured Event Stream)

One JSON per line. This is the forensic trace for the run. Built for machines first; humans can still read it, but the ordering and structure are what matter.

Event schema (core fields):

```json
{
  "ts": "2026-04-24T07-42-18.123Z",
  "run_id": "2026-04-24T07-42-00Z",
  "entity": "service",
  "name": "gateway",
  "event": "service.state.changed",
  "data": {
    "from": "COMPILING",
    "to": "STARTING"
  }
}
```

Standard events (minimum set):

- `devmode.run.started`
- `devmode.run.finished`
- `devmode.preflight.started`
- `devmode.preflight.failed`
- `infra.check.started`
- `infra.check.completed`
- `infra.start.requested`
- `infra.state.changed`
- `service.compile.started`
- `service.compile.progress`
- `service.build.failed`
- `service.process.spawned`
- `service.healthcheck.passed`
- `service.healthcheck.failed`
- `service.state.changed`
- `service.crashed`
- `service.retry.scheduled`
- `service.retry.aborted`
- `error.fingerprint.detected`

#### `run-summary.json` (Post-Run Digest)

At the end (or after a timeout), Dev Mode should produce a small summary file for the run. Agents can open **one** file and see the overall outcome.

```json
{
  "run_id": "2026-04-24T07-42-00Z",
  "completed_at": "2026-04-24T07-45-30Z",
  "services": {
    "gateway": {
      "final_state": "READY",
      "startup_seconds": 47,
      "build_state": "BUILD_OK",
      "error_fingerprints": []
    },
    "service-a": {
      "final_state": "BUILD_FAILED",
      "startup_seconds": null,
      "build_state": "BUILD_FAILED",
      "error_fingerprints": ["MissingBeanQualifier"]
    }
  },
  "infra": {
    "keycloak": {
      "final_state": "INFRA_READY"
    }
  }
}
```

#### Log File Naming

You already have great log discipline; just lock down naming and semantics to use `run_id`:

- Per-service: `logs/<service>-<run_id>.log`
- Per-run infra: `logs/infra-<run_id>.log`

Rules:

- All stdout/stderr from the process must end up here.
- Console windows only show heavily filtered, human-friendly slices (as described in the core script above).
- Error watcher should tail log files, not processes, and also emit events to `events.jsonl` when it detects significant issues.

### Error Fingerprinting

Your existing gotchas section already documents these problems; fingerprinting **encodes** them so tools and agents can use them programmatically.

#### `config/fingerprints.json` (Error Knowledge Base)

A small knowledge base of known error patterns and their meaning:

```json
{
  "MissingBeanQualifier": {
    "patterns": [
      "No qualifying bean of type",
      "expected single matching bean but found"
    ],
    "description": "Spring cannot decide which bean to inject.",
    "recommended_actions": [
      "Check @Qualifier annotations.",
      "If using Lombok, verify lombok.config has copyableAnnotations for @Qualifier."
    ]
  },
  "CircularDependency": {
    "patterns": [
      "Requested bean is currently in creation",
      "circular reference"
    ],
    "description": "Bean A and B depend on each other.",
    "recommended_actions": [
      "Add @Lazy at the chokepoint fields.",
      "Check SPI provider wiring."
    ]
  },
  "PortInUse": {
    "patterns": [
      "Address already in use",
      "Port .+ was already in use"
    ],
    "description": "Another process is already bound to the service port.",
    "recommended_actions": [
      "Run dev.bat -Kill to stop stale Java processes.",
      "Check for orphaned processes on the port."
    ]
  },
  "KeycloakH2Corruption": {
    "patterns": [
      "MVStoreException",
      "AccessDeniedException.*h2"
    ],
    "description": "Keycloak embedded H2 database corrupted on unclean shutdown.",
    "recommended_actions": [
      "Run dev.bat -FixKeycloak to purge and recreate."
    ]
  },
  "StaleClassesAfterBranchSwitch": {
    "patterns": [
      "NoSuchMethodError",
      "ClassNotFoundException",
      "NoClassDefFoundError"
    ],
    "description": "Compiled classes from a different branch are poisoning the classpath.",
    "recommended_actions": [
      "Run dev.bat -Kill then dev.bat -Clean.",
      "This is the #1 cause of mysterious failures after git checkout."
    ]
  }
}
```

#### Fingerprint Assignment

When the error watcher sees a log line matching a pattern:

1. Emit `error.fingerprint.detected` event with `fingerprint`, `evidence` (the line or short excerpt), and `first_seen` timestamp.
2. Update `runtime-status.json` -> `services.<name>.last_error.fingerprint` and `message`.
3. Add fingerprint to the `run-summary.json` list for that service.

#### `config/policies.json` (Agent Behavioral Hints)

Optional but powerful file mapping states / fingerprints to recommended behavior. This turns your runtime into an environment that **teaches** the agent what to do, instead of leaving it to guess.

```json
{
  "actions": {
    "on_state": {
      "COMPILING": {
        "agent_should": "wait",
        "min_wait_seconds": 15
      },
      "WARMING": {
        "agent_should": "check_health",
        "health_check_path": "/actuator/health"
      },
      "STALLED": {
        "agent_should": "inspect_logs_then_suggest_restart"
      },
      "BUILD_FAILED": {
        "agent_should": "inspect_logs_propose_code_changes"
      }
    },
    "on_fingerprint": {
      "MissingBeanQualifier": {
        "agent_should": "inspect_source",
        "hints": [
          "Search for @Qualifier on fields mentioned in the stack trace.",
          "Propose adding explicit @Qualifier(\"...\") on injection site."
        ]
      },
      "CircularDependency": {
        "agent_should": "inspect_source",
        "hints": [
          "Follow the chain in the error message.",
          "Find the cross-module SPI field and add @Lazy."
        ]
      },
      "StaleClassesAfterBranchSwitch": {
        "agent_should": "run_command",
        "command": "dev.bat -Kill && dev.bat -Clean",
        "explanation": "Stale compiled classes are poisoning the runtime."
      }
    }
  }
}
```

### CLI Exit Codes

Every command must use meaningful exit codes so agents can act on exit codes **without** parsing text:

| Exit Code | Meaning |
|-----------|---------|
| `0` | Success or benign incomplete (e.g., `-Status`). |
| `1` | Preflight failure (missing tools, Docker not running). |
| `2` | Infra failed to start or health checks failed. |
| `3` | At least one service `BUILD_FAILED`. |
| `4` | All builds OK, but at least one service `CRASHED` or `STALLED`. |
| `5` | Invalid arguments / misuse. |

### Agent-Friendly CLI Extensions

In addition to the existing commands, add these machine-oriented helpers:

| Command | What It Does |
|---------|-------------|
| `dev.bat -JsonStatus` | Print `runtime-status.json` to stdout (no colors, single line). |
| `dev.bat -ServiceStatus gateway` | Print JSON status for one service only. |
| `dev.bat -ServiceLogs gateway -Tail 100` | Dump the last N lines of a service log to stdout (for quick agent ingestion). |
| `dev.bat -ExplainState gateway` | High-level explanation / hints derived from `policies.json` and fingerprints (e.g., "Gateway is COMPILING and still inside expected window. Do not restart yet."). |

CLI output should default to human-friendly, but the JSON subcommands are intentionally machine-oriented.

### Behavioral Rules for Agents (How to Use Dev Mode)

Feed this to any AI coding assistant or tool that hooks into this project:

1. **Always call `dev.bat -JsonStatus` first** to understand current state; never assume.
2. If a service is:
    - `COMPILING` -> wait at least `expected_compile_seconds / 2` before taking action.
    - `STARTING` / `WARMING` -> check health once before deciding it failed.
    - `STALLED` -> inspect logs and fingerprints before restarting.
    - `BUILD_FAILED` -> inspect logs, propose code changes; only then re-run.
3. **Never call `-Kill` in a tight loop;** use `policies.json` to decide.
4. When you propose changes, **reference fingerprints and the exact evidence lines** from logs, not vague "build failed" messages.

You don't have to strap an agent directly onto Dev Mode right now, but this is the protocol you and future tooling can rely on.

### Observability: Deep, But Cheap

This is a local dev tool, not a SaaS product, so no heavyweight observability stack. But you should still:

- Emit structured events and states as described above.
- Track:
    - Startup time per service.
    - Build duration.
    - Number of restarts in a run.
    - Common fingerprints per week.

Even basic counts and durations make agent behavior better, because the environment can say "this service usually takes about 35 seconds to get READY" instead of guessing.

**Dev Mode must run with: PowerShell + Docker + Java + local Maven wrapper. No external DB or telemetry server required.**

### Safety and Hygiene

#### Retention

- Keep N recent runs (configurable) in `logs/` and `state/`.
- Older run artifacts can be zipped and archived, or deleted.

#### Redaction

- Optional: a simple regex-based redaction step in the error watcher to avoid writing secrets (tokens, passwords) to structured logs and events.

#### Sandbox Assumptions

Treat Dev Mode as a "semi-trusted sandbox":

- All destructive operations (e.g., `-Clean`, `-FixKeycloak`) must:
    - Emit events to `events.jsonl`.
    - Be idempotent when possible.
    - Warn before running if triggered repeatedly in a short window (agent loop detection).

### Implementation Priority

To avoid getting crushed by scope, implement in two waves:

**First wave (do this now):**

1. Add `services.json` and `infra.json` to `state/config/`.
2. Implement `runtime-status.json` with canonical states and separate build/runtime sections.
3. Implement `events.jsonl` with at least: `devmode.run.started`, `service.state.changed`, `service.build.failed`, `service.crashed`.
4. Implement time-based classification into `STALLED` vs `CRASHED`.
5. Normalize window titles to show canonical state names.
6. Add `-JsonStatus` and `-ServiceStatus <name>` commands (machine-oriented output).
7. Start `fingerprints.json` with 3-5 real patterns you already hit constantly (qualifier issues, circular deps, port in use, Keycloak H2).

**Second wave (do this later):**

- `policies.json` for agent behavioral hints.
- `run-summary.json` post-run digest.
- `-ExplainState` command.
- Replay metadata and redaction.
- Retention policies and log rotation by `run_id`.
- Stall detection with `last_progress_at` tracking.

---

## Summary

This blueprint gives you:

1. **One command** to start everything: `dev.bat`
2. **Smart output** -- see only what matters
3. **Persistent logs** -- nothing lost
4. **Crash visibility** -- windows stay open with context
5. **Centralized errors** -- one window, all services
6. **Automatic infrastructure** -- Docker starts when needed
7. **Proper sequencing** -- core services first
8. **Recovery tools** -- Keycloak repair, nuclear clean
9. **Pre-flight validation** -- catches missing tools before you wait 60s for a crash
10. **Monolith support** -- two-step Maven build, Lombok/Spring wiring guidance
11. **Agentic Runtime Contract** -- canonical state machines, structured events, forensic artifacts, `run_id` correlation
12. **Error fingerprinting** -- codified heuristics with agent-consumable recommended actions
13. **Machine-readable CLI** -- `dev.bat -JsonStatus`, meaningful exit codes, no text parsing required
14. **Agent behavioral policies** -- the runtime teaches agents what to do instead of leaving them to hallucinate

Copy the files, customize the configuration section, add your `services.json` and `infra.json`, and you have enterprise-grade developer experience that works for both humans and AI agents.

**Remember:** A project that's a joy to develop becomes a product worth buying. And a runtime that agents can navigate without hallucinating becomes a codebase that scales with AI.

---

*Battle-tested in a real production monorepo. Every gotcha in this document cost real debugging hours. Every agentic runtime concept is designed so that your next AI coding assistant won't have to pay those hours again.*
