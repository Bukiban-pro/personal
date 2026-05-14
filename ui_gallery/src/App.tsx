import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ComponentEntry, SlotStatus, SlotIssue, HarnessMode, FitMode, PreviewSize } from './types'
import { pathToName, pathToShelf, shelfLabel } from './utils/gallery-utils'
import { ComponentCard } from './components/GalleryLayout'

const allModules = import.meta.glob<{ [key: string]: React.ComponentType<any> }>('../../ui_lab/components/shelves/**/*.tsx')

const SHELF_ORDER = [
  'landing-product-system',
  'landing-marketing',
  'ui-primitives',
  'forms-authoring',
  'navigation-command',
  'data-admin',
  'feedback-state',
  'interactive-showcase',
  'motion-typography',
  'backgrounds-effects',
]

const entries: ComponentEntry[] = Object.entries(allModules).map(([path, loader]) => ({
  path,
  name: pathToName(path),
  shelf: pathToShelf(path),
  loader,
}))

entries.sort((a, b) => {
  const ia = SHELF_ORDER.indexOf(a.shelf)
  const ib = SHELF_ORDER.indexOf(b.shelf)
  if (ia !== ib) return ia - ib
  return a.name.localeCompare(b.name)
})

const ALL_SHELVES = ['all', ...Array.from(new Set(entries.map((e) => e.shelf)))]
const ENTRY_BY_PATH = new Map(entries.map((e) => [e.path, e]))

