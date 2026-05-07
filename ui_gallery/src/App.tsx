import React, { useCallback, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react'
import samplesRaw from '../../ui_lab/configs/landing-product-live-samples.json'
import autoSamplesRaw from '../../ui_lab/configs/auto-samples.json'

interface SampleEntry {
  componentName: string
  sourcePath: string
  props: Record<string, unknown>
}

interface ComponentEntry {
  path: string
  name: string
  shelf: string
  loader: () => Promise<{ [key: string]: React.ComponentType<any> }>
}

type SlotStatus = 'idle' | 'loading' | 'ok' | 'import-error' | 'runtime-error'
type HarnessMode = 'safe' | 'strict'
type FitMode = 'crop' | 'scroll'
type PreviewSize = 'sm' | 'md' | 'lg'

type SlotIssue = {
  type: 'import' | 'runtime'
  message: string
}

const UI_LAB_ROOT = (__UI_LAB_ROOT__ as string).replace(/\\/g, '/')

const samples: SampleEntry[] = (samplesRaw as { samples: SampleEntry[] }).samples
const autoSamples = autoSamplesRaw as Record<string, Record<string, unknown>>
const liveSamples = new Map<string, Record<string, unknown>>(samples.map((s) => [s.componentName, s.props]))
const sampleProps = new Map<string, Record<string, unknown>>(
  Object.entries(autoSamples).map(([name, props]) => [name, { ...props, ...(liveSamples.get(name) ?? {}) }]),
)

const allModules = import.meta.glob<{ [key: string]: React.ComponentType<any> }>('../../ui_lab/components/shelves/**/*.tsx')

const MAX_CONCURRENT_IMPORTS = 8
let activeImports = 0
const importQueue: Array<() => void> = []

function queueModuleLoad<T>(loader: () => Promise<T>): Promise<T> {
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

function pathToShelf(path: string): string {
  const parts = path.split('/')
  const shelfIdx = parts.indexOf('shelves')
  if (shelfIdx !== -1 && parts[shelfIdx + 1]) return parts[shelfIdx + 1]
  return 'unknown'
}

function pathToName(path: string): string {
  const parts = path.split('/')
  return parts[parts.length - 1].replace('.tsx', '')
}

function shelfLabel(key: string): string {
  return key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

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

function sourceFsPath(entry: ComponentEntry): string {
  const rel = entry.path.replace('../../ui_lab/', '')
  return `${UI_LAB_ROOT}/${rel.replace(/\\/g, '/')}`
}

interface EBProps {
  name: string
  children: ReactNode
  onError?: (message: string) => void
}
interface EBState {
  hasError: boolean
  message: string
}

class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message?.slice(0, 160) || 'Render error' }
  }
  componentDidCatch(err: Error) {
    this.props.onError?.(err.message?.slice(0, 220) || 'Render error')
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 rounded border border-dashed border-red-900 bg-red-950/20 p-3 text-center">
          <span className="text-xs font-semibold text-red-400">Runtime error</span>
          <span className="max-w-[260px] break-words text-[10px] leading-tight text-red-400/75">{this.state.message}</span>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Shelf-aware preview frame ──────────────────────────────────────────────
function getShelfFrameClass(shelf: string, fitMode: FitMode): string {
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

// ─── Rich demo content factories (JSX in a .tsx file is fine) ────────────────
const _demoCardContent = (name: string) => (
  <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
    <div className="text-2xl opacity-80">✦</div>
    <p className="text-sm font-bold text-white/90">{name}</p>
    <p className="text-[11px] text-white/45">Hover to interact</p>
  </div>
)

const _demoHeroBg = (name: string) => (
  <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
    <p className="text-xl font-bold tracking-tight text-white/90">{name}</p>
    <p className="text-xs text-white/50">Background effect</p>
  </div>
)

// ─── Nexus brand vocabulary (enriches all 321 LandingProduct* components) ────
// Nexus = B2B Revenue Intelligence Platform — "The OS for revenue teams"
const _nx = {
  features: [
    'Pipeline Intelligence', 'Forecast Automation', 'Deal Execution', 'Territory Planning',
    'Account Expansion', 'Customer Health', 'Revenue Analytics', 'GTM Alignment',
    'Quota Management', 'Win Rate Intelligence', 'Churn Prevention', 'Board Reporting',
    'Stakeholder Alignment', 'Competitive Positioning', 'Renewal Automation', 'Revenue Capacity',
  ],
  descriptions: [
    'AI-powered signals that surface deal risk before it becomes revenue loss.',
    'Connect sales, CS, and finance in a single unified revenue motion view.',
    'From first touch to closed-won — every signal, every stakeholder, one platform.',
    'Replace gut-check forecasting with confidence-scored pipeline intelligence.',
    'Align every buying committee member before procurement slows you down.',
    'Surface expansion opportunities before your competitors find the whitespace.',
    "Your revenue team's single source of truth — from forecast to boardroom.",
    'Close the gap between what sales reports and what finance believes.',
  ],
  metricLabels: [
    'Forecast Accuracy', 'Pipeline Coverage', 'Win Rate', 'Time to Close',
    'ARR Growth', 'Net Revenue Retention', 'CAC Payback', 'Deal Velocity',
    'Quota Attainment', 'Expansion Revenue', 'Ramp Time', 'Churn Rate',
  ],
  metricValues: [
    '94%', '3.2×', '68%', '42 days', '$4.7M', '118%', '14 mo', '+23%',
    '102%', '$340k', '45 days', '1.8%',
  ],
  impactValues: [
    '+34% revenue uplift', '$2.3M pipeline recovered', '3× faster close cycle',
    '18pp win rate lift', '$48k ARR/rep/yr', '94% forecast accuracy',
    '−12 days to close', '2.1× net revenue retention',
  ],
  workItems: [
    'Verify pipeline coverage across all segments', 'Score deal engagement depth',
    'Track multi-threaded buying committee relationships', 'Automate forecast confidence scoring',
    'Monitor churn risk signals in real time', 'Map expansion and whitespace opportunities',
    'Align stakeholders before procurement starts', 'Synthesize competitive battlecard data',
    'Audit sales activity compliance', 'Generate executive performance briefings',
    'Quantify revenue impact per territory', 'Identify at-risk accounts proactively',
    'Enforce deal review hygiene', 'Surface intent signals from dark pipeline',
  ],
  teams: ['Revenue Operations', 'Sales Leadership', 'Customer Success', 'Finance & FP&A', 'Marketing', 'Product & Engineering'],
  personas: ['CRO', 'VP of Sales', 'RevOps Director', 'Account Executive', 'Customer Success Manager', 'CFO'],
  partnerNames: ['Salesforce', 'HubSpot', 'Gong', 'Outreach', 'Clari', 'ZoomInfo', 'LinkedIn Sales Nav', 'Marketo'],
  regions: ['North America', 'EMEA', 'APAC', 'LATAM'],
  objections: [
    "We already have a CRM — why do we need this?",
    "The implementation timeline looks risky.",
    "We're concerned about data security and residency.",
    "How does this integrate with our existing stack?",
    "What's the ROI timeline? We need quick wins.",
    "Will our sales team actually adopt it?",
  ],
  objectionAnswers: [
    "Nexus sits on top of your CRM — it enriches what you have, not replaces it.",
    "Average deployment is 3 weeks, fully managed by your dedicated CSM.",
    "SOC 2 Type II certified, GDPR compliant, data residency in your cloud region.",
    "Pre-built connectors for 60+ GTM tools. API-first for custom integrations.",
    "Customers see measurable forecast improvement within 30 days of go-live.",
    "Nexus adapts to existing workflows. Most reps are productive within a week.",
  ],
  checkpoints: [
    { title: 'Legal & Security Review', description: 'SOC 2 Type II, DPA, and GDPR questionnaire completed.' },
    { title: 'IT & Integration Signoff', description: 'CRM connector validated in sandbox environment.' },
    { title: 'Business Sponsor Alignment', description: 'Executive sponsor confirmed, success criteria agreed.' },
    { title: 'Rollout Plan Approved', description: 'Phased deployment schedule locked with CS team.' },
  ],
  roadmapItems: [
    { title: 'AI Forecast Engine', description: 'Confidence-scored pipeline predictions with explainability.', status: 'done' as const },
    { title: 'Buying Committee Graph', description: 'Multi-threaded stakeholder mapping across every deal.', status: 'done' as const },
    { title: 'Revenue Capacity Planner', description: 'Model headcount scenarios against ARR targets.', status: 'current' as const },
    { title: 'Generative Briefings', description: 'Auto-generate exec-ready deal and account summaries.', status: 'planned' as const },
    { title: 'Partner Revenue Hub', description: 'Channel and ecosystem revenue attribution in one view.', status: 'planned' as const },
  ],
  pricingTiers: [
    { name: 'Starter', price: '$0', description: 'For teams getting started.', features: ['Up to 5 seats', 'CRM sync', 'Basic pipeline view', 'Email support'], highlighted: false },
    { name: 'Growth', price: '$49/mo', description: 'For scaling revenue teams.', features: ['Unlimited seats', 'AI forecast scoring', 'Buying committee graph', 'Slack & Salesforce integration', 'Priority support'], highlighted: true, badge: 'Most Popular' },
    { name: 'Enterprise', price: 'Custom', description: 'For complex GTM motions.', features: ['Everything in Growth', 'Custom data residency', 'Executive briefings', 'SSO & SCIM', 'Dedicated CSM', 'SLA guarantees'], highlighted: false },
  ],
  testimonials: [
    { quote: "Nexus cut our forecast error from 40% to under 6%. Our board meetings are actually enjoyable now.", author: 'Sarah Chen', role: 'CRO', company: 'Vertex Cloud', rating: 5 },
    { quote: "We recovered $2.3M in at-risk pipeline in our first quarter using Nexus deal signals.", author: 'Marcus Webb', role: 'VP Revenue', company: 'Drift', rating: 5 },
    { quote: "The buying committee graph alone is worth the entire contract. We close multi-threaded deals 3× faster.", author: 'Priya Sharma', role: 'RevOps Director', company: 'Lattice', rating: 5 },
    { quote: "Every rep has full context on every deal. Ramp time dropped from 6 months to 6 weeks.", author: 'James Okafor', role: 'VP Sales', company: 'Runway', rating: 5 },
    { quote: "Finance and sales finally agree on the number. That alone saved us from a brutal board conversation.", author: 'Elena Torres', role: 'CFO', company: 'Pave', rating: 5 },
    { quote: "We used to spend 3 days per quarter on QBR prep. Now it's 90 minutes, end to end.", author: 'David Kim', role: 'Head of CS', company: 'Merge', rating: 5 },
  ],
  metrics: [
    { label: 'Forecast Accuracy', value: '94%', detail: 'Average across 2,000+ customers' },
    { label: 'Pipeline Recovered', value: '$2.3M', detail: 'Median at-risk deal recovery per quarter' },
    { label: 'Faster Close Cycle', value: '−12 days', detail: 'Compared to pre-Nexus baseline' },
    { label: 'Net Revenue Retention', value: '118%', detail: 'Median NRR across enterprise tier' },
  ],
  roi: {
    assumptions: [
      { label: 'Annual Contract Value', value: '$120k', detail: 'Average ACV across mid-market segment' },
      { label: 'Sales Team Size', value: '40 reps', detail: 'Including AEs, SDRs, and SEs' },
      { label: 'Current Forecast Error', value: '±28%', detail: 'Measured against actuals last 4 quarters' },
      { label: 'Avg Deal Cycle Length', value: '54 days', detail: 'From qualified opportunity to closed-won' },
    ],
    outcomes: [
      { label: 'Recovered Pipeline', value: '$4.2M', detail: 'Deals saved from silent churn or stall', emphasis: 'primary' as const },
      { label: 'Win Rate Improvement', value: '+18pp', detail: 'vs benchmark cohort without Nexus' },
      { label: 'Forecast Accuracy', value: '94%', detail: 'Within 5% of actuals every quarter', emphasis: 'primary' as const },
      { label: 'Time to Close Reduction', value: '−12 days', detail: 'Through earlier stakeholder alignment' },
    ],
  },
}

const _pick = (pool: string[], i: number) => pool[i % pool.length]
const _hash = (s: string) => s.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0)

// Detects generic placeholder strings from the auto-samples.json generator
function _isPlaceholder(v: unknown): boolean {
  if (typeof v !== 'string') return false
  return (
    /^(Sample Title|Sample Label|Sample text|A brief description|sample-value)/i.test(v) ||
    /^(Alpha|Beta|Gamma)$/.test(v) ||
    /^99% \d/.test(v) ||
    /^(complete|done|current|planned|strong|primary) \d/.test(v) ||
    /^Detail info \d/.test(v) ||
    /^Acme Corp \d/.test(v) ||
    /^Product Manager \d/.test(v)
  )
}

// Enrich a single field value given its key name and array index
function _enrichField(key: string, idx: number, parentKey = ''): string {
  const k = key.toLowerCase()
  if (k === 'title' || k === 'heading' || k === 'name' && !parentKey.includes('partner')) return _pick(_nx.features, idx)
  if (k === 'name' && parentKey.toLowerCase().includes('partner')) return _pick(_nx.partnerNames, idx)
  if (k === 'name') return _pick(_nx.personas, idx)
  if (k === 'label') return _pick(_nx.metricLabels, idx)
  if (k === 'value') return _pick(_nx.metricValues, idx)
  if (k === 'description' || k === 'message' || k === 'claim' || k === 'insight' || k === 'summary') return _pick(_nx.descriptions, idx)
  if (k === 'impact' || k === 'outcome') return _pick(_nx.impactValues, idx)
  if (k === 'detail' || k === 'note' || k === 'rationale' || k === 'context') return _pick(_nx.descriptions, idx)
  if (k === 'role') return _pick(_nx.personas, idx)
  if (k === 'region' || k === 'territory') return _pick(_nx.regions, idx)
  if (k === 'team') return _pick(_nx.teams, idx)
  if (k === 'status') return (['done', 'done', 'current', 'planned', 'planned'] as string[])[idx % 5]
  if (k === 'score') return _pick(['92/100', '87/100', '78/100', '65/100'], idx)
  if (k === 'price' || k === 'cost') return _pick(['$0', '$49/mo', '$199/mo', 'Custom'], idx)
  if (k === 'effort') return _pick(['Low', 'Medium', 'High'], idx)
  if (k === 'objection' || k === 'question') return _pick(_nx.objections, idx)
  if (k === 'answer') return _pick(_nx.objectionAnswers, idx)
  if (k === 'domain') return _pick(['Sales Execution', 'Revenue Operations', 'Customer Success', 'Finance & Planning'], idx)
  // list item strings (tasks, deliverables, checks, etc.)
  return _pick(_nx.workItems, idx)
}

// Enrich a string-array like ["Alpha","Beta","Gamma"] with themed content
function _enrichStringArray(arr: unknown[], parentKey: string): unknown[] {
  return arr.map((v, i) => (typeof v === 'string' && _isPlaceholder(v) ? _enrichField(parentKey, i) : v))
}

// Recursively enrich an item object
function _enrichItem(item: Record<string, unknown>, idx: number, parentKey: string): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === 'string' && _isPlaceholder(v)) {
      out[k] = _enrichField(k, idx, parentKey)
    } else if (Array.isArray(v)) {
      out[k] = _enrichStringArray(v, k)
    } else {
      out[k] = v
    }
  }
  return out
}

