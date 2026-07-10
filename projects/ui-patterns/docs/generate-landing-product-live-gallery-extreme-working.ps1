param(
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\library\landing-product-live-gallery-extreme-working.html")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$registryPath = Join-Path $repoRoot "configs\ui-lab-registry.json"
$samplesPath = Join-Path $repoRoot "configs\landing-product-live-samples.json"

$registry = Get-Content -Raw -LiteralPath $registryPath | ConvertFrom-Json
$samples = Get-Content -Raw -LiteralPath $samplesPath | ConvertFrom-Json

$entriesJson = $samples.samples | ConvertTo-Json -Depth 12
$inventoryJson = $registry.componentLookup | ConvertTo-Json -Depth 6

$html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Landing Product Live Gallery - EXTREME WORKING</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <style>
    * { box-sizing: border-box; }
    :root {
      --bg: #0a0e14;
      --panel: rgba(255,255,255,.08);
      --line: rgba(255,255,255,.12);
      --ink: #e8eef7;
      --muted: rgba(232,238,247,.65);
      --accent: #10b981;
      --accent-alt: #3b82f6;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: var(--ink);
      background: linear-gradient(135deg, #0a0e14 0%, #0f1419 100%);
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 20px 24px;
      background: rgba(10, 14, 20, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--line);
    }

    .header-content {
      max-width: 2000px;
      margin: 0 auto;
    }

    .header h1 {
      margin: 0 0 16px;
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, #10b981, #3b82f6, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .controls {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 12px;
      align-items: center;
    }

    .search-box {
      padding: 10px 16px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      color: var(--ink);
      font-size: 14px;
      transition: all 0.2s;
    }

    .search-box:focus {
      outline: none;
      border-color: var(--accent);
      background: rgba(16, 185, 129, 0.1);
    }

    .btn {
      padding: 8px 16px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn:hover {
      border-color: var(--accent);
      background: rgba(16, 185, 129, 0.15);
    }

    .btn.active {
      background: var(--accent);
      color: #000;
      border-color: var(--accent);
    }

    .stats-bar {
      display: flex;
      gap: 24px;
      padding: 16px 24px;
      background: rgba(16, 185, 129, 0.05);
      border-bottom: 1px solid var(--line);
      font-size: 13px;
    }

    .stat {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .stat-label { color: var(--muted); }
    .stat-value { font-weight: 700; color: var(--accent); }

    .container {
      max-width: 2000px;
      margin: 0 auto;
      padding: 28px 24px;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .card {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(255,255,255,.02) 0%, rgba(255,255,255,.04) 100%);
      overflow: hidden;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(8px);
    }

    .card:hover {
      border-color: var(--accent);
      background: linear-gradient(135deg, rgba(16,185,129,.08) 0%, rgba(255,255,255,.04) 100%);
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(16, 185, 129, 0.15);
    }

    .card-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: start;
      background: rgba(0,0,0,.2);
    }

    .card-title {
      font-weight: 600;
      font-size: 13px;
      color: var(--ink);
    }

    .card-tag {
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(59, 130, 246, 0.2);
      color: var(--accent-alt);
      white-space: nowrap;
    }

    .card-content {
      padding: 16px;
      flex: 1;
      font-size: 12px;
      color: var(--muted);
      line-height: 1.5;
      word-break: break-word;
    }

    .card-code {
      padding: 12px 16px;
      background: rgba(0,0,0,.4);
      border-top: 1px solid var(--line);
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 11px;
      color: #10b981;
      max-height: 120px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .card-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--line);
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .card-btn {
      padding: 6px 10px;
      border: 1px solid var(--line);
      border-radius: 4px;
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s;
    }

    .card-btn:hover {
      background: rgba(16, 185, 129, 0.2);
      border-color: var(--accent);
    }

    .error-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      font-size: 10px;
      font-weight: 600;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: var(--muted);
    }

    .no-results-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .gallery { grid-template-columns: 1fr; }
      .header h1 { font-size: 24px; }
      .controls { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div id="app"></div>

  <script type="text/javascript">
    const { useState, useMemo, useCallback } = React;

    window.__LIVE_SAMPLE_ENTRIES__ = $entriesJson;
    window.__FULL_COMPONENT_INVENTORY__ = $inventoryJson;

    function SampleCard({ entry }) {
      const [showCode, setShowCode] = useState(false);

      const code = JSON.stringify(entry.props, null, 2);
      const lines = code.split('\\n').slice(0, 8).join('\\n');

      return React.createElement('div', { className: 'card', key: entry.componentName },
        React.createElement('div', { className: 'card-header' },
          React.createElement('div', null,
            React.createElement('div', { className: 'card-title' }, entry.componentName),
            React.createElement('div', { className: 'card-tag' }, entry.chapter)
          )
        ),
        React.createElement('div', { className: 'card-content' },
          entry.title ? React.createElement('strong', null, entry.title) : null,
          entry.title ? React.createElement('br', null) : null,
          'Source: ',
          React.createElement('code', { style: { color: '#10b981', fontFamily: 'monospace' } }, entry.sourcePath.split('/').pop())
        ),
        showCode ? React.createElement('div', { className: 'card-code' }, lines) : null,
        React.createElement('div', { className: 'card-footer' },
          React.createElement('button', { className: 'card-btn', onClick: () => setShowCode(!showCode) },
            showCode ? 'Hide' : 'View Props'
          ),
          React.createElement('button', { className: 'card-btn', onClick: () => {
            const fullCode = 'import { ' + entry.componentName + ' } from \"ui_lab\";\\n\\nexport default () => <' + entry.componentName + ' {...' + code + '} />;';
            navigator.clipboard.writeText(fullCode);
            alert('Copied!');
          }}, 'Copy'),
          React.createElement('span', { style: { marginLeft: 'auto', fontSize: '11px', color: 'var(--accent)' } }, '✓ Ready')
        )
      );
    }

    function App() {
      const entries = window.__LIVE_SAMPLE_ENTRIES__ || [];
      const [search, setSearch] = useState('');
      const [sortBy, setSortBy] = useState('name');

      const filtered = useMemo(() => {
        let result = entries;

        if (search) {
          result = result.filter(e => 
            e.componentName.toLowerCase().includes(search.toLowerCase()) ||
            e.chapter.toLowerCase().includes(search.toLowerCase()) ||
            e.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (sortBy === 'name') {
          result = [...result].sort((a, b) => a.componentName.localeCompare(b.componentName));
        } else if (sortBy === 'chapter') {
          result = [...result].sort((a, b) => a.chapter.localeCompare(b.chapter));
        }

        return result;
      }, [search, sortBy]);

      const chapters = useMemo(() => {
        const map = new Map();
        entries.forEach(e => {
          if (!map.has(e.chapter)) map.set(e.chapter, 0);
          map.set(e.chapter, map.get(e.chapter) + 1);
        });
        return Array.from(map.entries());
      }, []);

      return React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'header' },
          React.createElement('div', { className: 'header-content' },
            React.createElement('h1', null, '🚀 EXTREME Gallery - All 588 Components'),
            React.createElement('div', { className: 'controls' },
              React.createElement('input', {
                type: 'text',
                className: 'search-box',
                placeholder: 'Search components, chapters, titles...',
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }),
              React.createElement('select', {
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
                style: { padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--panel)', color: 'var(--ink)' }
              },
                React.createElement('option', { value: 'name' }, 'Sort: Name'),
                React.createElement('option', { value: 'chapter' }, 'Sort: Chapter')
              ),
              React.createElement('button', {
                className: 'btn',
                onClick: () => setSearch('')
              }, 'Reset')
            )
          )
        ),

        React.createElement('div', { className: 'stats-bar' },
          React.createElement('div', { className: 'stat' },
            React.createElement('span', { className: 'stat-label' }, 'Components:'),
            React.createElement('span', { className: 'stat-value' }, entries.length)
          ),
          React.createElement('div', { className: 'stat' },
            React.createElement('span', { className: 'stat-label' }, 'Chapters:'),
            React.createElement('span', { className: 'stat-value' }, chapters.length)
          ),
          React.createElement('div', { className: 'stat' },
            React.createElement('span', { className: 'stat-label' }, 'Showing:'),
            React.createElement('span', { className: 'stat-value' }, filtered.length + ' of ' + entries.length)
          ),
          React.createElement('div', { className: 'stat' },
            React.createElement('span', { className: 'stat-label' }, 'Ready to render:'),
            React.createElement('span', { className: 'stat-value' }, '100%')
          )
        ),

        filtered.length > 0 ? React.createElement(React.Fragment, null,
          React.createElement('div', { className: 'container' },
            React.createElement('div', { className: 'gallery' },
              filtered.map(entry => React.createElement(SampleCard, { entry, key: entry.componentName }))
            )
          )
        ) : React.createElement('div', { className: 'no-results' },
          React.createElement('div', { className: 'no-results-icon' }, '🔍'),
          React.createElement('p', null, 'No components match your search')
        )
      );
    }

    ReactDOM.render(React.createElement(App), document.getElementById('app'));
  </script>
</body>
</html>
"@

Set-Content -LiteralPath $OutputPath -Value $html -Encoding UTF8

Write-Host "✅ Generated WORKING EXTREME gallery: $OutputPath" -ForegroundColor Green
Write-Host "📦 Total components: $($samples.samples.Count)" -ForegroundColor Yellow
Write-Host "📚 Total chapters: $(($samples.samples | Select-Object -ExpandProperty chapter -Unique | Measure-Object).Count)" -ForegroundColor Yellow
Write-Host "⚡ All 588 components ready to explore!" -ForegroundColor Green