export default function App() {
  const [search, setSearch] = useState('')
  const [activeShelf, setActiveShelf] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const mainRef = useRef<HTMLElement>(null)

  const [mode, setMode] = useState<HarnessMode>('safe')
  const [fitMode, setFitMode] = useState<FitMode>('crop')
  const [previewSize, setPreviewSize] = useState<PreviewSize>('md')
  const [freezeMotion, setFreezeMotion] = useState(false)
  const [onlyFailed, setOnlyFailed] = useState(false)

  const [statusMap, setStatusMap] = useState<Record<string, SlotStatus>>({})
  const [issueMap, setIssueMap] = useState<Record<string, SlotIssue | undefined>>({})

  const onStatus = useCallback((path: string, status: SlotStatus) => {
    setStatusMap((prev) => (prev[path] === status ? prev : { ...prev, [path]: status }))
  }, [])

  const onIssue = useCallback((path: string, issue: SlotIssue | null) => {
    setIssueMap((prev) => {
      const next = { ...prev }
      if (!issue) delete next[path]
      else next[path] = issue
      return next
    })
  }, [])

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [activeShelf, search])

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchShelf = activeShelf === 'all' || e.shelf === activeShelf
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase())
      return matchShelf && matchSearch
    })
  }, [search, activeShelf])

  const countByShelf = useMemo(() => {
    const m = new Map<string, number>()
    entries.forEach((e) => m.set(e.shelf, (m.get(e.shelf) ?? 0) + 1))
    return m
  }, [])

  const visibleEntries = useMemo(() => {
    if (!onlyFailed) return filtered
    return filtered.filter((e) => Boolean(issueMap[e.path]))
  }, [filtered, onlyFailed, issueMap])

  const diagnostics = useMemo(() => {
    const d = { idle: 0, loading: 0, ok: 0, importError: 0, runtimeError: 0 }
    for (const e of filtered) {
      const s = statusMap[e.path] ?? 'idle'
      const issue = issueMap[e.path]
      
      if (issue) {
        if (issue.type === 'import') d.importError += 1
        else if (issue.type === 'runtime') d.runtimeError += 1
      } else if (s === 'idle') {
        d.idle += 1
      } else if (s === 'loading') {
        d.loading += 1
      } else if (s === 'ok') {
        d.ok += 1
      }
    }
    return d
  }, [filtered, statusMap, issueMap])

  const fingerprintRows = useMemo(() => {
    const groups = new Map<string, { type: 'import' | 'runtime'; message: string; count: number; components: string[] }>()

    Object.entries(issueMap).forEach(([path, issue]) => {
      if (!issue) return
      const key = `${issue.type}:${issue.message}`
      const entry = ENTRY_BY_PATH.get(path)
      const componentName = entry?.name ?? pathToName(path)
      if (!groups.has(key)) {
        groups.set(key, { type: issue.type, message: issue.message, count: 0, components: [] })
      }
      const bucket = groups.get(key)!
      bucket.count += 1
      if (!bucket.components.includes(componentName) && bucket.components.length < 6) {
        bucket.components.push(componentName)
      }
    })

    return Array.from(groups.values()).sort((a, b) => b.count - a.count)
  }, [issueMap])

  const shelfHealth = useMemo(() => {
    const health = new Map<string, { ok: number; failed: number; total: number; healthPct: number }>()
    
    entries.forEach((e) => {
      const current = health.get(e.shelf) ?? { ok: 0, failed: 0, total: 0, healthPct: 0 }
      current.total += 1
      
      const issue = issueMap[e.path]
      if (issue) {
        current.failed += 1
      } else {
        const s = statusMap[e.path]
        if (s === 'ok') current.ok += 1
      }
      
      current.healthPct = current.total > 0 ? Math.round((current.ok / current.total) * 100) : 0
      health.set(e.shelf, current)
    })
    
    return health
  }, [statusMap, issueMap])

  const previewClass = previewSize === 'sm' ? 'h-[220px]' : previewSize === 'lg' ? 'h-[400px]' : 'h-[300px]'

  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground ${freezeMotion ? 'harness-freeze' : ''}`}>
      {sidebarOpen && (
        <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-border bg-card">
          <div className="border-b border-border px-4 py-4">
            <h1 className="text-sm font-bold tracking-tight text-white">UI Lab Gallery</h1>
            <p className="mt-1 text-[11px] font-medium text-emerald-400">{diagnostics.ok} of {entries.length} healthy</p>
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            {ALL_SHELVES.map((shelf) => {
              const count = shelf === 'all' ? entries.length : (countByShelf.get(shelf) ?? 0)
              const health = shelf === 'all' ? null : shelfHealth.get(shelf)
              const active = activeShelf === shelf
              const healthColor = !health ? 'text-white/60' : health.healthPct === 100 ? 'text-emerald-400' : health.healthPct >= 80 ? 'text-yellow-400' : 'text-red-400'
              
              return (
                <button
                  key={shelf}
                  onClick={() => setActiveShelf(shelf)}
                  className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-xs transition-all ${
                    active ? 'border border-white/20 bg-white/10 font-semibold text-white shadow-md' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate flex-1">{shelf === 'all' ? 'All Shelves' : shelfLabel(shelf)}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {health && <span className={`text-[10px] font-semibold ${healthColor}`}>{health.ok}/{health.total}</span>}
                    <span className={`rounded px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20' : 'bg-white/5'}`}>{count}</span>
                  </div>
                </button>
              )
            })}
          </nav>
        </aside>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-white" title="Toggle sidebar">☰</button>
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm flex-1 rounded-md border border-border bg-background/80 px-3 py-1.5 text-sm text-white placeholder-muted-foreground outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Showing</span>
            <strong className="text-white">{visibleEntries.length}</strong>
            <span>of</span>
            <strong className="text-white">{entries.length}</strong>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-black/30 px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/70">Mode</span>
            <button onClick={() => setMode('safe')} className={`rounded border px-2.5 py-1 transition-all font-medium ${mode === 'safe' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20' : 'border-border bg-white/5 text-muted-foreground hover:bg-white/10'}`}>Safe</button>
            <button onClick={() => setMode('strict')} className={`rounded border px-2.5 py-1 transition-all font-medium ${mode === 'strict' ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-sm shadow-amber-500/20' : 'border-border bg-white/5 text-muted-foreground hover:bg-white/10'}`}>Strict</button>
          </div>

          <div className="flex items-center gap-2 border-l border-border/40 pl-3">
            <span className="font-semibold text-white/70">Canvas</span>
            <button onClick={() => setPreviewSize('sm')} className={`rounded border px-2 py-1 transition-all ${previewSize === 'sm' ? 'border-sky-500/40 bg-sky-500/15 text-sky-300' : 'border-border bg-white/5 text-muted-foreground hover:bg-white/10'}`}>S</button>
            <button onClick={() => setPreviewSize('md')} className={`rounded border px-2 py-1 transition-all ${previewSize === 'md' ? 'border-sky-500/40 bg-sky-500/15 text-sky-300' : 'border-border bg-white/5 text-muted-foreground hover:bg-white/10'}`}>M</button>
            <button onClick={() => setPreviewSize('lg')} className={`rounded border px-2 py-1 transition-all ${previewSize === 'lg' ? 'border-sky-500/40 bg-sky-500/15 text-sky-300' : 'border-border bg-white/5 text-muted-foreground hover:bg-white/10'}`}>L</button>
            <button onClick={() => setFitMode((m) => (m === 'crop' ? 'scroll' : 'crop'))} className="rounded border border-border bg-white/5 px-2.5 py-1 text-muted-foreground hover:bg-white/10 transition-all">Fit: {fitMode}</button>
          </div>

          <div className="flex items-center gap-2 border-l border-border/40 pl-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white transition-colors">
              <input type="checkbox" checked={freezeMotion} onChange={(e) => setFreezeMotion(e.target.checked)} className="w-3.5 h-3.5" />
              <span className="font-medium">Freeze</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white transition-colors">
              <input type="checkbox" checked={onlyFailed} onChange={(e) => setOnlyFailed(e.target.checked)} className="w-3.5 h-3.5" />
              <span className="font-medium">Failed</span>
            </label>
          </div>

          <button
            onClick={() => {
              setStatusMap({})
              setIssueMap({})
            }}
            className="rounded border border-border bg-white/5 px-2.5 py-1 text-muted-foreground hover:bg-white/10 transition-all font-medium ml-auto"
          >
            Reset
          </button>

          <div className="flex items-center gap-3 border-l border-border/40 pl-3 text-[11px] font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400/80"></span>ok <strong>{diagnostics.ok}</strong></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400/80"></span>load <strong>{diagnostics.loading}</strong></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400/80"></span>runtime <strong>{diagnostics.runtimeError}</strong></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400/80"></span>import <strong>{diagnostics.importError}</strong></span>
          </div>
        </div>

        {fingerprintRows.length > 0 && (
          <div className="max-h-48 overflow-y-auto border-b border-border bg-red-950/15 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-300">Crash Report</span>
              <span className="ml-auto text-[10px] text-red-300/70 font-medium">{fingerprintRows.length} unique {fingerprintRows.length === 1 ? 'failure' : 'failures'}</span>
            </div>
            <div className="space-y-2">
              {fingerprintRows.slice(0, 12).map((row, i) => (
                <div key={`${row.type}-${i}`} className="rounded border border-red-900/30 bg-black/20 px-3 py-2 text-[11px] hover:border-red-900/50 transition-colors">
                  <div className="flex items-start gap-2.5 mb-1">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${row.type === 'runtime' ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/40 text-yellow-300'}`}>
                      {row.type.toUpperCase()}
                    </span>
                    <span className="text-red-200/85 flex-1 line-clamp-2">{row.message}</span>
                    <span className="text-red-300/75 font-bold whitespace-nowrap">×{row.count}</span>
                  </div>
                  {row.components.length > 0 && (
                    <div className="text-[10px] text-red-300/65 pl-1 border-l border-red-900/30 ml-2">{row.components.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <main ref={mainRef} className="flex-1 overflow-y-auto bg-background/50">
          <div className="p-5">
            {activeShelf === 'all'
              ? SHELF_ORDER.filter((s) => countByShelf.has(s)).map((shelf) => {
                  const shelfEntries = visibleEntries.filter((e) => e.shelf === shelf)
                  if (shelfEntries.length === 0) return null
                  const health = shelfHealth.get(shelf)
                  return (
                    <section key={shelf} className="mb-12">
                      <div className="mb-5 flex items-center gap-3 border-b border-border/30 pb-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">{shelfLabel(shelf)}</h2>
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">{shelfEntries.length}</span>
                        {health && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            health.healthPct === 100 ? 'bg-emerald-500/15 text-emerald-300' :
                            health.healthPct >= 80 ? 'bg-yellow-500/15 text-yellow-300' :
                            'bg-red-500/15 text-red-300'
                          }`}>
                            {health.ok}/{health.total} healthy
                          </span>
                        )}
                        <div className="flex-1 border-t border-border/20" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {shelfEntries.map((entry) => (
                          <ComponentCard
                            key={entry.path}
                            entry={entry}
                            mode={mode}
                            fitMode={fitMode}
                            previewClass={previewClass}
                            scrollRoot={mainRef}
                            onStatus={onStatus}
                            onIssue={onIssue}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })
              : (
                <div>
                  <div className="mb-5 flex items-center gap-3 pb-3 border-b border-border/30">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">{shelfLabel(activeShelf)}</h2>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">{visibleEntries.length}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {visibleEntries.map((entry) => (
                      <ComponentCard
                        key={entry.path}
                        entry={entry}
                        mode={mode}
                        fitMode={fitMode}
                        previewClass={previewClass}
                        scrollRoot={mainRef}
                        onStatus={onStatus}
                        onIssue={onIssue}
                      />
                    ))}
                  </div>
                </div>
              )}

            {visibleEntries.length === 0 && (
              <div className="flex h-96 flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="text-4xl opacity-20">○</div>
                <p className="text-sm font-medium">{onlyFailed ? 'No failed components found' : 'No components match your search'}</p>
                {onlyFailed && (
                  <button
                    onClick={() => setOnlyFailed(false)}
                    className="text-xs px-3 py-1.5 rounded border border-border bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    Show all components
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