// Derive a meaningful title from the component name
function _nxTitle(componentName: string): string {
  const clean = componentName.replace('LandingProduct', '').replace('Landing', '')
  const map: Record<string, string> = {
    Metrics: 'Nexus by the numbers',
    ROIModel: 'The ROI is measurable. Let us prove it.',
    Roadmap: "Where we're taking you",
    PricingComparison: 'Simple, transparent pricing',
    PricingControls: 'Fine-grained control. Zero surprises.',
    PricingFAQ: 'Pricing questions, answered.',
    PricingOps: 'Built for your finance team too.',
    Feature: 'Built for every revenue team',
    FeaturesGrid: 'Everything your revenue team needs',
    FeatureMatrix: 'Full feature breakdown',
    FAQColumns: 'Common questions, straight answers',
    SocialProof: 'Trusted by 2,000+ revenue leaders',
    Testimonial: 'What our customers say',
    CaseStudy: 'Results that speak for themselves',
    Comparison: 'How Nexus compares',
    BeforeAfter: 'Before and after Nexus',
    Steps: 'How it works',
    Proof: 'The proof is in the pipeline',
    ObjectionHandling: "Every objection — answered",
    ObjectionNetwork: 'From concern to conviction',
    BusinessCaseBuilder: 'Build the business case in minutes',
    Security: 'Enterprise-grade security, out of the box',
    DataResidency: 'Your data. Your cloud. Your rules.',
    Integrations: '60+ native integrations',
    CustomerHealth: 'Healthy customers. Predictable revenue.',
    Onboarding: 'Live in weeks, not months',
    Trust: 'Trust built with every interaction',
    ValueChain: 'Value at every stage of the journey',
    ValueEngine: 'Your unfair competitive advantage',
    Announcement: 'Introducing Nexus AI',
    RiskReversal: 'We take on the risk so you can move fast',
    Guarantees: '30-day impact guarantee',
  }
  for (const [k, v] of Object.entries(map)) {
    if (clean.includes(k)) return v
  }
  return clean.replace(/([A-Z])/g, ' $1').trim()
}

