param(
  [string]$SamplesPath = (Join-Path $PSScriptRoot "..\configs\landing-product-live-samples.json"),
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\library\landing-product-live-gallery.html")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$sampleConfig = Get-Content -Raw -LiteralPath $SamplesPath | ConvertFrom-Json

$entries = [System.Collections.Generic.List[object]]::new()
$sourceMap = [ordered]@{}

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

$entriesJson = $entries | ConvertTo-Json -Depth 12
$sourceJson = $sourceMap | ConvertTo-Json -Depth 4

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
  </script>
  <script type="text/babel" data-presets="env,react">
    const cn = (...inputs) => inputs.filter(Boolean).join(" ");
    const entries = window.__LIVE_SAMPLE_ENTRIES__;
    const sourceMap = window.__LIVE_SOURCE_MAP__;

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
            {Component ? <Component {...entry.props} /> : <div className="status">Render failed: {error}</div>}
          </div>
        </section>
      );
    };

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
              <span>Use the static gallery for wide browse and this live gallery for actual component inspection.</span>
            </div>
          </div>
        </section>

        <div className="gallery">
          {entries.map((entry) => <LiveSample key={entry.componentName} entry={entry} />)}
        </div>
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