param(
  [string]$SamplesPath = (Join-Path $PSScriptRoot "..\configs\landing-product-live-samples.json"),
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\library\landing-product-live-gallery-extreme.html")
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
  if (Test-Path $sourceFullPath) {
    $sourceMap[$sample.componentName] = [string](Get-Content -Raw -LiteralPath $sourceFullPath)
  }

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
  <title>Landing Product Live Gallery - EXTREME</title>
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

    .shell { max-width: 100%; margin: 0; padding: 0; }
    .header { padding: 32px 28px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: rgba(7,16,25,.95); backdrop-filter: blur(8px); z-index: 100; }
    .header h1 { margin: 0 0 16px; font-size: 28px; font-weight: 600; }
    .header-controls { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .search-box { flex: 1; min-width: 200px; padding: 10px 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--ink); }
    .filter-btn { padding: 8px 14px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); cursor: pointer; transition: all 0.2s; }
    .filter-btn:hover { background: rgba(255,255,255,.08); border-color: var(--accent); }
    .filter-btn.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }
    
    .stats-bar { padding: 12px 28px; background: rgba(124,209,255,.05); border-bottom: 1px solid var(--line); display: flex; gap: 24px; font-size: 12px; }
    .stat { display: flex; align-items: center; gap: 8px; }
    .stat-value { font-weight: 600; color: var(--accent); }
    
    .main { display: grid; grid-template-columns: 280px 1fr; min-height: calc(100vh - 180px); }
    .sidebar { padding: 20px; border-right: 1px solid var(--line); background: rgba(255,255,255,.02); overflow-y: auto; max-height: calc(100vh - 180px); }
    .shelf-list { display: flex; flex-direction: column; gap: 8px; }
    .shelf-item { padding: 10px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
    .shelf-item:hover { background: var(--panel); }
    .shelf-item.active { background: var(--accent); color: var(--bg); font-weight: 600; }
    
    .content { padding: 28px; overflow-y: auto; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 20px; }
    
    .sample-card { 
      border: 1px solid var(--line); 
      border-radius: 12px; 
      background: rgba(255,255,255,.03); 
      overflow: hidden; 
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
    }
    .sample-card:hover { border-color: var(--accent); background: rgba(255,255,255,.05); }
    
    .card-header { padding: 14px 16px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: start; }
    .card-title { font-weight: 600; font-size: 13px; }
    .card-tag { font-size: 10px; padding: 3px 8px; border-radius: 4px; background: rgba(124,209,255,.15); color: var(--accent); }
    
    .card-render { padding: 16px; min-height: 200px; max-height: 300px; overflow: auto; background: rgba(0,0,0,.2); border-radius: 6px; margin: 0 16px 12px; }
    .card-render > * { font-size: 13px; }
    
    .card-footer { padding: 12px 16px; border-top: 1px solid var(--line); display: flex; gap: 8px; font-size: 11px; }
    .card-btn { padding: 6px 10px; border: 1px solid var(--line); border-radius: 4px; cursor: pointer; background: var(--panel); transition: all 0.2s; }
    .card-btn:hover { background: rgba(124,209,255,.1); border-color: var(--accent); }
    
    .error-msg { color: #ff6b6b; font-size: 11px; padding: 8px; background: rgba(255,107,107,.1); border-radius: 4px; }
    
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; max-width: 600px; max-height: 80vh; overflow: auto; padding: 24px; }
    .modal-close { position: absolute; top: 16px; right: 16px; cursor: pointer; font-size: 18px; }
    
    .editor-section { margin-bottom: 16px; }
    .editor-label { font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
    .editor-input { width: 100%; padding: 8px 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); color: var(--ink); font-family: monospace; font-size: 11px; }
    
    @media (max-width: 1024px) {
      .main { grid-template-columns: 1fr; }
      .sidebar { display: none; }
      .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
    }
  </style>
</head>
<body>
  <div id="app"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo } = React;

    window.__LIVE_SAMPLE_ENTRIES__ = $entriesJson;
    window.__FULL_COMPONENT_INVENTORY__ = $inventoryJson;
    window.__SOURCE_MAP__ = $sourceJson;
    window.__COMPONENT_ERRORS__ = {};

    // Babel compiler
    const renderers = new Map();
    const entries = window.__LIVE_SAMPLE_ENTRIES__;
    const sourceMap = window.__SOURCE_MAP__;

    entries.forEach((entry) => {
      try {
        const source = sourceMap[entry.componentName];
        if (source) {
          const compiled = Babel.transform(source, {
            presets: ['react'],
            filename: entry.componentName + '.tsx'
          });
          const fn = new Function('React', 'return ' + compiled.code);
          renderers.set(entry.componentName, fn(React));
        }
      } catch (error) {
        window.__COMPONENT_ERRORS__[entry.componentName] = error.message;
      }
    });

    // Error boundary
    class SampleErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      render() {
        if (this.state.hasError) {
          return React.createElement('div', { style: { color: '#ff6b6b', fontSize: '11px', padding: '8px' } }, 
            'Render failed: ' + this.state.error.message.substring(0, 60));
        }
        return this.props.children;
      }
    }

    function SampleCard({ entry, onEdit }) {
      const Component = renderers.get(entry.componentName);
      const renderTime = useRef(0);

      useEffect(() => {
        const start = performance.now();
        return () => { renderTime.current = Math.round(performance.now() - start); };
      }, []);

      return React.createElement('div', { className: 'sample-card', key: entry.componentName },
        React.createElement('div', { className: 'card-header' },
          React.createElement('div', null,
            React.createElement('div', { className: 'card-title' }, entry.componentName),
            React.createElement('div', { className: 'card-tag' }, entry.chapter)
          )
        ),
        React.createElement('div', { className: 'card-render' },
          Component ? React.createElement(SampleErrorBoundary, null,
            React.createElement(Component, entry.props)
          ) : React.createElement('div', { className: 'error-msg' }, 'Component not found')
        ),
        React.createElement('div', { className: 'card-footer' },
          React.createElement('button', { className: 'card-btn', onClick: () => onEdit(entry) }, 'Edit Props'),
          React.createElement('button', { className: 'card-btn', onClick: () => {
            const name = entry.componentName;
            const props = JSON.stringify(entry.props, null, 2);
            const code = 'import { ' + name + ' } from \"ui_lab\";\\n\\nexport default function() {\\n  return <' + name + ' {...' + props.replace(/\n/g, '\\n') + '} />;\\n}';
            navigator.clipboard.writeText(code);
            alert('Copied to clipboard!');
          }}, 'Copy Code'),
          React.createElement('span', { style: { marginLeft: 'auto', fontSize: '10px', color: 'var(--muted)' } }, renderTime.current + 'ms')
        )
      );
    }

    function PropEditor({ entry, onClose, onUpdate }) {
      const [propsText, setPropsText] = useState(JSON.stringify(entry.props, null, 2));

      return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
        React.createElement('div', { className: 'modal', onClick: (e) => e.stopPropagation() },
          React.createElement('div', { className: 'modal-close', onClick: onClose }, '✕'),
          React.createElement('h2', null, entry.componentName + ' Props'),
          React.createElement('div', { className: 'editor-section' },
            React.createElement('label', { className: 'editor-label' }, 'Edit props as JSON:'),
            React.createElement('textarea', {
              className: 'editor-input',
              value: propsText,
              onChange: (e) => setPropsText(e.target.value),
              rows: 12,
              style: { fontFamily: 'monospace', fontSize: '11px', resize: 'vertical' }
            })
          ),
          React.createElement('button', {
            className: 'card-btn',
            onClick: () => {
              try {
                const newProps = JSON.parse(propsText);
                onUpdate(entry.componentName, newProps);
                onClose();
              } catch (e) {
                alert('Invalid JSON: ' + e.message);
              }
            },
            style: { padding: '10px 14px', marginRight: '8px' }
          }, 'Apply Changes'),
          React.createElement('button', {
            className: 'card-btn',
            onClick: onClose,
            style: { padding: '10px 14px' }
          }, 'Cancel')
        )
      );
    }

    function App() {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedShelf, setSelectedShelf] = useState(null);
      const [editingEntry, setEditingEntry] = useState(null);
      const [propsOverrides, setPropsOverrides] = useState({});

      const shelves = useMemo(() => {
        const map = new Map();
        entries.forEach(e => {
          if (!map.has(e.chapter)) map.set(e.chapter, []);
          map.get(e.chapter).push(e);
        });
        return Array.from(map.entries());
      }, []);

      const filteredEntries = useMemo(() => {
        return entries.filter(e => {
          const matchesSearch = !searchTerm || e.componentName.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesShelf = !selectedShelf || e.chapter === selectedShelf;
          return matchesSearch && matchesShelf;
        });
      }, [searchTerm, selectedShelf]);

      return React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'shell' },
          React.createElement('div', { className: 'header' },
            React.createElement('h1', null, '🚀 Landing Product Live Gallery - EXTREME'),
            React.createElement('div', { className: 'header-controls' },
              React.createElement('input', {
                type: 'text',
                className: 'search-box',
                placeholder: 'Search components...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }),
              React.createElement('button', {
                className: 'filter-btn ' + (selectedShelf ? 'active' : ''),
                onClick: () => setSelectedShelf(null)
              }, 'All (' + entries.length + ')')
            )
          ),
          React.createElement('div', { className: 'stats-bar' },
            React.createElement('div', { className: 'stat' },
              React.createElement('span', null, 'Total Components:'),
              React.createElement('span', { className: 'stat-value' }, entries.length)
            ),
            React.createElement('div', { className: 'stat' },
              React.createElement('span', null, 'Shelves:'),
              React.createElement('span', { className: 'stat-value' }, shelves.length)
            ),
            React.createElement('div', { className: 'stat' },
              React.createElement('span', null, 'Filtered:'),
              React.createElement('span', { className: 'stat-value' }, filteredEntries.length)
            ),
            React.createElement('div', { className: 'stat' },
              React.createElement('span', null, 'Render Errors:'),
              React.createElement('span', { className: 'stat-value' }, Object.keys(window.__COMPONENT_ERRORS__).length)
            )
          ),
          React.createElement('div', { className: 'main' },
            React.createElement('div', { className: 'sidebar' },
              React.createElement('div', { style: { fontSize: '11px', fontWeight: '600', marginBottom: '12px', color: 'var(--muted)' } }, 'CHAPTERS'),
              React.createElement('div', { className: 'shelf-list' },
                shelves.map(([shelf, items]) =>
                  React.createElement('div', {
                    key: shelf,
                    className: 'shelf-item ' + (selectedShelf === shelf ? 'active' : ''),
                    onClick: () => setSelectedShelf(selectedShelf === shelf ? null : shelf)
                  }, shelf + ' (' + items.length + ')')
                )
              )
            ),
            React.createElement('div', { className: 'content' },
              React.createElement('div', { className: 'gallery-grid' },
                filteredEntries.map(entry =>
                  React.createElement(SampleCard, {
                    key: entry.componentName,
                    entry: { ...entry, props: propsOverrides[entry.componentName] || entry.props },
                    onEdit: setEditingEntry
                  })
                )
              )
            )
          )
        ),
        editingEntry && React.createElement(PropEditor, {
          entry: editingEntry,
          onClose: () => setEditingEntry(null),
          onUpdate: (name, newProps) => {
            setPropsOverrides(prev => ({ ...prev, [name]: newProps }));
          }
        })
      );
    }

    ReactDOM.render(React.createElement(App), document.getElementById('app'));
  </script>
</body>
</html>
"@

Set-Content -LiteralPath $OutputPath -Value $html -Encoding UTF8

Write-Host "Generated EXTREME live gallery: $OutputPath" -ForegroundColor Green
Write-Host "Total samples: $($entries.Count)" -ForegroundColor Yellow
Write-Host "Total shelves: $(($entries | Select-Object -ExpandProperty chapter -Unique | Measure-Object).Count)" -ForegroundColor Yellow