function _nxDescription(componentName: string): string {
  const clean = componentName.replace('LandingProduct', '').replace('Landing', '')
  const map: Record<string, string> = {
    Metrics: 'From pipeline velocity to forecast accuracy — the numbers that prove it.',
    ROIModel: 'Input your team size and current metrics. See exactly what Nexus delivers.',
    Roadmap: 'A clear, committed path from where you are to predictable revenue growth.',
    Pricing: 'Start free. Scale as you grow. No hidden fees, no surprise invoices.',
    Feature: 'Every capability your revenue team needs, elegantly connected.',
    SocialProof: 'Join 2,000+ revenue teams running on Nexus across 60 countries.',
    Security: 'SOC 2 Type II, GDPR compliant, and enterprise SSO out of the box.',
    Integration: 'Nexus connects to your entire GTM stack in minutes, not months.',
    Objection: "Every question you'll face in procurement — with the answer that wins.",
    Trust: 'Every interaction earns deeper trust with your buyers and your board.',
    Value: 'Quantify your impact at every stage of the customer journey.',
    CaseStudy: 'How enterprise teams achieve measurable revenue outcomes with Nexus.',
    Comparison: 'See exactly how Nexus stacks up against point solutions and spreadsheets.',
    Onboarding: 'From signed contract to first insight in under 72 hours.',
    RiskReversal: 'No long-term lock-in. See impact in 30 days or we make it right.',
  }
  for (const [k, v] of Object.entries(map)) {
    if (clean.includes(k)) return v
  }
  return _pick(_nx.descriptions, _hash(clean))
}

