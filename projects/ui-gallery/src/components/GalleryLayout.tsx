import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ComponentEntry, HarnessMode, SlotStatus, SlotIssue, FitMode } from '../types'
import { queueModuleLoad, sourceFsPath, shelfLabel, getShelfFrameClass } from '../utils/gallery-utils'
import { withHarnessDefaults } from '../utils/gallery-enrichment'
import { sampleProps } from '../data/sample-props'
import { ErrorBoundary } from './ErrorBoundary'

export function LazyComponentSlot({
  entry,
  mode,
  scrollRoot,
  onStatus,
  onIssue,
}: {
  entry: ComponentEntry
  mode: HarnessMode
  scrollRoot?: React.RefObject<HTMLElement>
  onStatus: (path: string, status: SlotStatus) => void
  onIssue: (path: string, issue: SlotIssue | null) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null)
  const [CompProvider, setCompProvider] = useState<React.ComponentType<any> | null>(null)
  const [importErr, setImportErr] = useState<string | null>(null)
  const [runtimeErr, setRuntimeErr] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([obs]) => {
        if (obs.isIntersecting) {
          onStatus(entry.path, 'loading')
          setInView(true)
          observer.disconnect()
        }
      },
      { root: scrollRoot?.current ?? null, rootMargin: '280px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [entry.path, onStatus, scrollRoot])

  useEffect(() => {
    if (!inView) return

    queueModuleLoad(entry.loader)
      .then((mod) => {
        const isReactComponent = (v: unknown): boolean => {
          if (typeof v === 'function') return true
          if (v && typeof v === 'object') {
            const obj = v as Record<string, unknown>
            if (obj.$$typeof) return true
            if (typeof obj.render === 'function') return true
          }
          return false
        }

        const candidates = Object.entries(mod).filter(
          ([key, val]) => {
            if (key === 'default' || key.startsWith('__') || !/^[A-Z]/.test(key)) return false
            if (!isReactComponent(val)) return false
            if (typeof val === 'function' && (val as Function).constructor?.name === 'AsyncFunction') return false
            return true
          },
        )

        if (candidates.length > 0) {
          const preferred = candidates.find(([key]) => key === entry.name) ?? candidates[0]
          setComp(() => preferred[1] as React.ComponentType<any>)
          const providerEntry = candidates.find(([key]) => key.endsWith('Provider'))
          if (providerEntry && providerEntry[0] !== candidates[0][0]) {
            setCompProvider(() => providerEntry[1] as React.ComponentType<any>)
          }
          setImportErr(null)
          onIssue(entry.path, null)
          return
        }

        if (mod.default && isReactComponent(mod.default)) {
          setComp(() => mod.default as React.ComponentType<any>)
          if ((mod as any).NotificationProvider) setCompProvider(() => (mod as any).NotificationProvider as React.ComponentType<any>)
          setImportErr(null)
          onIssue(entry.path, null)
          return
        }

        const message = 'No component export found'
        setImportErr(message)
        onStatus(entry.path, 'import-error')
        onIssue(entry.path, { type: 'import', message })
      })
      .catch((err) => {
        const message = String(err)
        setImportErr(message)
        onStatus(entry.path, 'import-error')
        onIssue(entry.path, { type: 'import', message })
      })
  }, [entry, inView, onIssue, onStatus])

  useEffect(() => {
    if (Comp && !importErr && !runtimeErr) onStatus(entry.path, 'ok')
  }, [Comp, importErr, runtimeErr, entry.path, onStatus])

  if (!inView) {
    return <div ref={containerRef} className="h-full min-h-[120px] animate-pulse rounded bg-white/5" />
  }

  if (importErr) {
    return (
      <div ref={containerRef} className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 rounded border border-dashed border-yellow-900 bg-yellow-950/20 p-2 text-center">
        <span className="text-[10px] font-semibold text-yellow-500">Import error</span>
        <span className="max-w-[260px] break-words text-[9px] leading-tight text-yellow-500/80">{importErr}</span>
      </div>
    )
  }

  if (!Comp) {
    return (
      <div ref={containerRef} className="flex h-full min-h-[120px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
      </div>
    )
  }

  const baseProps = sampleProps.get(entry.name) ?? {}
  const compProps = mode === 'safe' ? withHarnessDefaults(baseProps, entry.name, entry.shelf) : baseProps

  const onRuntime = (message: string) => {
    setRuntimeErr(message)
    onStatus(entry.path, 'runtime-error')
    onIssue(entry.path, { type: 'runtime', message })
  }

  return (
    <div ref={containerRef} className="h-full">
      <ErrorBoundary key={`${entry.path}-${mode}`} name={entry.name} onError={onRuntime}>
        {CompProvider
          ? React.createElement(CompProvider, { children: React.createElement(Comp, compProps) })
          : <Comp {...compProps} />}
      </ErrorBoundary>
      {runtimeErr && mode === 'strict' && (
        <div className="mt-1 px-2 pb-2 text-[10px] text-red-400/80">Strict mode: {runtimeErr}</div>
      )}
    </div>
  )
}

export function ComponentCard({
  entry,
  mode,
  previewClass,
  fitMode,
  scrollRoot,
  onStatus,
  onIssue,
}: {
  entry: ComponentEntry
  mode: HarnessMode
  previewClass: string
  fitMode: FitMode
  scrollRoot?: React.RefObject<HTMLElement>
  onStatus: (path: string, status: SlotStatus) => void
  onIssue: (path: string, issue: SlotIssue | null) => void
}) {
  const [seed, setSeed] = useState(0)
  const [copied, setCopied] = useState(false)

  const fsPath = sourceFsPath(entry)

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(fsPath)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 900)
    } catch {
      setCopied(false)
    }
  }

  const openSource = () => {
    const url = `${window.location.origin}/@fs/${fsPath}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-white/30 hover:shadow-md hover:shadow-black/50">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-gradient-to-r from-black/40 to-transparent px-3 py-2.5">
        <span className="truncate text-xs font-bold text-white/85" title={entry.name}>{entry.name}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setSeed((s) => s + 1)} className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all" title="Reload component">Retry</button>
          <button onClick={copyPath} className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all" title="Copy file path">{copied ? '✓ Copied' : 'Path'}</button>
          <button onClick={openSource} className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all" title="Open in editor">Src</button>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/50">{shelfLabel(entry.shelf).split(' ')[0]}</span>
        </div>
      </div>
      <div className={`component-frame ${previewClass} bg-black/20`}>
        <div className={getShelfFrameClass(entry.shelf, fitMode)}>
          <LazyComponentSlot key={`${entry.path}-${mode}-${seed}`} entry={entry} mode={mode} scrollRoot={scrollRoot} onStatus={onStatus} onIssue={onIssue} />
        </div>
      </div>
    </div>
  )
}
