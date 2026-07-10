/**
 * Scans all component TSX files, parses their Props interface,
 * and generates sample data. Writes to projects/ui-patterns/configs/auto-samples.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHELVES_DIR = path.resolve(__dirname, '../../ui-patterns/components/shelves')
const OUTPUT_FILE = path.resolve(__dirname, '../../ui-patterns/configs/auto-samples.json')

// ── Collect all TSX files ──────────────────────────────────────────────────
function getAllTsx(dir) {
  const result = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...getAllTsx(full))
    else if (entry.name.endsWith('.tsx')) result.push(full)
  }
  return result
}

// ── Parse interfaces from file text ───────────────────────────────────────
function parseInterfaces(src) {
  const interfaces = {}
  // Match: interface Name { ... } or interface Name extends Xxx { ... }
  // Match exported AND non-exported interfaces
  const ifaceRe = /(?:export\s+)?interface\s+(\w+)(?:\s+extends[^{]*)?\s*\{([^}]*)\}/gs
  let m
  while ((m = ifaceRe.exec(src)) !== null) {
    const name = m[1]
    const body = m[2]
    const fields = parseFields(body)
    interfaces[name] = fields
  }
  // Also match type aliases: type Foo = { ... }
  const typeRe = /(?:export\s+)?type\s+(\w+)\s*=\s*\{([^}]*)\}/gs
  let m2
  while ((m2 = typeRe.exec(src)) !== null) {
    interfaces[m2[1]] = parseFields(m2[2])
  }
  return interfaces
}

function parseFields(body) {
  const fields = []
  // Each field: name?: type; or name: type;
  const fieldRe = /(\w+)(\?)?\s*:\s*([^;\n]+)/g
  let m
  while ((m = fieldRe.exec(body)) !== null) {
    fields.push({ name: m[1], optional: !!m[2], type: m[3].trim().replace(/;$/, '') })
  }
  return fields
}

// ── Find the main component Props interface ───────────────────────────────
function findPropsInterface(src, interfaces) {
  // Look for the exported component name to guess the props interface name
  const exportMatch = src.match(/export\s+(?:const|function|class)\s+([A-Z]\w+)/)
  if (!exportMatch) return null
  const compName = exportMatch[1]
  const propsName = compName + 'Props'
  if (interfaces[propsName]) return { name: propsName, fields: interfaces[propsName] }
  // Fallback: find any interface ending in Props
  for (const [name, fields] of Object.entries(interfaces)) {
    if (name.endsWith('Props')) return { name, fields }
  }
  return null
}

// ── Generate sample value for a type ─────────────────────────────────────
function sampleForType(typeName, fieldName, interfaces, stack = new Set()) {
  const t = typeName.trim()

  // React.ReactNode / ReactNode / React.ComponentType → skip (return undefined, will use JSX default)
  if (/ReactNode|ComponentType|JSX\.Element|ElementType|CSSProperties/.test(t)) return undefined

  // Literal union: "a" | "b" | "c" → first option
  if (/^["']/.test(t)) {
    const first = t.match(/["']([^"']+)["']/)
    return first ? first[1] : t.replace(/["']/g, '').split('|')[0].trim()
  }

  // boolean
  if (t === 'boolean') return false

  // number
  if (t === 'number') return 42

  // string-ish field names
  if (t === 'string') return guessStringValue(fieldName)

  // Arrays: SomeType[]
  const arrayMatch = t.match(/^(\w[\w.]*)\[\]$/) || t.match(/^Array<(\w[\w.]*)>$/)
  if (arrayMatch) {
    const itemType = arrayMatch[1]
    if (interfaces[itemType]) {
      // Generate 3 sample items
      return [
        generateFromInterface(itemType, interfaces, 1, stack),
        generateFromInterface(itemType, interfaces, 2, stack),
        generateFromInterface(itemType, interfaces, 3, stack),
      ]
    }
    // Primitive arrays
    if (itemType === 'string') return ['Alpha', 'Beta', 'Gamma']
    if (itemType === 'number') return [1, 2, 3]
    return []
  }

  // Inline object: { label: string; href?: string }
  if (t.startsWith('{')) return parseInlineObject(t, fieldName, interfaces, stack)

  // Known interface
  if (interfaces[t]) return generateFromInterface(t, interfaces, 1, stack)

  // Union types with objects: look for first non-string alternative
  if (t.includes('|')) {
    const parts = t.split('|').map(p => p.trim()).filter(p => !/^["']/.test(p) && p !== 'null' && p !== 'undefined')
    if (parts.length > 0) return sampleForType(parts[0], fieldName, interfaces, stack)
    return undefined
  }

  return undefined
}

function guessStringValue(name) {
  const n = name.toLowerCase()
  if (n.includes('title') || n.includes('heading') || n.includes('name')) return 'Sample Title'
  if (n.includes('description') || n.includes('subtitle') || n.includes('caption') || n.includes('summary')) return 'A brief description of this feature.'
  if (n.includes('label')) return 'Sample Label'
  if (n.includes('text') || n.includes('copy') || n.includes('message') || n.includes('content')) return 'Sample text'
  if (n.includes('href') || n.includes('url') || n.includes('link') || n.includes('src')) return '#'
  if (n.includes('icon') || n.includes('image') || n.includes('img') || n.includes('avatar') || n.includes('logo')) return 'https://placehold.co/40x40/1f2937/6b7280?text=img'
  if (n.includes('color') || n.includes('colour')) return '#6366f1'
  if (n.includes('class')) return ''
  if (n.includes('id') || n.includes('key')) return 'item-1'
  if (n.includes('tag') || n.includes('badge')) return 'New'
  if (n.includes('category') || n.includes('type') || n.includes('variant')) return 'Default'
  if (n.includes('trigger') || n.includes('detail') || n.includes('note')) return 'Detail info'
  if (n.includes('action') || n.includes('cta') || n.includes('button')) return 'Get Started'
  if (n.includes('role') || n.includes('position') || n.includes('job')) return 'Product Manager'
  if (n.includes('company') || n.includes('organization') || n.includes('team')) return 'Acme Corp'
  if (n.includes('author') || n.includes('user') || n.includes('person') || n.includes('member')) return 'Alex Johnson'
  if (n.includes('email')) return 'hello@example.com'
  if (n.includes('phone')) return '+1 (555) 000-0000'
  if (n.includes('date') || n.includes('time')) return '2025-01-01'
  if (n.includes('stat') || n.includes('metric') || n.includes('count') || n.includes('value')) return '99%'
  return 'Sample text'
}

function isComplexType(typeName) {
  const t = typeName.trim()
  if (t.includes('[]') || t.startsWith('{') || t.includes('|')) return true
  if (/^Array<.+>$/.test(t)) return true
  if (/RefObject|MutableRefObject/.test(t)) return true
  if (/^[A-Z]\w*$/.test(t)) return true
  return false
}

function parseInlineObject(t, fieldName, interfaces, stack = new Set()) {
  const body = t.replace(/^\{/, '').replace(/\}$/, '')
  const fields = parseFields(body)
  const result = {}
  for (const f of fields) {
    if (f.optional) continue
    const v = sampleForType(f.type, f.name, interfaces, stack)
    if (v !== undefined) result[f.name] = v
  }
  // For action objects, always add label + href
  if (fieldName.toLowerCase().includes('action') || fieldName.toLowerCase().includes('cta')) {
    result.label = result.label || 'Get Started'
    result.href = result.href || '#'
  }
  return result
}

function generateFromInterface(typeName, interfaces, index = 1, stack = new Set()) {
  if (stack.has(typeName)) return {}
  stack.add(typeName)
  const fields = interfaces[typeName]
  if (!fields) {
    stack.delete(typeName)
    return {}
  }
  const result = {}
  for (const f of fields) {
    const includeOptional = isSemanticallyImportant(f.name) || isComplexType(f.type)
    if (f.optional && !includeOptional) continue
    const v = sampleForType(f.type, f.name, interfaces, stack)
    if (v !== undefined) {
      // Add uniqueness by index for list-generated rows to reduce duplicate key warnings.
      const keyLike = /href|url|src|image|icon|class|style/i.test(f.name)
      if (typeof v === 'string' && index > 0 && !keyLike) {
        result[f.name] = `${v} ${index}`
      } else {
        result[f.name] = v
      }
    }
  }
  stack.delete(typeName)
  return result
}

function isSemanticallyImportant(name) {
  return /title|name|label|description|href|url|icon|image|avatar|src|text|message|content|value|placeholder|headline|copy/.test(name.toLowerCase())
}

// ── Main processing ───────────────────────────────────────────────────────
const files = getAllTsx(SHELVES_DIR)
const output = {}

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const componentName = path.basename(file, '.tsx')
  const interfaces = parseInterfaces(src)
  const propsInfo = findPropsInterface(src, interfaces)
  
  if (!propsInfo) {
    output[componentName] = {}
    continue
  }
  
  const sampleData = {}
  for (const f of propsInfo.fields) {
    const includeOptional = isSemanticallyImportant(f.name) || isComplexType(f.type)
    if (f.optional && !includeOptional) continue
    // Skip React.HTMLAttributes extensions (className, id, style etc.)
    if (['className','id','style','role','ref','key','tabIndex','onClick','onFocus','onBlur',
         'onMouseEnter','onMouseLeave','onMouseDown','onMouseUp','onKeyDown','onKeyUp',
         'aria-label','aria-hidden','data-testid'].includes(f.name)) continue
    const v = sampleForType(f.type, f.name, interfaces)
    if (v !== undefined) sampleData[f.name] = v
  }
  
  output[componentName] = sampleData
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
console.log(`Generated samples for ${Object.keys(output).length} components → ${OUTPUT_FILE}`)
console.log('Preview of first 3:')
const entries = Object.entries(output).slice(0, 3)
for (const [name, props] of entries) {
  console.log(`  ${name}:`, JSON.stringify(props).slice(0, 120))
}