// ─── Smart prop injection ─────────────────────────────────────────────────────
function withHarnessDefaults(baseProps: Record<string, unknown>, componentName: string, shelf: string): Record<string, unknown> {
  const next = { ...baseProps }

  // ── Universal pass: replace top-level placeholder strings on ALL shelves ───
  if (_isPlaceholder(next.title)) next.title = componentName.replace(/([A-Z])/g, ' $1').trim()
  if (_isPlaceholder(next.description)) next.description = _pick(_nx.descriptions, _hash(componentName))
  if (_isPlaceholder(next.subtitle as string | undefined)) next.subtitle = _pick(_nx.descriptions, _hash(componentName) + 1)
  // Walk all top-level arrays on all shelves — enriches items/strings in any component
  for (const key of Object.keys(next)) {
    const val = next[key]
    if (!Array.isArray(val)) continue
    next[key] = (val as unknown[]).map((item, i) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return _enrichItem(item as Record<string, unknown>, i, key)
      }
      if (typeof item === 'string' && _isPlaceholder(item)) {
        return _enrichField(key, i)
      }
      return item
    })
  }

  // ── Landing enrichment (covers all 321 LandingProduct* + 38 landing-marketing) ─
  if (shelf === 'landing-product-system' || shelf === 'landing-marketing') {
    // Top-level scalar fields
    if (_isPlaceholder(next.title)) next.title = _nxTitle(componentName)
    if (_isPlaceholder(next.description)) next.description = _nxDescription(componentName)
    if (_isPlaceholder(next.subtitle as string | undefined)) next.subtitle = _nxDescription(componentName)
    if (_isPlaceholder(next.tagline as string | undefined)) next.tagline = _pick(_nx.features, _hash(componentName))
    if (_isPlaceholder(next.eyebrow as string | undefined)) next.eyebrow = _pick(_nx.features, _hash(componentName) + 3)
    if (_isPlaceholder(next.caption as string | undefined)) next.caption = _nxDescription(componentName)

    // Walk all array props and enrich item objects / string values
    for (const key of Object.keys(next)) {
      const val = next[key]
      if (!Array.isArray(val)) continue
      next[key] = (val as unknown[]).map((item, i) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return _enrichItem(item as Record<string, unknown>, i, key)
        }
        if (typeof item === 'string' && _isPlaceholder(item)) {
          return _enrichField(key, i)
        }
        return item
      })
    }

    // ── Specific landmark components — inject complete showcase data ──────────
    if (componentName === 'LandingProductMetrics' && (!next.metrics || _isPlaceholder((next.metrics as Record<string, unknown>[])[0]?.label))) {
      next.metrics = _nx.metrics
    }
    if (componentName === 'LandingProductROIModel') {
      if (!next.assumptions || _isPlaceholder((next.assumptions as Record<string, unknown>[])[0]?.label)) next.assumptions = _nx.roi.assumptions
      if (!next.outcomes || _isPlaceholder((next.outcomes as Record<string, unknown>[])[0]?.label)) next.outcomes = _nx.roi.outcomes
    }
    if (componentName === 'LandingProductRoadmap' && (!next.items || _isPlaceholder((next.items as Record<string, unknown>[])[0]?.title))) {
      next.items = _nx.roadmapItems
    }
    if (componentName === 'LandingProductPricingComparison' && (!next.tiers || _isPlaceholder((next.tiers as Record<string, unknown>[])[0]?.name))) {
      next.tiers = _nx.pricingTiers
    }
    if (componentName === 'LandingProductSocialProof' && (!next.testimonials || _isPlaceholder((next.testimonials as Record<string, unknown>[])[0]?.quote))) {
      next.testimonials = _nx.testimonials
    }

    // ── Landing-marketing specific ────────────────────────────────────────────
    if (componentName === 'PricingCards' && !next.plans) {
      next.plans = _nx.pricingTiers.map((t) => ({
        ...t, interval: 'month',
        cta: t.name === 'Enterprise' ? 'Talk to sales' : `Get started`,
      }))
    }
    if (componentName === 'TestimonialGrid' && !next.testimonials) {
      next.testimonials = _nx.testimonials.slice(0, 3)
    }
    if (componentName === 'LandingTestimonialGrid' && !next.testimonials) {
      next.testimonials = _nx.testimonials
    }
    if (componentName === 'LandingTestimonial' && !next.testimonials) {
      next.testimonials = _nx.testimonials.slice(0, 3)
    }
    if (componentName === 'SocialProof' && !next.testimonials) {
      next.testimonials = _nx.testimonials.slice(0, 3)
    }
    if (componentName === 'LandingSocialProof' && !next.testimonials) {
      next.testimonials = _nx.testimonials
    }
    if (componentName === 'StatsGrid' && !next.stats) {
      next.stats = _nx.metrics.map(({ label, value, detail }) => ({ label, value, description: detail }))
    }
    if (componentName === 'LandingProductStatsCarousel' && !next.stats) {
      next.stats = _nx.metrics
    }
    if (componentName === 'FeatureGrid' && !next.features) {
      next.features = _nx.features.slice(0, 6).map((f, i) => ({ title: f, description: _pick(_nx.descriptions, i) }))
    }
    if (componentName === 'LogoCloud' && !next.logos) {
      next.logos = _nx.partnerNames.map((name) => ({ name, src: `https://cdn.simpleicons.org/${name.toLowerCase().replace(/\s+/g, '')}/888888` }))
    }
    if (componentName === 'HeroSection') {
      if (!next.title) next.title = 'Revenue intelligence for'
      if (!next.titleAccent) next.titleAccent = 'modern sales teams'
      if (!next.description) next.description = 'AI-powered signals that surface deal risk before it becomes revenue loss. Trusted by 2,000+ revenue teams.'
      if (!next.badge) next.badge = { text: 'Now with AI Forecasting →' }
      if (!next.stats) next.stats = _nx.metrics.slice(0, 3).map(({ label, value }) => ({ value, label }))
    }
    if (componentName === 'SplitHero' || componentName === 'GradientMeshHero' || componentName === 'TextRotateHero') {
      if (!next.title && !next.headline) { next.title = 'Revenue clarity starts here'; next.headline = 'Revenue clarity starts here' }
      if (!next.subtitle && !next.description) { next.subtitle = "Nexus gives every revenue team the signal-to-action layer they've been missing."; next.description = next.subtitle }
    }
    if (componentName === 'VideoHero' && !next.videoSrc) {
      next.videoSrc = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      next.thumbnailSrc = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80'
      next.thumbnailAlt = 'Nexus product demo'
      if (!next.title) next.title = 'See Nexus in 3 minutes'
    }
    if (componentName === 'Newsletter' && !next.title) {
      next.title = 'Revenue insights, weekly'
      next.description = 'Join 18,000 revenue leaders. Pipeline intelligence, GTM plays, and Nexus product updates.'
    }
    if (componentName === 'CTASection' || componentName === 'LandingCTA') {
      if (!next.title) next.title = 'Start closing more revenue today'
      if (!next.description && !next.subtitle) next.description = 'Join 2,000+ revenue teams. Free to start, no credit card required.'
      if (!next.primaryCta && !next.cta) next.primaryCta = 'Get started free'
    }
    if (componentName === 'AnnouncementBanner' && !next.message && !next.text) {
      next.message = '🎉 Nexus AI Forecasting is now generally available — '
      next.linkText = 'See what\'s new →'
      next.text = next.message
    }
    if ((componentName === 'FAQSection' || componentName === 'LandingFAQ' || componentName === 'LandingFAQCollapsible') && !next.faqs && !next.items) {
      const faqData = _nx.objections.map((q, i) => ({ question: q, answer: _nx.objectionAnswers[i] }))
      next.faqs = faqData
      next.items = faqData
    }
    if (componentName === 'ProductSteps' && !next.steps && !next.items) {
      next.steps = [
        { title: 'Connect your CRM', description: 'Nexus syncs with Salesforce or HubSpot in under 5 minutes.', step: 1 },
        { title: 'Nexus learns your motion', description: 'AI maps your pipeline patterns, win signals, and team behavior.', step: 2 },
        { title: 'Get instant intelligence', description: 'Surface deal risk, expansion signals, and forecast confidence scores.', step: 3 },
      ]
      next.items = next.steps
    }
    if (componentName === 'TechStackGrid' && !next.technologies && !next.items) {
      next.technologies = _nx.partnerNames.map((name, i) => ({ name, description: _pick(_nx.descriptions, i) }))
      next.items = next.technologies
    }
  }

  // ── backgrounds-effects ─────────────────────────────────────────────────────
  // Purely positional background components — they need className to fill the frame
  const BG_POSITIONAL = new Set([
    'AuroraBackgroundEffect', 'Backlight', 'BloomEffect', 'BorderBeam',
    'BorderBeamEffect', 'ChromaticAberrationEffect', 'ConfettiEffect',
    'DotPattern', 'FlickeringGrid', 'GradientBlobs', 'GridPattern',
    'InteractiveGridPattern', 'MeshGradient', 'Meteors', 'NoiseOverlay',
    'OrbitingCircles', 'Particles', 'RetroGrid', 'Ripple',
    'SparklesEffect', 'SpotlightEffect', 'WarpBackground', 'WavyBackground',
    'DottedMap', 'GlareHover',
  ])
  if (BG_POSITIONAL.has(componentName) && !next.className) {
    next.className = 'w-full h-full'
  }

  // Container bg effects — need both className AND demo children to be visible
  if (componentName === 'AuroraBackground' || componentName === 'AuroraBackgroundEffect') {
    if (!next.className) next.className = 'w-full h-full'
    if (!next.children) next.children = _demoHeroBg(componentName)
  }
  if (componentName === 'Spotlight' || componentName === 'SpotlightEffect') {
    if (!next.className) next.className = 'w-full h-full rounded-lg border border-border'
    if (!next.children) next.children = _demoHeroBg('Spotlight Effect')
  }
  if (componentName === 'CoolMode') {
    if (!next.children) next.children = (
      <button className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg">
        Move cursor over me
      </button>
    )
  }
  if (componentName === 'ShineBorder') {
    if (!next.children) next.children = (
      <div className="flex items-center gap-2 px-5 py-3">
        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
        <span className="text-sm font-semibold text-white/80">ShineBorder</span>
      </div>
    )
  }
  if (componentName === 'Lens' || componentName === 'LensMagnifier') {
    if (!next.className) next.className = 'w-full h-full'
    if (!next.children) next.children = (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-lg text-white text-sm font-medium">
        Lens Effect
      </div>
    )
  }
  if (componentName === 'MotionBlurEffect' || componentName === 'VHSEffect') {
    if (!next.children) next.children = _demoHeroBg(componentName)
    if (!next.className) next.className = 'w-full h-full'
  }
  if (componentName === 'MultiLayerParallax') {
    if (!next.children) next.children = _demoHeroBg('Parallax')
    if (!next.className) next.className = 'w-full h-full'
  }
  if (componentName === 'ProgressiveBlur') {
    if (!next.children) next.children = (
      <div className="grid grid-cols-3 gap-2 p-3">
        {[1,2,3,4,5,6].map((i) => <div key={i} className="h-12 rounded bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10" />)}
      </div>
    )
  }
  if (componentName === 'Globe') {
    if (!next.className) next.className = 'w-full h-full'
  }
  if (componentName === 'CursorFollower' || componentName === 'Pointer') {
    if (!next.className) next.className = 'w-full h-full'
    if (!next.children) next.children = (
      <div className="flex h-full items-center justify-center text-white/40 text-xs font-medium">Move cursor here</div>
    )
  }

  // ── motion-typography ───────────────────────────────────────────────────────
  // Pure text effects — inject visible text + large size
  const TEXT_INLINE = new Set([
    'AnimatedGradientText', 'AnimatedShinyText', 'AuroraText', 'ComicText',
    'DiaTextReveal', 'FlipText', 'GlitchText', 'HyperText', 'KineticText',
    'LineShadowText', 'SparklesText', 'SpinningText', 'Text3DFlip',
    'TextAnimate', 'TextScramble', 'TypingEffect', 'AnimatedText',
  ])
  if (TEXT_INLINE.has(componentName)) {
    if (!next.className) next.className = 'text-3xl font-bold text-white'
    if (!next.children || _isPlaceholder(next.children as string)) next.children = 'Build the future'
    if (!next.text || _isPlaceholder(next.text as string)) next.text = 'Build the future'
  }

  if (componentName === 'KineticText' && (typeof next.text !== 'string' || _isPlaceholder(next.text as string))) next.text = 'Build the future'
  if (componentName === 'LineShadowText' && (!next.children || _isPlaceholder(next.children as string))) next.children = 'Ship fast'

  const _isPlaceholderArray = (v: unknown) => Array.isArray(v) && (v as unknown[]).every(item => typeof item === 'string' && _isPlaceholder(item))

  if (componentName === 'MorphingText') {
    if (!next.texts || _isPlaceholderArray(next.texts)) next.texts = ['Design', 'Build', 'Deploy', 'Scale']
    if (!next.className) next.className = 'text-3xl font-bold text-white'
  }
  if (componentName === 'TextLoop') {
    if ((!next.items && !next.children) || _isPlaceholderArray(next.items) || _isPlaceholderArray(next.words)) {
      next.items = ['Developers', 'Designers', 'Founders', 'Builders']
      next.words = next.items
    }
    if (!next.className) next.className = 'text-3xl font-bold text-white'
  }
  if (componentName === 'TextMorph') {
    if (!next.texts || _isPlaceholderArray(next.texts)) next.texts = ['Hello', 'World', 'Ship', 'Fast']
    if (!next.className) next.className = 'text-4xl font-bold text-white'
  }
  if (componentName === 'TypingAnimation') {
    if ((!next.children && !next.words) || _isPlaceholderArray(next.words)) {
      next.words = ['Build the future', 'Design with intent', 'Ship with confidence']
    }
    if (!next.className) next.className = 'text-2xl font-bold text-white'
  }
  if (componentName === 'WordRotate') {
    if (!next.words || _isPlaceholderArray(next.words)) next.words = ['Beautiful', 'Fast', 'Accessible', 'Modern']
    if (!next.className) next.className = 'text-3xl font-bold text-white'
  }
  if (componentName === 'NumberTicker') {
    if (next.value === undefined) next.value = 9845
    if (!next.prefix) next.prefix = '$'
    if (!next.suffix) next.suffix = '+'
    if (!next.className) next.className = 'text-4xl font-bold tabular-nums text-white'
  }
  if (componentName === 'AnimatedCounter') {
    if (next.end === undefined && next.to === undefined) next.end = 9999
    if (!next.className) next.className = 'text-4xl font-bold text-white'
  }
  if (componentName === 'AnimatedCircularProgressBar') {
    if (next.value === undefined) next.value = 72
    if (next.max === undefined) next.max = 100
  }
  if (componentName === 'CountUpStats') {
    const statsHaveplaceholder = Array.isArray(next.stats) && (next.stats as Record<string, unknown>[]).some(s => _isPlaceholder(s.label as string))
    if (!next.stats || statsHaveplaceholder) {
      next.stats = [
        { value: 50000, label: 'Active Users', suffix: '+' },
        { value: 99.9, label: 'Uptime SLA', suffix: '%', decimals: 1 },
        { value: 150, label: 'Countries' },
        { value: 4.9, label: 'Avg Rating', prefix: '★', decimals: 1 },
      ]
    }
  }
  if (componentName === 'Marquee') {
    if (!next.children) {
      next.children = ['React', 'TypeScript', 'Tailwind', 'Vite', 'Figma', 'Framer', 'Motion', 'Vercel'].map(
        (label, i) => <span key={i} className="mx-4 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80">{label}</span>
      )
    }
  }
  if (componentName === 'AnimatedList') {
    if (!next.items) next.items = ['Feature shipped ✓', 'Bug squashed ✓', 'PR merged ✓', 'Tests passed ✓', 'Deployed ✓']
  }
  if (componentName === 'ScrollVelocity') {
    if (!next.children) {
      next.children = ['Design', 'Build', 'Ship', 'Scale', 'Iterate', 'Launch'].map(
        (w, i) => <span key={i} className="mx-8 text-4xl font-bold text-white/25">{w}</span>
      )
    }
  }
  if (['BlurFade', 'RevealOnScroll', 'StaggerAnimation'].includes(componentName) && !next.children) {
    next.children = (
      <div className="space-y-2 w-full">
        <div className="h-3 rounded-full bg-white/20 w-3/4" />
        <div className="h-3 rounded-full bg-white/15 w-full" />
        <div className="h-3 rounded-full bg-white/10 w-2/3" />
        <div className="h-3 rounded-full bg-white/20 w-4/5" />
      </div>
    )
  }
  if (componentName === 'Highlighter' || componentName === 'HighlightOnScroll') {
    if (!next.children) next.children = 'The quick brown fox jumps over the lazy dog.'
    if (!next.className) next.className = 'text-xl font-medium text-white max-w-sm text-center'
  }
  if (componentName === 'TextReveal' || componentName === 'TextRevealOnScroll') {
    if (!next.text && !next.children) next.text = 'Craft extraordinary user experiences with motion.'
    if (!next.className) next.className = 'text-2xl font-bold text-white max-w-sm text-center'
  }
  if (componentName === 'ParallaxSection' && !next.children) {
    next.children = (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Parallax Section</h2>
        <p className="mt-2 text-sm text-white/60">Scroll to experience</p>
      </div>
    )
  }
  if (componentName === 'SmoothCursor' && !next.children) {
    next.children = (
      <div className="flex h-full items-center justify-center text-white/40 text-xs font-medium">Move cursor here</div>
    )
  }
  if (componentName === 'VideoText') {
    if (!next.text) next.text = 'MOTION'
    if (!next.className) next.className = 'text-6xl font-black text-white'
  }
  if (componentName === 'LottieAnimation' && !next.src && !next.url && !next.animationData) {
    // Lottie without source — mark for graceful fallback
    next.__noSource = true
  }
  if (componentName === 'PageTransition' && !next.children) {
    next.children = <div className="flex h-full items-center justify-center"><div className="h-12 w-12 rounded-full border-2 border-violet-400/50 bg-violet-500/20" /></div>
  }

  // ── interactive-showcase ────────────────────────────────────────────────────
  const CARD_WRAPPERS = new Set([
    'GlowCard', 'MagicCard', 'NeonCard', 'NeonGradientCard', 'HolographicCard',
    'TiltCard', 'SpotlightCards', 'GlassmorphismCard', 'MagneticButton',
    'MagneticButtonEffect', 'FlipCard', 'FlipCardEffect', 'ExpandableCard',
  ])
  if (CARD_WRAPPERS.has(componentName) && !next.children) {
    next.children = _demoCardContent(componentName)
  }

  const BTN_COMPONENTS = new Set([
    'RainbowButton', 'PulsatingButton', 'RippleButton', 'ShimmerButton',
    'ShinyButton', 'InteractiveHoverButton',
  ])
  if (BTN_COMPONENTS.has(componentName) && !next.children) {
    next.children = 'Click me'
  }

  if (componentName === 'IconCloud' && !next.images) {
    next.images = [
      'https://cdn.simpleicons.org/react/61DAFB',
      'https://cdn.simpleicons.org/typescript/3178C6',
      'https://cdn.simpleicons.org/tailwindcss/06B6D4',
      'https://cdn.simpleicons.org/nextdotjs/FFFFFF',
      'https://cdn.simpleicons.org/vitejs/646CFF',
      'https://cdn.simpleicons.org/figma/F24E1E',
      'https://cdn.simpleicons.org/github/FFFFFF',
      'https://cdn.simpleicons.org/vercel/FFFFFF',
      'https://cdn.simpleicons.org/framer/0055FF',
      'https://cdn.simpleicons.org/notion/FFFFFF',
      'https://cdn.simpleicons.org/linear/5E6AD2',
      'https://cdn.simpleicons.org/stripe/635BFF',
    ]
  }
  if (componentName === 'StarRating') {
    if (next.rating === undefined && next.value === undefined) next.rating = 4
    if (next.maxRating === undefined && next.max === undefined) next.maxRating = 5
  }
  if (componentName === 'ProgressRing') {
    if (next.value === undefined && next.progress === undefined) { next.value = 72; next.progress = 72 }
  }
  if (componentName === 'SkillBars' && !next.skills) {
    next.skills = [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Design', level: 80 },
    ]
  }
  if (componentName === 'ComparisonSlider' && !next.before && !next.beforeImage) {
    next.before = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    next.after = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&grayscale'
    next.beforeImage = next.before
    next.afterImage = next.after
  }
  if (componentName === 'TweetCard' && !next.tweet && !next.content) {
    next.content = { text: 'This component gallery is absolutely 🔥', author: 'Dev Studio', username: '@devstudio', likes: 342, date: 'May 7, 2026' }
    next.tweet = next.content
  }

  // ── feedback-state ──────────────────────────────────────────────────────────
  if (componentName === 'Alert') {
    if (!next.title) next.title = 'System update available'
    if (!next.description) next.description = 'A new version is ready. Refresh to apply.'
    if (!next.type) next.type = 'info'
  }
  if (componentName === 'Toast') {
    if (!next.title) next.title = 'File saved'
    if (!next.description) next.description = 'Your changes have been saved successfully.'
    if (!next.type) next.type = 'success'
  }
  if (componentName === 'EmptyState') {
    if (!next.title) next.title = 'No results found'
    if (!next.description) next.description = 'Try adjusting your search filters.'
  }
  if (componentName === 'ErrorState') {
    if (!next.title) next.title = 'Something went wrong'
    if (!next.description) next.description = 'Could not load the resource. Please retry.'
  }
  if (componentName === 'Modal' || componentName === 'ConfirmDialog' || componentName === 'AuthRequiredModal') {
    if (next.open === undefined && next.isOpen === undefined) { next.open = true; next.isOpen = true }
  }
  if (componentName === 'CookieConsent') {
    if (next.show === undefined) next.show = true
  }

  // ── AnimatedBeam ─────────────────────────────────────────────────────────────

  // ── AuroraText / DiaTextReveal: color arrays contain placeholders ─────────
  if (componentName === 'AuroraText') {
    if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    if (!next.children || _isPlaceholder(next.children as string)) next.children = 'Revenue Intelligence'
  }
  if (componentName === 'DiaTextReveal') {
    if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#6366f1', '#8b5cf6', '#a78bfa']
    if (!next.text || _isPlaceholder(next.text as string)) next.text = 'Build the future'
    if (!next.textColor || _isPlaceholder(next.textColor as string)) next.textColor = '#ffffff'
  }

  // ── className fields polluted by placeholder strings (auto-samples bug) ───
  if (_isPlaceholder(next.squaresClassName as string | undefined)) next.squaresClassName = 'fill-blue-500/30'
  if (_isPlaceholder(next.segmentClassName as string | undefined)) next.segmentClassName = 'text-indigo-400'
  if (_isPlaceholder(next.textClassName as string | undefined)) next.textClassName = 'text-white font-semibold'
  if (_isPlaceholder(next.imageClassName as string | undefined)) next.imageClassName = 'rounded-md'
  if (_isPlaceholder(next.itemClassName as string | undefined)) next.itemClassName = 'text-white/80'
  if (_isPlaceholder(next.labelClassName as string | undefined)) next.labelClassName = 'text-white/60 text-sm'

  // ── skeleton / loaders ───────────────────────────────────────────────────
  if (componentName === 'skeleton' || componentName === 'Skeleton') {
    if (_isPlaceholder(next.height as string | undefined)) next.height = '80px'
    if (next.width === 'item-1') next.width = '100%'
  }
  if ((componentName === 'PageLoading' || componentName === 'PagePreloader') && _isPlaceholder(next.message as string | undefined)) {
    next.message = 'Loading your workspace…'
    next.text = next.message
  }

  if (componentName === 'AnimatedBeam') {
    if (next.containerRef === undefined) next.containerRef = { current: null }
    if (next.fromRef === undefined) next.fromRef = { current: null }
    if (next.toRef === undefined) next.toRef = { current: null }
  }

  // ── interactive-showcase: carousel/array-dependent components ───────────────
  if (componentName === 'AdvancedCarousel' && !next.items) {
    next.items = [
      <div key="1" className="flex h-full items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg text-white text-lg font-bold">Slide 1</div>,
      <div key="2" className="flex h-full items-center justify-center bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg text-white text-lg font-bold">Slide 2</div>,
      <div key="3" className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg text-white text-lg font-bold">Slide 3</div>,
    ]
  }
  if (componentName === 'ProductCarousel' && !next.items) {
    next.items = [
      { id: 1, title: 'Pro Headphones', subtitle: 'Studio Quality', price: 299, discount: 20, rating: 4.8, reviews: 512 },
      { id: 2, title: 'Wireless Mouse', subtitle: 'Ergonomic Design', price: 79, rating: 4.5, reviews: 201 },
      { id: 3, title: 'Mechanical KB', subtitle: 'RGB Backlit', price: 149, discount: 15, rating: 4.7, reviews: 334 },
    ]
  }
  if (componentName === 'ImageGallery' && !next.images) {
    const imgs = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=70',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=70',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70',
    ]
    next.images = imgs.map((src, i) => ({ src, alt: `Photo ${i + 1}`, caption: `Mountain photo ${i + 1}` }))
  }
  if (componentName === 'ImageLightbox') {
    const imgSrc = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'
    if (!next.src) next.src = imgSrc
    if (!next.alt) next.alt = 'Mountain landscape'
    if (!next.children) next.children = (
      <img src={imgSrc} alt="Mountain landscape" className="h-full w-full rounded-md object-cover cursor-zoom-in" />
    )
  }
  if (componentName === 'DraggableCards') {
    // Always override — auto-samples may produce non-array items
    next.items = [
      { id: 1, label: 'Ship it fast', color: 'from-violet-500 to-indigo-500' },
      { id: 2, label: 'Design first', color: 'from-pink-500 to-rose-500' },
      { id: 3, label: 'Build bold', color: 'from-emerald-500 to-teal-500' },
    ]
    next.renderCard = (item: Record<string, unknown>) => (
      <div className={`flex h-40 w-56 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color as string} p-6 text-lg font-bold text-white shadow-xl`}>
        {item.label as string}
      </div>
    )
  }
  if (componentName === 'InfiniteCarousel' && !next.children) {
    next.children = ['React', 'TypeScript', 'Vite', 'Tailwind', 'Motion', 'Framer', 'Vercel', 'Next.js'].map(
      (name, i) => <span key={i} className="mx-4 flex-shrink-0 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/70">{name}</span>
    )
  }
  if (componentName === 'CodeBlock' && !next.code) {
    next.code = `function greet(name: string) {\n  return \`Hello, \${name}!\`\n}\n\nconsole.log(greet("World"))`
    next.language = 'typescript'
  }
  if ((componentName === 'LazyLoadComponent' || componentName === 'LazyLoad' || componentName === 'LazySection') && !next.children) {
    // threshold must be a valid 0–1 number, not placeholder
    if (typeof next.threshold !== 'number' || next.threshold < 0 || next.threshold > 1) next.threshold = 0.1
    next.children = (
      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-sm font-medium text-white/60 border border-white/10">
        Lazy loaded content
      </div>
    )
  }
  if (componentName === 'CodeComparison') {
    if (!next.beforeCode) next.beforeCode = `function hello() {\n  console.log("Hello") // [!code --]\n}`
    if (!next.afterCode) next.afterCode = `function hello(name: string) {\n  console.log(\`Hello \${name}\`) // [!code ++]\n}`
    if (!next.language) next.language = 'typescript'
    if (!next.filename) next.filename = 'hello.ts'
    if (!next.lightTheme) next.lightTheme = 'github-light'
    if (!next.darkTheme) next.darkTheme = 'github-dark'
  }
  if (componentName === 'Terminal' && !next.children) {
    // Terminal uses its own sub-components; inject plain string children as fallback
    next.children = (
      <div className="font-mono text-sm text-green-400 space-y-1 p-2">
        <div className="text-white/60">$ npm install</div>
        <div className="text-emerald-400">✓ 588 packages installed</div>
        <div className="text-white/60">$ npm run dev</div>
        <div className="text-cyan-400">  → http://localhost:5173</div>
        <div className="text-emerald-400">✓ ready in 610ms</div>
      </div>
    )
  }
  if ((componentName === 'StackedCards' || componentName === 'ZoomHero' || componentName === 'HorizontalScrollSection' || componentName === 'ScrollPinSection') && !next.children) {
    next.children = (
      <>
        {['Design', 'Build', 'Ship'].map((label, i) => (
          <div key={i} className={`flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${['from-violet-600 to-indigo-600','from-pink-600 to-rose-600','from-emerald-600 to-teal-600'][i]} text-xl font-bold text-white`}>
            {label}
          </div>
        ))}
      </>
    )
  }
  if (componentName === 'ScrollSnapContainer' && !next.children) {
    next.children = ['Snap 1', 'Snap 2', 'Snap 3'].map((label, i) => (
      <div key={i} className="flex h-full min-w-full items-center justify-center bg-gradient-to-br from-violet-900 to-indigo-900 text-2xl font-bold text-white">
        {label}
      </div>
    ))
  }
  if (componentName === 'CurtainReveal' && !next.children) {
    next.children = (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-2xl font-bold text-white">
        Curtain Reveal
      </div>
    )
  }
  if (componentName === 'ImageReveal' && !next.src && !next.image) {
    next.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'
    next.image = next.src
    next.alt = 'Mountain landscape'
  }
  if ((componentName === 'SafariMockup' || componentName === 'AndroidMockup' || componentName === 'Iphone' || componentName === 'Safari') && !next.children) {
    next.children = (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white/60 text-sm font-medium">
        Preview Content
      </div>
    )
  }
  if (componentName === 'HeroVideoDialog' && !next.videoSrc && !next.src) {
    next.videoSrc = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    next.thumbnailSrc = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    next.thumbnailAlt = 'Video thumbnail'
  }

  // ── data-admin ───────────────────────────────────────────────────────────────
  if (componentName === 'BarChart' && !next.data) {
    next.data = [
      { label: 'Jan', value: 42, color: '#6366f1' },
      { label: 'Feb', value: 68, color: '#6366f1' },
      { label: 'Mar', value: 53, color: '#6366f1' },
      { label: 'Apr', value: 81, color: '#6366f1' },
      { label: 'May', value: 94, color: '#6366f1' },
      { label: 'Jun', value: 77, color: '#6366f1' },
    ]
  }
  if (componentName === 'LineChart' && !next.data) {
    next.data = [
      { label: 'Jan', value: 42 },
      { label: 'Feb', value: 68 },
      { label: 'Mar', value: 53 },
      { label: 'Apr', value: 81 },
      { label: 'May', value: 94 },
      { label: 'Jun', value: 77 },
    ]
  }
  if (componentName === 'KPICard') {
    if (!next.title) next.title = 'Monthly Revenue'
    if (next.value === undefined) next.value = '$48,295'
    if (!next.change) next.change = '+12.5%'
    if (!next.changeLabel) next.changeLabel = 'vs last month'
  }
  if (componentName === 'DataTable' && !next.data) {
    next.data = [
      { id: 1, name: 'Alice Chen', role: 'Engineer', status: 'Active', joined: '2023-01' },
      { id: 2, name: 'Bob Smith', role: 'Designer', status: 'Active', joined: '2023-03' },
      { id: 3, name: 'Carol Lee', role: 'PM', status: 'Away', joined: '2022-11' },
      { id: 4, name: 'Dan Park', role: 'Engineer', status: 'Active', joined: '2024-01' },
    ]
    next.columns = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'role', header: 'Role' },
      { key: 'status', header: 'Status' },
      { key: 'joined', header: 'Joined' },
    ]
    next.getRowKey = (row: Record<string, unknown>) => row.id as string
  }
  if (componentName === 'Timeline' && !next.items) {
    next.items = [
      { title: 'Project kickoff', date: 'Jan 2026', variant: 'success', description: 'Team assembled and scope defined.' },
      { title: 'Design sprint', date: 'Feb 2026', variant: 'info', description: 'Wireframes and component library.' },
      { title: 'Development phase', date: 'Mar 2026', variant: 'default', description: '588 components shipped.' },
      { title: 'Launch', date: 'May 2026', variant: 'warning', description: 'Gallery goes live.' },
    ]
  }
  if (componentName === 'Stepper' || componentName === 'StepIndicator') {
    if (!next.steps && !next.items) {
      next.steps = [
        { label: 'Plan', completed: true },
        { label: 'Design', completed: true },
        { label: 'Build', active: true },
        { label: 'Ship' },
      ]
      next.items = next.steps
    }
  }
  if (componentName === 'BentoGrid' && !next.items) {
    next.items = [
      { title: 'Analytics', description: 'Real-time metrics', className: 'col-span-2' },
      { title: 'Users', description: '50k+ active' },
      { title: 'Performance', description: '99.9% uptime', className: 'col-span-2' },
      { title: 'Revenue', description: '$48k MRR' },
    ]
  }
  if ((componentName === 'GaugeChart' || componentName === 'RadarChart') && next.value === undefined && !next.data) {
    next.value = 72
    next.data = [
      { label: 'Speed', value: 80 },
      { label: 'Quality', value: 90 },
      { label: 'Reliability', value: 85 },
      { label: 'Usability', value: 78 },
    ]
  }

  // ── navigation-command ───────────────────────────────────────────────────────
  if (componentName === 'Breadcrumbs' && !next.items) {
    next.items = [
      { label: 'Home', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Navigation' },
    ]
  }
  if (componentName === 'CommandMenu' && !next.groups) {
    next.groups = [
      {
        heading: 'Navigation',
        actions: [
          { id: 'home', label: 'Go to Home', shortcut: 'G H', onSelect: () => {} },
          { id: 'components', label: 'View Components', shortcut: 'G C', onSelect: () => {} },
        ],
      },
      {
        heading: 'Actions',
        actions: [
          { id: 'theme', label: 'Toggle Theme', shortcut: '⌘T', onSelect: () => {} },
          { id: 'copy', label: 'Copy Link', shortcut: '⌘⇧C', onSelect: () => {} },
        ],
      },
    ]
  }
  if (componentName === 'CommandPalette' && !next.commands && !next.items && !next.groups) {
    next.commands = [
      { id: 'home', label: 'Home', category: 'Navigation' },
      { id: 'docs', label: 'Documentation', category: 'Navigation' },
      { id: 'theme', label: 'Toggle Theme', category: 'Actions', shortcut: '⌘T' },
    ]
    next.isOpen = true
    next.open = true
  }
  if (componentName === 'FloatingNav' && !next.items && !next.links) {
    const navLinks = [
      { label: 'Home', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Work', href: '#' },
      { label: 'Contact', href: '#' },
    ]
    next.items = navLinks
    next.links = navLinks
  }
  if (componentName === 'MegaMenu' || componentName === 'MegaMenuComponent') {
    if (!next.items && !next.sections) {
      next.items = [
        { label: 'Products', children: [{ label: 'Gallery', href: '#' }, { label: 'Components', href: '#' }] },
        { label: 'Docs', href: '#' },
      ]
      next.sections = next.items
    }
  }
  if ((componentName === 'Dock') && !next.items) {
    next.items = [
      { label: 'Home', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>, onClick: () => {} },
      { label: 'Search', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, onClick: () => {} },
      { label: 'Settings', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, onClick: () => {} },
      { label: 'Profile', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, onClick: () => {} },
    ]
  }
  if (componentName === 'SideMenu' && !next.items) {
    next.items = [
      { label: 'Home', href: '#' },
      { label: 'About', href: '#' },
      { label: 'Work', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ]
  }

  return next
}

function LazyComponentSlot({
  entry,
  mode,
  onStatus,
  onIssue,
}: {
  entry: ComponentEntry
  mode: HarnessMode
  onStatus: (path: string, status: SlotStatus) => void
  onIssue: (path: string, issue: SlotIssue | null) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null)
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
      { rootMargin: '280px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [entry.path, onStatus])

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
          ([key, val]) => key !== 'default' && !key.startsWith('__') && /^[A-Z]/.test(key) && isReactComponent(val),
        )

        if (candidates.length > 0) {
          setComp(() => candidates[0][1] as React.ComponentType<any>)
          setImportErr(null)
          onIssue(entry.path, null)
          return
        }

        if (mod.default && isReactComponent(mod.default)) {
          setComp(() => mod.default as React.ComponentType<any>)
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
        <Comp {...compProps} />
      </ErrorBoundary>
      {runtimeErr && mode === 'strict' && (
        <div className="mt-1 px-2 pb-2 text-[10px] text-red-400/80">Strict mode: {runtimeErr}</div>
      )}
    </div>
  )
}

function ComponentCard({
  entry,
  mode,
  previewClass,
  fitMode,
  onStatus,
  onIssue,
}: {
  entry: ComponentEntry
  mode: HarnessMode
  previewClass: string
  fitMode: FitMode
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
          <LazyComponentSlot key={`${entry.path}-${mode}-${seed}`} entry={entry} mode={mode} onStatus={onStatus} onIssue={onIssue} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [search, setSearch] = useState('')
  const [activeShelf, setActiveShelf] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)

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

        <main className="flex-1 overflow-y-auto bg-background/50">
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
