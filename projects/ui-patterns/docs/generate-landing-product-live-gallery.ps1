param(
  [string]$SamplesPath = (Join-Path $PSScriptRoot "..\configs\landing-product-live-samples.json"),
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\library\landing-product-live-gallery.html")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$registryPath = Join-Path $repoRoot "configs\ui-lab-registry.json"
$sampleConfig = Get-Content -Raw -LiteralPath $SamplesPath | ConvertFrom-Json
$registry = Get-Content -Raw -LiteralPath $registryPath | ConvertFrom-Json

$entries = [System.Collections.Generic.List[object]]::new()
$sampleLookup = @{}
$sourceMap = [ordered]@{}

foreach ($sample in $sampleConfig.samples) {
  $sampleLookup[$sample.componentName] = $sample
}

foreach ($sample in $sampleConfig.samples) {
  $sourceFullPath = Join-Path $repoRoot $sample.sourcePath
  $sourceMap[$sample.componentName] = [string](Get-Content -Raw -LiteralPath $sourceFullPath)

  $entries.Add([pscustomobject]@{
    componentName = $sample.componentName
    title = $sample.title
    chapter = $sample.chapter
    sourcePath = $sample.sourcePath
    props = $sample.props
  })
}

$inventoryEntries = [System.Collections.Generic.List[object]]::new()
foreach ($item in $registry.componentLookup) {
  $sample = $sampleLookup[$item.name]
  $inventoryEntries.Add([pscustomobject]@{
    name = $item.name
    title = if ($sample) { $sample.title } else { $item.name }
    chapter = if ($sample) { $sample.chapter } else { $item.shelfLabel }
    sourcePath = $item.sourcePath
    shelfKey = $item.shelfKey
    shelfLabel = $item.shelfLabel
    hasLiveSample = [bool]$sample
    liveSampleTitle = if ($sample) { $sample.title } else { $null }
  })
}

$entriesJson = $entries | ConvertTo-Json -Depth 12
$sourceJson = $sourceMap | ConvertTo-Json -Depth 4
$inventoryJson = $inventoryEntries | ConvertTo-Json -Depth 6

$html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Landing Product Live Gallery</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    :root {
      color-scheme: dark;
      --bg: #071019;
      --panel: rgba(255,255,255,.045);
      --line: rgba(255,255,255,.08);
      --ink: #edf3fb;
      --muted: rgba(237,243,251,.7);
      --accent: #7cd1ff;
      --accent-2: #80ffcf;
      --shadow: 0 26px 90px rgba(0,0,0,.32);
    }

    body {
      margin: 0;
      font-family: Aptos, "Trebuchet MS", "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, rgba(55, 120, 188, 0.28), transparent 28%),
        radial-gradient(circle at top right, rgba(33, 117, 92, 0.16), transparent 24%),
        linear-gradient(180deg, #09111a 0%, #050b12 100%);
    }

    .shell {
      max-width: 1560px;
      margin: 0 auto;
      padding: 28px 18px 88px;
    }

    .hero {
      display: grid;
      gap: 18px;
      grid-template-columns: 1.1fr .9fr;
      padding: 28px;
      border: 1px solid var(--line);
      border-radius: 32px;
      background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025));
      box-shadow: var(--shadow);
      backdrop-filter: blur(14px);
    }

    .eyebrow {
      margin: 0 0 12px;
      color: var(--accent);
      font-size: 11px;
      letter-spacing: .26em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.8rem, 6vw, 5.6rem);
      line-height: .92;
      letter-spacing: -.06em;
      max-width: 10ch;
    }

    .hero p {
      margin: 0;
      max-width: 64ch;
      line-height: 1.75;
      color: var(--muted);
      font-size: 1rem;
    }

    .hero-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-content: start;
    }

    .hero-stats {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-top: 14px;
    }

    .stat-pill {
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,.04);
    }

    .stat-pill strong {
      display: block;
      font-size: 1.15rem;
      letter-spacing: -.03em;
    }

    .stat-pill span {
      display: block;
      margin-top: 5px;
      color: var(--muted);
      font-size: .82rem;
    }

    .hero-card {
      padding: 16px 18px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,.035);
    }

    .hero-card strong {
      display: block;
      margin-bottom: 8px;
      font-size: 1rem;
    }

    .hero-card span {
      display: block;
      color: var(--muted);
      font-size: .94rem;
      line-height: 1.55;
    }

    .gallery {
      display: grid;
      gap: 24px;
      margin-top: 28px;
    }

    .chapter {
      display: grid;
      gap: 14px;
    }

    .chapter-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
      padding: 2px 4px 0;
    }

    .chapter-head strong {
      font-size: 1.2rem;
      letter-spacing: -.03em;
    }

    .chapter-head span {
      color: var(--muted);
      font-size: .9rem;
    }

    .chapter-grid {
      display: grid;
      gap: 24px;
    }

    .inventory {
      display: grid;
      gap: 16px;
      margin-top: 40px;
    }

    .inventory-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 12px;
      padding: 0 4px;
      align-items: end;
    }

    .inventory-head strong {
      font-size: 1.35rem;
      letter-spacing: -.04em;
    }

    .inventory-head span {
      color: var(--muted);
      font-size: .92rem;
    }

    .inventory-group {
      display: grid;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 28px;
      background: rgba(255,255,255,.02);
    }

    .inventory-group-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .inventory-group-head strong {
      font-size: 1.05rem;
    }

    .inventory-group-head span {
      color: var(--muted);
      font-size: .88rem;
    }

    .inventory-grid {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    }

    .inventory-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,.03);
      min-height: 148px;
    }

    .inventory-card-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: start;
    }

    .inventory-card-head strong {
      display: block;
      font-size: .98rem;
      letter-spacing: -.02em;
    }

    .inventory-card-head span {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: .82rem;
      line-height: 1.45;
    }

    .inventory-pill {
      flex: none;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid rgba(124,209,255,.25);
      background: rgba(124,209,255,.12);
      color: #dff6ff;
      font-size: .72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .14em;
    }

    .inventory-pill.source {
      border-color: rgba(255,255,255,.14);
      background: rgba(255,255,255,.05);
      color: var(--muted);
    }

    .inventory-card a {
      margin-top: auto;
      display: inline-flex;
      align-self: start;
      align-items: center;
      justify-content: center;
      min-height: 36px;
      padding: 0 12px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,.04);
      color: var(--ink);
      text-decoration: none;
      font-size: .84rem;
      font-weight: 600;
    }

    .sample {
      overflow: hidden;
      border-radius: 30px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.02));
      box-shadow: var(--shadow);
    }

    .sample-head {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px;
      border-bottom: 1px solid var(--line);
      background: rgba(4,10,15,.34);
      backdrop-filter: blur(14px);
    }

    .sample-head strong {
      display: block;
      margin-bottom: 4px;
      font-size: 1.15rem;
      letter-spacing: -.02em;
    }

    .sample-head span {
      color: var(--muted);
      font-size: .94rem;
    }

    .sample-head a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 0 16px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,.04);
      color: var(--ink);
      text-decoration: none;
      font-size: .92rem;
      font-weight: 600;
    }

    .sample-head a:hover {
      border-color: rgba(124,209,255,.35);
      background: rgba(124,209,255,.12);
    }

    .sample-body {
      padding: 10px;
    }

    .status {
      margin-top: 14px;
      padding: 14px 16px;
      border-radius: 18px;
      border: 1px solid rgba(255, 131, 131, .18);
      background: rgba(255, 131, 131, .08);
      color: #ffd0d0;
      line-height: 1.5;
    }

    @media (max-width: 1024px) {
      .hero { grid-template-columns: 1fr; }
    }

    @media (max-width: 720px) {
      .hero-grid { grid-template-columns: 1fr; }
      .shell { padding-inline: 12px; }
      .sample-head { align-items: start; }
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.__LIVE_SAMPLE_ENTRIES__ = $entriesJson;
    window.__LIVE_SOURCE_MAP__ = $sourceJson;
    window.__FULL_COMPONENT_INVENTORY__ = $inventoryJson;
  </script>
  <script type="text/babel" data-presets="env,react">
    const cn = (...inputs) => inputs.filter(Boolean).join(" ");
    const entries = window.__LIVE_SAMPLE_ENTRIES__;
    const sourceMap = window.__LIVE_SOURCE_MAP__;
    const inventory = window.__FULL_COMPONENT_INVENTORY__;
    const chapterOrder = Array.from(new Set(entries.map((entry) => entry.chapter)));
    const inventoryOrder = Array.from(new Set(inventory.map((entry) => entry.shelfLabel)));

    const transformSource = (source) => {
      return source
        .replace(/import\s+\{\s*cn\s*\}\s+from\s+["']@\/lib\/utils["'];?\s*/g, "")
        .replace(/import\s+\*\s+as\s+React\s+from\s+["']react["'];?\s*/g, "")
        .replace(/export\s+interface\s+[\s\S]*?\n}\s*/g, "")
        .replace(/export\s+type\s+[^;]+;\s*/g, "")
        .replace(/export\s+const\s+/g, "const ")
        .replace(/export\s+default\s+/g, "")
        .replace(/export\s+\{[^}]+\};?/g, "")
        .replace(/\n[A-Za-z0-9_]+\.displayName\s*=\s*"[^"]+";?/g, "")
        .replace(/\r\n/g, "\n");
    };

    const getCompiledComponent = (entry) => {
      const cleaned = transformSource(sourceMap[entry.componentName]);
      const compiled = Babel.transform(cleaned, {
        presets: [["typescript", { allExtensions: true, isTSX: true }], ["react", { runtime: "classic" }]],
      }).code;

      return new Function("React", "cn", compiled + "; return " + entry.componentName + ";")(React, cn);
    };

    const renderers = new Map();
    const errors = new Map();

    entries.forEach((entry) => {
      try {
        renderers.set(entry.componentName, getCompiledComponent(entry));
      } catch (error) {
        errors.set(entry.componentName, error instanceof Error ? error.message : String(error));
      }
    });

    const chapterGroups = chapterOrder.map((chapter) => ({
      chapter,
      samples: entries.filter((entry) => entry.chapter === chapter),
    }));

    const renderStats = {
      samples: entries.length,
      chapters: chapterOrder.length,
      compileErrors: errors.size,
      inventoryCount: inventory.length,
      inventoryShelves: inventoryOrder.length,
    };

    const inventoryGroups = inventoryOrder.map((shelfLabel) => ({
      shelfLabel,
      items: inventory.filter((entry) => entry.shelfLabel === shelfLabel),
    }));

    class SampleErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, message: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, message: error instanceof Error ? error.message : String(error) };
      }

      componentDidCatch(error) {
        this.setState({ hasError: true, message: error instanceof Error ? error.message : String(error) });
        if (typeof console !== "undefined" && console.error) {
          console.error("Live gallery sample error:", error);
        }
      }

      render() {
        if (this.state.hasError) {
          return this.props.fallback(this.state.message || "Unknown render error");
        }

        return this.props.children;
      }
    }

    const LiveSample = ({ entry }) => {
      const Component = renderers.get(entry.componentName);
      const error = errors.get(entry.componentName);

      return (
        <section className="sample">
          <div className="sample-head">
            <div>
              <strong>{entry.title}</strong>
              <span>{entry.chapter} - {entry.componentName}</span>
            </div>
            <a href={"../" + entry.sourcePath} target="_blank" rel="noreferrer">Open source</a>
          </div>
          <div className="sample-body">
            {Component ? (
              <SampleErrorBoundary fallback={(message) => React.createElement("div", { className: "status" }, "Render failed: ", message)}>
                <Component {...entry.props} />
              </SampleErrorBoundary>
            ) : (
              <div className="status">Render failed: {error}</div>
            )}
          </div>
        </section>
      );
    };

    const InventoryCard = ({ entry }) => (
      <article className="inventory-card">
        <div className="inventory-card-head">
          <div>
            <strong>{entry.name}</strong>
            <span>{entry.sourcePath}</span>
          </div>
          <div className={cn("inventory-pill", entry.hasLiveSample ? "" : "source")}>{entry.hasLiveSample ? "Live" : "Source"}</div>
        </div>
        <div className="text-sm leading-6 text-muted-foreground">
          {entry.shelfKey} / {entry.shelfLabel}
        </div>
        {entry.hasLiveSample ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Curated live render available</div> : <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Included in full inventory</div>}
        <a href={"../" + entry.sourcePath} target="_blank" rel="noreferrer">Open source</a>
      </article>
    );

    const App = () => (
      <div className="shell">
        <section className="hero">
          <div className="flex flex-col gap-6">
            <div>
              <p className="eyebrow">Live Gallery</p>
              <h1>Actual LandingProduct renders.</h1>
            </div>
            <p>
              This is the real thing: live React rendering for curated LandingProduct sections pulled from the stash itself. It is not a poster, not a file index, and not a fake approximation. Source remains one click away, but the primary surface is now the component output.
            </p>
            <div className="hero-stats">
              <div className="stat-pill"><strong>{renderStats.samples}</strong><span>Live samples</span></div>
              <div className="stat-pill"><strong>{renderStats.inventoryCount}</strong><span>Inventory cards</span></div>
              <div className="stat-pill"><strong>{renderStats.inventoryShelves}</strong><span>Shelves</span></div>
            </div>
          </div>
          <div className="hero-grid">
            <div className="hero-card">
              <strong>What this solves</strong>
              <span>The archive can finally be reviewed as UI, with real JSX execution and real component layout.</span>
            </div>
            <div className="hero-card">
              <strong>Current scope</strong>
              <span>Curated live samples across enterprise buying, adoption operations, and narrative systems.</span>
            </div>
            <div className="hero-card">
              <strong>Why curated first</strong>
              <span>Sample data is still required, so the honest path is to render a strong, deliberate subset instead of faking completeness.</span>
            </div>
            <div className="hero-card">
              <strong>Companion surface</strong>
              <span>Use the live proof samples for execution and the inventory browser for the full 588-component map.</span>
            </div>
          </div>
        </section>

        <div className="gallery">
          {chapterGroups.map((group) => (
            <section key={group.chapter} className="chapter">
              <div className="chapter-head">
                <strong>{group.chapter}</strong>
                <span>{group.samples.length} samples</span>
              </div>
              <div className="chapter-grid">
                {group.samples.map((entry) => <LiveSample key={entry.componentName} entry={entry} />)}
              </div>
            </section>
          ))}
        </div>

        <section className="inventory">
          <div className="inventory-head">
            <strong>Full Component Inventory</strong>
            <span>{renderStats.inventoryCount} components across {renderStats.inventoryShelves} shelves</span>
          </div>
          {inventoryGroups.map((group) => (
            <section key={group.shelfLabel} className="inventory-group">
              <div className="inventory-group-head">
                <strong>{group.shelfLabel}</strong>
                <span>{group.items.length} components</span>
              </div>
              <div className="inventory-grid">
                {group.items.map((entry) => <InventoryCard key={entry.name} entry={entry} />)}
              </div>
            </section>
          ))}
        </section>
      </div>
    );

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($OutputPath, $html, $utf8NoBom)

Write-Output "Generated live gallery html: $OutputPath"