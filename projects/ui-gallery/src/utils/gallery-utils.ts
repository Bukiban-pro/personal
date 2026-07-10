import { FitMode, ComponentEntry } from '../types'

const UI_LAB_ROOT = (__UI_LAB_ROOT__ as string).replace(/\\/g, '/')

const MAX_CONCURRENT_IMPORTS = 8
let activeImports = 0
const importQueue: Array<() => void> = []

export function queueModuleLoad<T>(loader: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      activeImports += 1
      loader()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          activeImports -= 1
          const next = importQueue.shift()
          if (next) next()
        })
    }
    if (activeImports < MAX_CONCURRENT_IMPORTS) run()
    else importQueue.push(run)
  })
}

export function pathToShelf(path: string): string {
  const parts = path.split('/')
  const shelfIdx = parts.indexOf('shelves')
  if (shelfIdx !== -1 && parts[shelfIdx + 1]) return parts[shelfIdx + 1]
  return 'unknown'
}

export function pathToName(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1].replace('.tsx', '')
}

export function shelfLabel(key: string): string {
  return key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function sourceFsPath(entry: ComponentEntry): string {
  const rel = entry.path.replace('../../ui-patterns/', '')
  return `${UI_LAB_ROOT}/${rel.replace(/\\/g, '/')}`
}

export function getShelfFrameClass(shelf: string, fitMode: FitMode): string {
  switch (shelf) {
    case 'backgrounds-effects':
      return 'relative h-full w-full overflow-hidden'
    case 'motion-typography':
      return 'flex h-full w-full flex-col items-center justify-center bg-black/30 p-4'
    case 'interactive-showcase':
      return 'flex h-full w-full items-center justify-center p-3'
    case 'landing-marketing':
    case 'landing-product-system':
      return `h-full w-full ${fitMode === 'scroll' ? 'overflow-y-auto' : 'overflow-hidden'} [&>*]:max-w-full [&>*]:!mx-0`
    case 'feedback-state':
      return 'flex h-full w-full flex-col items-center justify-center p-5'
    case 'ui-primitives':
      return 'flex h-full w-full flex-col items-center justify-center gap-4 p-6'
    case 'forms-authoring':
      return 'flex h-full w-full flex-col items-center justify-center gap-3 p-4'
    case 'navigation-command':
      return `h-full w-full ${fitMode === 'scroll' ? 'overflow-y-auto' : 'overflow-hidden'}`
    case 'data-admin':
      return `h-full w-full p-2 ${fitMode === 'scroll' ? 'overflow-auto' : 'overflow-hidden'}`
    default:
      return 'h-full w-full p-2'
  }
}
