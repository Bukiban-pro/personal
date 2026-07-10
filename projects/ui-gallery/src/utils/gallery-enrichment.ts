import React from 'react'
import { BarChart2, Target, Zap, Users, TrendingUp, Shield, Globe, Layers } from 'lucide-react'
import { _nx } from '../data/nexus-vocabulary'

export const _pick = (pool: string[], i: number) => pool[i % pool.length]
export const _hash = (s: string) => s.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0)

export function _isPlaceholder(v: unknown): boolean {
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

export function _enrichField(key: string, idx: number, parentKey = ''): string {
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
  if (k === 'words' || k === 'texts' || k === 'phrases') return _pick(['Build', 'Deploy', 'Scale', 'Ship', 'Grow', 'Launch', 'Win', 'Iterate'], idx)
  if (k === 'tags' || k === 'categories' || k === 'keywords') return _pick(['Revenue Ops', 'Pipeline', 'Analytics', 'GTM', 'Sales', 'CS', 'Finance'], idx)
  if (k === 'colors' || k === 'colour' || k === 'particles') return _pick(['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'], idx)
  return _pick(_nx.workItems, idx)
}

export function _enrichStringArray(arr: unknown[], parentKey: string): unknown[] {
  return arr.map((v, i) => (typeof v === 'string' && _isPlaceholder(v) ? _enrichField(parentKey, i) : v))
}

export function _enrichItem(item: Record<string, unknown>, idx: number, parentKey: string): Record<string, unknown> {
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

export function _nxTitle(componentName: string): string {
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
    CTASection: 'Start closing more revenue today',
    CTA: 'Start closing more revenue today',
    FAQSection: 'Common questions, answered',
    HeroSection: 'Revenue intelligence for modern sales teams',
    TextRotateHero: 'Revenue clarity starts here',
    GradientMeshHero: 'Revenue clarity starts here',
    SplitHero: 'Revenue clarity starts here',
    VideoHero: 'See Nexus in 3 minutes',
    Newsletter: 'Revenue insights, weekly',
    ProjectShowcase: 'Built by revenue operators',
    FeatureShowcase: 'Built for every revenue team',
    FeatureGrid: 'Everything your revenue team needs',
    LogoCloud: 'Trusted by industry leaders',
    TechStackGrid: 'Integrates with your entire GTM stack',
    StatsGrid: 'The numbers speak for themselves',
    TestimonialGrid: 'What our customers say',
    PricingCards: 'Simple, transparent pricing',
    ProductSteps: 'Get started in three steps',
    WelcomeSection: 'Welcome back',
    Band: 'One platform. One truth. One revenue motion.',
    Discount: 'Limited-time offer',
    Marquee: 'Trusted across every industry',
    Rating: 'Rated #1 by revenue teams',
    Showcase: 'See Nexus in action',
    SocialProofBand: 'Trusted worldwide',
    Footer: 'Nexus — The OS for revenue teams',
    PricingPlan: 'Plans that scale with you',
    ReadMoreWrapper: 'Read the full story',
    SaleCta: 'Don\'t miss this',
    GenericLogo: 'Nexus',
  }
  for (const [k, v] of Object.entries(map)) {
    if (clean.includes(k)) return v
  }
  return clean.replace(/([A-Z])/g, ' $1').trim()
}

export function _nxDescription(componentName: string): string {
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

export const _demoCardContent = (name: string) => (
  <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
    <div className="text-2xl opacity-80">✦</div>
    <p className="text-sm font-bold text-white/90">{name}</p>
    <p className="text-[11px] text-white/45">Hover to interact</p>
  </div>
)

export const _demoHeroBg = (name: string) => (
  <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
    <p className="text-xl font-bold tracking-tight text-white/90">{name}</p>
    <p className="text-xs text-white/50">Background effect</p>
  </div>
)

export function withHarnessDefaults(baseProps: Record<string, unknown>, componentName: string, shelf: string): Record<string, unknown> {
  const next = { ...baseProps }
  const _isPlaceholderArray = (v: unknown) => Array.isArray(v) && (v as unknown[]).every(item => typeof item === 'string' && _isPlaceholder(item))

  const _isLanding = shelf === 'landing-product-system' || shelf === 'landing-marketing'
  if (_isPlaceholder(next.title)) {
    next.title = _isLanding ? _nxTitle(componentName) : componentName.replace(/([A-Z])/g, ' $1').trim()
  }
  if (_isPlaceholder(next.description)) next.description = _isLanding ? _nxDescription(componentName) : _pick(_nx.descriptions, _hash(componentName))
  if (_isPlaceholder(next.subtitle as string | undefined)) next.subtitle = _isLanding ? _nxDescription(componentName) : _pick(_nx.descriptions, _hash(componentName) + 1)
  if (_isPlaceholder(next.tagline as string | undefined)) next.tagline = _pick(_nx.features, _hash(componentName))
  if (_isPlaceholder(next.eyebrow as string | undefined)) next.eyebrow = _pick(_nx.features, _hash(componentName) + 3)
  if (_isPlaceholder(next.caption as string | undefined)) next.caption = _isLanding ? _nxDescription(componentName) : _pick(_nx.descriptions, _hash(componentName) + 2)
  if (_isPlaceholder(next.label as string | undefined)) next.label = _pick(_nx.metricLabels, _hash(componentName))
  if (_isPlaceholder(next.placeholder as string | undefined)) next.placeholder = 'Search or enter value…'
  if (_isPlaceholder(next.buttonText as string | undefined)) next.buttonText = 'Get started'
  if (_isPlaceholder(next.ratingLabel as string | undefined)) next.ratingLabel = 'Based on 2,000+ reviews'
  if (_isPlaceholder(next.alt as string | undefined)) next.alt = componentName
  if (_isPlaceholder(next.ariaLabel as string | undefined)) next.ariaLabel = componentName
  if (_isPlaceholder(next.leftLabel as string | undefined)) next.leftLabel = 'Before'
  if (_isPlaceholder(next.rightLabel as string | undefined)) next.rightLabel = 'After'
  if (_isPlaceholder(next.confirmLabel as string | undefined)) next.confirmLabel = 'Confirm'
  if (_isPlaceholder(next.cancelLabel as string | undefined)) next.cancelLabel = 'Cancel'
  if (_isPlaceholder(next.actionLabel as string | undefined)) next.actionLabel = 'Learn more'
  if (_isPlaceholder(next.helperText as string | undefined)) next.helperText = undefined
  if (_isPlaceholder(next.message as string | undefined)) next.message = _pick(_nx.descriptions, _hash(componentName) + 4)
  if (_isPlaceholder(next.emptyMessage as string | undefined)) next.emptyMessage = 'No results found'
  if (_isPlaceholder(next.name as string | undefined) && typeof next.name === 'string') next.name = _pick(_nx.personas, _hash(componentName))

  // ── motion-typography ────────────────────────────────────────────────────────
  if (shelf === 'motion-typography') {
    if (componentName === 'AuroraText') {
      if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      if (!next.children || _isPlaceholder(next.children as string)) next.children = 'Revenue Intelligence'
    }
    if (componentName === 'DiaTextReveal') {
      if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#6366f1', '#8b5cf6', '#a78bfa']
      if (!next.text || _isPlaceholder(next.text as string)) next.text = 'Build the future'
      if (!next.textColor || _isPlaceholder(next.textColor as string)) next.textColor = '#ffffff'
    }
    if (['FlickeringText', 'GlowText', 'GradientText', 'LetterPullup', 'SparklesText', 'VelocityScroll', 'ShinyText'].includes(componentName)) {
      if (!next.children || _isPlaceholder(next.children as string)) next.children = 'Build the future'
      if (!next.text || _isPlaceholder(next.text as string)) next.text = 'Build the future'
    }

    if (componentName === 'KineticText' && (typeof next.text !== 'string' || _isPlaceholder(next.text as string))) next.text = 'Build the future'
    if (componentName === 'LineShadowText' && (!next.children || _isPlaceholder(next.children as string))) next.children = 'Ship fast'

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
      if (!next.children || _isPlaceholder(next.children as string)) next.children = 'Align every buying committee member before procurement slows you down.'
      if (!next.text || _isPlaceholder(next.text as string)) next.text = next.children
      if (!next.className) next.className = 'text-xl font-medium text-white max-w-sm text-center'
    }
    if (componentName === 'TextReveal' || componentName === 'TextRevealOnScroll') {
      if (!next.text || _isPlaceholder(next.text as string)) next.text = 'Craft extraordinary user experiences with motion.'
      if (!next.children || _isPlaceholder(next.children as string)) next.children = next.text
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
      if (_isPlaceholder(next.fontSize as string)) next.fontSize = undefined
      if (_isPlaceholder(next.fontWeight as string)) next.fontWeight = undefined
      if (_isPlaceholder(next.textAnchor as string)) next.textAnchor = undefined
      if (next.src === '#') next.src = 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
    if (componentName === 'LottieAnimation' && !next.src && !next.url && !next.animationData) {
      // Lottie without source — mark for graceful fallback
      next.__noSource = true
    }
    if (componentName === 'PageTransition' && !next.children) {
      next.children = <div className="flex h-full items-center justify-center"><div className="h-12 w-12 rounded-full border-2 border-violet-400/50 bg-violet-500/20" /></div>
    }
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

  if (componentName === 'IconCloud' && (!next.images || _isPlaceholderArray(next.images))) {
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
  if (componentName === 'TweetCard') {
    if (!next.tweet || !(next.tweet as Record<string,unknown>).user) {
      next.tweet = {
        id_str: '1719530838827688153',
        text: 'Pipeline intelligence just got smarter. AI-powered signals now available in every deal room.',
        full_text: 'Pipeline intelligence just got smarter. AI-powered signals now available in every deal room.',
        user: {
          id_str: '123456',
          name: 'Nexus Revenue',
          screen_name: 'nexusrevenue',
          profile_image_url_https: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=48&h=48&fit=crop',
          url: 'https://twitter.com/nexusrevenue',
          verified: false,
          is_blue_verified: true,
        },
        entities: { urls: [], user_mentions: [], hashtags: [], symbols: [] },
        created_at: 'Wed Nov 01 12:00:00 +0000 2023',
        favorite_count: 342,
        retweet_count: 87,
        reply_count: 14,
        quote_count: 23,
        url: 'https://twitter.com/nexusrevenue/status/1719530838827688153',
        display_text_range: [0, 89],
      }
    }
  }

  // ── feedback-state ──────────────────────────────────────────────────────────
  if (componentName === 'Alert') {
    if (!next.title || _isPlaceholder(next.title as string)) next.title = 'New deal signal detected'
    if (!next.description || _isPlaceholder(next.description as string)) next.description = 'Deal risk threshold exceeded for Acme Corp. Review signals now to prevent churn.'
    if (!next.type) next.type = 'warning'
    if (!next.label || _isPlaceholder(next.label as string)) next.label = 'Deal Alert'
  }
  if (componentName === 'Toast') {
    if (!next.title) next.title = 'File saved'
    if (!next.description) next.description = 'Your changes have been saved successfully.'
    if (!next.type) next.type = 'success'
  }
  if (componentName === 'EmptyState') {
    if (!next.title) next.title = 'No deals found'
    if (!next.description) next.description = 'Try adjusting your filters or add a new opportunity.'
    if (!next.actionLabel || _isPlaceholder(next.actionLabel as string)) next.actionLabel = 'Add opportunity'
  }
  if (componentName === 'ErrorState') {
    if (!next.title || _isPlaceholder(next.title as string)) next.title = 'Unable to load pipeline'
    if (!next.description || _isPlaceholder(next.description as string)) next.description = 'Could not fetch deal data. Check your CRM connection and retry.'
    if (!next.message || _isPlaceholder(next.message as string)) next.message = next.description
  }
  if (componentName === 'Loader') {
    if (!next.label || _isPlaceholder(next.label as string)) next.label = 'Loading deal signals…'
  }
  if (componentName === 'OverlayLoader') {
    if (!next.message || _isPlaceholder(next.message as string)) next.message = 'Syncing with Salesforce…'
    if (!next.text || _isPlaceholder(next.text as string)) next.text = next.message
  }
  if (componentName === 'Modal' || componentName === 'ConfirmDialog' || componentName === 'AuthRequiredModal') {
    if (next.open === undefined && next.isOpen === undefined) { next.open = true; next.isOpen = true }
    if (componentName === 'ConfirmDialog') {
      if (!next.title || _isPlaceholder(next.title as string)) next.title = 'Archive this deal?'
      if (!next.description || _isPlaceholder(next.description as string)) next.description = 'This deal will be moved to the archive. You can restore it at any time from Revenue Settings.'
      if (!next.confirmLabel || _isPlaceholder(next.confirmLabel as string)) next.confirmLabel = 'Archive'
      if (!next.cancelLabel || _isPlaceholder(next.cancelLabel as string)) next.cancelLabel = 'Cancel'
    }
  }
  if (componentName === 'CookieConsent') {
    if (next.show === undefined) next.show = true
    if (!next.message || _isPlaceholder(next.message as string)) next.message = 'We use cookies to provide personalized revenue insights and improve your experience.'
    if (!next.description || _isPlaceholder(next.description as string)) next.description = next.message
  }

  // ── className cleanup ───────────────────────────────────────────────────
  if (_isPlaceholder(next.squaresClassName as string | undefined)) next.squaresClassName = 'fill-blue-500/30'
  if (_isPlaceholder(next.segmentClassName as string | undefined)) next.segmentClassName = 'text-indigo-400'
  if (_isPlaceholder(next.textClassName as string | undefined)) next.textClassName = 'text-white font-semibold'
  if (_isPlaceholder(next.imageClassName as string | undefined)) next.imageClassName = 'rounded-md'
  if (_isPlaceholder(next.itemClassName as string | undefined)) next.itemClassName = 'text-white/80'
  if (_isPlaceholder(next.labelClassName as string | undefined)) next.labelClassName = 'text-white/60 text-sm'
  if (_isPlaceholder(next.wordClassName as string | undefined)) next.wordClassName = 'text-violet-400 font-bold'
  if (_isPlaceholder(next.iconClassName as string | undefined)) next.iconClassName = 'text-indigo-400 w-5 h-5'
  if (_isPlaceholder(next.containerClassName as string | undefined)) next.containerClassName = undefined
  if (_isPlaceholder(next.innerClassName as string | undefined)) next.innerClassName = undefined
  if (_isPlaceholder(next.wrapperClassName as string | undefined)) next.wrapperClassName = undefined
  if (_isPlaceholder(next.placeholderHeight as string | undefined)) next.placeholderHeight = '80px'

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
  if (componentName === 'CodeBlock' && (!next.code || _isPlaceholder(next.code as string))) {
    next.code = `function greet(name: string) {\n  return \`Hello, \${name}!\`\n}\n\nconsole.log(greet("World"))`
    next.language = 'typescript'
  }
  if (componentName === 'CodeEditor' && (!next.code || _isPlaceholder(next.code as string))) {
    next.code = `import { pipeline } from '@nexus/ai'\n\nconst forecast = await pipeline.run({\n  model: 'forecast-v3',\n  input: dealSignals,\n})`
    next.language = next.language && !_isPlaceholder(next.language as string) ? next.language as string : 'typescript'
  }
  if ((componentName === 'LazyLoadComponent' || componentName === 'LazyLoad' || componentName === 'LazySection') && !next.children) {
    if (typeof next.threshold !== 'number' || next.threshold < 0 || next.threshold > 1) next.threshold = 0.1
    next.children = (
      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-sm font-medium text-white/60 border border-white/10">
        Lazy loaded content
      </div>
    )
  }
  if (componentName === 'CodeComparison') {
    if (!next.beforeCode || _isPlaceholder(next.beforeCode as string)) next.beforeCode = `function hello() {\n  console.log("Hello") // [!code --]\n}`
    if (!next.afterCode || _isPlaceholder(next.afterCode as string)) next.afterCode = `function hello(name: string) {\n  console.log(\`Hello \${name}\`) // [!code ++]\n}`
    if (!next.language || _isPlaceholder(next.language as string)) next.language = 'typescript'
    if (!next.filename || _isPlaceholder(next.filename as string)) next.filename = 'hello.ts'
    if (!next.lightTheme || _isPlaceholder(next.lightTheme as string)) next.lightTheme = 'github-light'
    if (!next.darkTheme || _isPlaceholder(next.darkTheme as string)) next.darkTheme = 'github-dark'
  }
  if (componentName === 'Terminal' && !next.children) {
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
  if (componentName === 'FileTree' && !next.elements) {
    next.elements = [
      { id: 'src', name: 'src', type: 'folder', children: [
        { id: 'comp', name: 'components', type: 'folder', children: [
          { id: 'btn', name: 'Button.tsx', type: 'file' },
          { id: 'inp', name: 'Input.tsx', type: 'file' },
        ]},
        { id: 'app', name: 'App.tsx', type: 'file' },
        { id: 'main', name: 'main.tsx', type: 'file' },
      ]},
      { id: 'pkg', name: 'package.json', type: 'file' },
      { id: 'tsconfig', name: 'tsconfig.json', type: 'file' },
    ]
  }
  if (componentName === 'GanttChart') {
    const _now = new Date('2026-05-01')
    const _d = (offset: number) => new Date(_now.getTime() + offset * 24 * 60 * 60 * 1000)
    next.startDate = _d(0)
    next.endDate = _d(60)
    next.tasks = [
      { id: 'task-1', name: 'Discovery & Research', start: _d(0), end: _d(10), progress: 100, color: '#6366f1' },
      { id: 'task-2', name: 'Design System', start: _d(8), end: _d(22), progress: 75, color: '#8b5cf6' },
      { id: 'task-3', name: 'Frontend Build', start: _d(18), end: _d(40), progress: 45, color: '#06b6d4' },
      { id: 'task-4', name: 'API Integration', start: _d(25), end: _d(45), progress: 20, color: '#10b981' },
      { id: 'task-5', name: 'QA & Testing', start: _d(40), end: _d(55), progress: 0, color: '#f59e0b' },
      { id: 'task-6', name: 'Launch', start: _d(55), end: _d(60), progress: 0, color: '#ef4444' },
    ]
  }
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
  if (componentName === 'GaugeChart') {
    if (next.value === undefined) next.value = 72
    if (!next.label || _isPlaceholder(next.label as string)) next.label = 'Forecast Score'
    if (!next.name || _isPlaceholder(next.name as string)) next.name = 'Revenue Health'
    if (!next.data) {
      next.data = [
        { label: 'Pipeline Coverage', value: 80 },
        { label: 'Win Rate', value: 68 },
        { label: 'Forecast Accuracy', value: 94 },
        { label: 'NRR', value: 85 },
      ]
    }
  }
  if (componentName === 'RadarChart') {
    next.data = [
      { name: 'Pipeline Health', values: [80, 68, 94, 85, 76] },
      { name: 'Last Quarter', values: [65, 55, 80, 72, 60] },
    ]
    next.labels = ['Coverage', 'Win Rate', 'Accuracy', 'NRR', 'Velocity']
    delete (next as Record<string, unknown>).values
    delete (next as Record<string, unknown>).value
    delete (next as Record<string, unknown>).label
    delete (next as Record<string, unknown>).name
  }
  if (componentName === 'HeatmapVisualization' && (!next.data || !Array.isArray(next.data))) {
    next.data = [
      [85, 60, 45, 90, 55, 70, 40, 80, 65],
      [70, 85, 30, 65, 75, 50, 90, 45, 60],
      [55, 40, 95, 50, 85, 35, 70, 55, 80],
      [90, 70, 55, 40, 60, 80, 25, 65, 50],
      [45, 55, 75, 85, 35, 90, 60, 70, 40],
    ]
    next.labels = {
      x: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'],
      y: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }
    delete (next as Record<string, unknown>).y
    delete (next as Record<string, unknown>).x
  }
  if (componentName === 'AdvancedDataTable' && _isPlaceholder(next.emptyMessage as string | undefined)) {
    next.emptyMessage = 'No deals found'
  }

  // ── forms-authoring ──────────────────────────────────────────────────────────
  if (shelf === 'forms-authoring') {
    if (componentName === 'FormInput') {
      if (!next.label || _isPlaceholder(next.label as string)) next.label = 'Email address'
      if (!next.placeholder || _isPlaceholder(next.placeholder as string)) next.placeholder = 'team@nexus.io'
      if (!next.helperText || _isPlaceholder(next.helperText as string)) next.helperText = "We'll never share your email."
      if (!next.type) next.type = 'email'
      if (_isPlaceholder(next.containerClassName as string)) next.containerClassName = undefined
    }
    if (componentName === 'FormTextarea') {
      if (!next.label) next.label = 'Additional notes'
      if (!next.placeholder) next.placeholder = 'Describe your revenue goals…'
      if (!next.rows) next.rows = 4
      if (!next.helperText || _isPlaceholder(next.helperText as string)) next.helperText = 'Max 500 characters.'
      if (_isPlaceholder(next.containerClassName as string)) next.containerClassName = undefined
    }
    if (componentName === 'FormSelect') {
      if (!next.options || !Array.isArray(next.options) || (next.options as unknown[]).length === 0) {
        next.options = [
          { value: 'pipeline', label: 'Pipeline Intelligence' },
          { value: 'forecast', label: 'Forecast Automation' },
          { value: 'deal', label: 'Deal Execution' },
          { value: 'territory', label: 'Territory Planning' },
          { value: 'expansion', label: 'Account Expansion' },
        ]
      }
      if (!next.label) next.label = 'Product module'
      if (!next.placeholder) next.placeholder = 'Select a module…'
      if (!next.helperText || _isPlaceholder(next.helperText as string)) next.helperText = 'Choose the module for this workspace.'
    }
    if (componentName === 'FormCheckboxGroup') {
      if (!next.options || !Array.isArray(next.options) || (next.options as unknown[]).length === 0) {
        next.options = [
          { value: 'crm', label: 'CRM Sync', description: 'Salesforce, HubSpot, Dynamics' },
          { value: 'forecast', label: 'AI Forecasting', description: 'Confidence-scored predictions' },
          { value: 'signals', label: 'Deal Signals', description: 'Risk and expansion alerts' },
          { value: 'reports', label: 'Board Reports', description: 'Executive-ready summaries' },
        ]
      }
      if (!next.label) next.label = 'Enabled features'
      if (!next.helperText || _isPlaceholder(next.helperText as string)) next.helperText = 'Select the features to enable for your team.'
    }
    if (componentName === 'FormRadioGroup') {
      if (!next.options || !Array.isArray(next.options) || (next.options as unknown[]).length === 0) {
        next.options = [
          { value: 'starter', label: 'Starter', description: 'Up to 5 seats, CRM sync' },
          { value: 'growth', label: 'Growth', description: 'Unlimited seats, AI forecasting' },
          { value: 'enterprise', label: 'Enterprise', description: 'Custom SLA, dedicated CSM' },
        ]
      }
      if (!next.name || _isPlaceholder(next.name as string)) next.name = 'pricing-tier'
      if (!next.label) next.label = 'Select plan'
      if (!next.helperText || _isPlaceholder(next.helperText as string)) next.helperText = 'You can change plans at any time.'
    }
    if (componentName === 'FormToggle') {
      if (!next.label) next.label = 'Enable real-time alerts'
      if (!next.description) next.description = 'Receive deal risk notifications via Slack and email.'
    }
    if (componentName === 'FormSlider') {
      if (!next.label) next.label = 'Confidence threshold'
      if (!next.helperText) next.helperText = 'Only surface signals above this confidence score.'
    }
    if (componentName === 'FormFieldArray') {
      if (!next.label) next.label = 'Team members'
      if (!next.fields && !next.items) {
        next.fields = [
          { id: '1', name: 'Sarah Chen', role: 'CRO' },
          { id: '2', name: 'Marcus Webb', role: 'VP Revenue' },
        ]
      } else if (Array.isArray(next.fields) && next.fields.length > 0 && !(next.fields[0] as Record<string,unknown>).id) {
        next.fields = (next.fields as Record<string,unknown>[]).map((f, i) => ({ id: String(i + 1), ...f }))
      }
      next.children = (_field: Record<string, unknown>, _index: number) =>
        React.createElement('div', { className: 'flex gap-2 text-sm' },
          React.createElement('span', { className: 'font-medium' }, String(_field.name || `Item ${_index + 1}`)),
          React.createElement('span', { className: 'text-muted-foreground' }, String(_field.role || ''))
        )
      if (!next.onAdd) next.onAdd = () => {}
      if (!next.onRemove) next.onRemove = () => {}
    }
    if (componentName === 'InputAddon') {
      if (!next.label) next.label = 'Website'
      if (!next.prefix && !next.addon) { next.prefix = 'https://'; next.addon = 'https://' }
      if (!next.placeholder) next.placeholder = 'nexus.io'
    }
    if (componentName === 'BadgeInput') {
      if (!next.label) next.label = 'Tags'
      if (!next.placeholder) next.placeholder = 'Add a tag…'
      const _badgePlaceholder = (v: unknown) => !v || _isPlaceholderArray(v as unknown[])
      if (_badgePlaceholder(next.tags) && _badgePlaceholder(next.values) && _badgePlaceholder(next.items)) {
        next.tags = ['Revenue Ops', 'Forecasting', 'Deal Signals']
        next.values = next.tags
        next.items = next.tags
      }
      if (!next.suggestions || _isPlaceholderArray(next.suggestions)) {
        next.suggestions = ['Pipeline Intelligence', 'Forecast Automation', 'Deal Execution', 'Territory Planning']
      }
    }
    if (componentName === 'SearchFilter') {
      if (!next.searchPlaceholder) next.searchPlaceholder = 'Search deals…'
      if ((!next.sortOptions || (next.sortOptions as unknown[]).length === 0)) {
        next.sortOptions = [
          { label: 'Newest', value: 'newest' },
          { label: 'Revenue', value: 'revenue' },
          { label: 'Risk Score', value: 'risk' },
        ]
      }
      if (next.resultCount === undefined) next.resultCount = 142
    }
    if (componentName === 'FileUpload' || componentName === 'DragDropZone') {
      if (!next.label) next.label = 'Upload documents'
      if (!next.accept) next.accept = '.csv,.xlsx,.pdf'
      if (!next.description && !next.helperText) {
        next.description = 'CSV, Excel, or PDF — up to 10MB'
        next.helperText = next.description
      }
    }
    if (componentName === 'ColorPicker') {
      if (!next.label) next.label = 'Brand color'
      if (!next.value && !next.color && !next.defaultValue) { next.value = '#6366f1'; next.color = '#6366f1'; next.defaultValue = '#6366f1' }
      if (!next.palette || _isPlaceholderArray(next.palette)) next.palette = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ffffff', '#000000']
    }
    if (componentName === 'DateRangePicker') {
      if (!next.label) next.label = 'Reporting period'
    }
    if (componentName === 'MarkdownEditor' || componentName === 'RichTextEditor') {
      if (!next.label) next.label = 'Executive summary'
      if (!next.placeholder) next.placeholder = 'Write your deal summary…'
      if (!next.value && !next.content && !next.defaultValue) {
        const md = '## Q3 Revenue Review\n\nPipeline coverage improved to **3.2×** with a 94% forecast accuracy.'
        next.value = md; next.content = md; next.defaultValue = md
      }
      if (!next.onChange) next.onChange = () => {}
      if (next.actions && !Array.isArray(next.actions) || (Array.isArray(next.actions) && (next.actions as Record<string,unknown>[])[0]?.icon?.toString().startsWith('http'))) {
        delete (next as Record<string, unknown>).actions
      }
    }
    if (componentName === 'AdvancedAutocomplete') {
      if (!next.label) next.label = 'Account lookup'
      if (!next.placeholder) next.placeholder = 'Search accounts…'
      if (!next.options && !next.suggestions && !next.items) {
        const opts = [
          { value: 'vertex', label: 'Vertex Cloud' },
          { value: 'lattice', label: 'Lattice' },
          { value: 'runway', label: 'Runway' },
          { value: 'pave', label: 'Pave' },
          { value: 'merge', label: 'Merge' },
        ]
        next.options = opts; next.suggestions = opts; next.items = opts
      }
    }
    if (componentName === 'QRCodeGenerator') {
      if (!next.value && !next.data && !next.text) { next.value = 'https://nexus.io'; next.data = 'https://nexus.io'; next.text = 'https://nexus.io' }
      if (!next.label) next.label = 'Share link'
    }
    if (componentName === 'SignaturePad') {
      if (!next.label) next.label = 'Authorized signature'
    }
    if (componentName === 'ResizablePanel') {
      if (!next.panels || !Array.isArray(next.panels)) {
        next.panels = [
          { id: 'left', content: React.createElement('div', { className: 'h-full flex items-center justify-center p-4 text-sm text-white/50' }, 'Left panel — drag edge to resize') },
          { id: 'right', content: React.createElement('div', { className: 'h-full flex items-center justify-center p-4 text-sm text-white/50' }, 'Right panel') },
        ]
      }
      if (!next.children) next.children = (
        React.createElement('div', { className: 'flex h-full items-center justify-center p-4 text-sm text-white/60 font-medium' }, 'Drag the edge to resize this panel')
      )
    }
    if (componentName === 'pagination' || componentName === 'Pagination') {
      if (next.total === undefined && next.totalPages === undefined && next.pageCount === undefined) {
        next.total = 142; next.totalPages = 15; next.pageCount = 15
      }
      if (next.page === undefined && next.currentPage === undefined) { next.page = 3; next.currentPage = 3 }
      if (next.pageSize === undefined && next.perPage === undefined) { next.pageSize = 10; next.perPage = 10 }
    }
  }

  // ── ui-primitives ───────────────────────────────────────────────────────────
  if (shelf === 'ui-primitives') {
    if (componentName === 'Avatar' || componentName === 'AvatarCircles') {
      if (!next.src && !next.image) {
        next.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80'
        next.image = next.src
      }
      if (!next.alt) next.alt = 'User avatar'
      if (!next.name && !next.fallback) { next.name = 'Sarah Chen'; next.fallback = 'SC' }
    }
    if (componentName === 'AvatarCircles') {
      if (!next.avatars && !next.items) {
        next.avatars = [
          { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', alt: 'Sarah' },
          { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', alt: 'Marcus' },
          { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', alt: 'Priya' },
        ]
        next.items = next.avatars
      }
    }
    if (componentName === 'badge' || componentName === 'Badge') {
      if (!next.children) next.children = 'Revenue Ops'
      if (!next.variant) next.variant = 'default'
    }
    if (componentName === 'StatusBadge') {
      if (!next.status) next.status = 'active'
      if (!next.children && !next.label) { next.children = 'Healthy'; next.label = 'Healthy' }
    }
    if (componentName === 'Divider') {
      if (!next.label && !next.children) { next.label = 'or'; next.children = 'or' }
    }
    if (componentName === 'Menu') {
      if (!next.items) {
        next.items = [
          { label: 'Dashboard', href: '#' },
          { label: 'Pipeline', href: '#' },
          { label: 'Reports', href: '#' },
          { label: 'Settings', href: '#' },
        ]
      }
    }
    if (componentName === 'popover' || componentName === 'Popover') {
      if (!next.children) next.children = (
        <button className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 transition-colors">
          Open Popover
        </button>
      )
      if (!next.content) next.content = (
        <div className="p-3 text-sm text-white/70">Popover content goes here</div>
      )
    }
    if (componentName === 'sheet' || componentName === 'Sheet') {
      if (next.open === undefined && next.isOpen === undefined) { next.open = false; next.isOpen = false }
      if (!next.children) next.children = (
        <button className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 transition-colors">
          Open Sheet
        </button>
      )
    }
    if (componentName === 'tooltip' || componentName === 'Tooltip') {
      if (!next.content && !next.text) { next.content = 'Pipeline Intelligence — AI-powered deal insights'; next.text = next.content }
      if (!next.children) next.children = (
        <span className="cursor-help border-b border-dashed border-white/30 text-sm text-white/80">Hover for details</span>
      )
    }
    if (componentName === 'ToggleGroup') {
      if (!next.items && !next.options) {
        const opts = [
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'quarter', label: 'Quarter' },
        ]
        next.items = opts; next.options = opts
      }
    }
  }

  // ── navigation-command ───────────────────────────────────────────────────────
  if (componentName === 'MorphingNav' && (!Array.isArray(next.links))) {
    next.links = [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Docs', href: '#docs' },
      { label: 'Blog', href: '#blog' },
    ]
    next.logo = React.createElement('span', { className: 'text-sm font-bold text-white' }, 'Nexus')
  }
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

  for (const key of Object.keys(next)) {
    const val = next[key]
    if (!val || typeof val !== 'object' || Array.isArray(val)) continue
    const maybeReact = val as Record<string, unknown>
    if (maybeReact.$$typeof || typeof maybeReact.type === 'function') continue
    const obj = val as Record<string, unknown>
    const patch: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && _isPlaceholder(v)) patch[k] = _enrichField(k, 0, key)
    }
    if (Object.keys(patch).length > 0) next[key] = { ...obj, ...patch }
  }

  if (_isLanding) {
    if (componentName === 'LandingProductMetrics' && (!next.metrics || _isPlaceholder((next.metrics as Record<string, unknown>[])[0]?.label))) {
      next.metrics = _nx.metrics
    }
    if (componentName === 'LandingProductFeatureKeyPoints' && (!next.keyPoints || !Array.isArray(next.keyPoints) || next.keyPoints.length === 0)) {
      next.keyPoints = _nx.features.slice(0, 5).map((f, i) => ({ title: f, description: _pick(_nx.descriptions, i) }))
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
    if (componentName === 'PricingCards' && (!next.plans || _isPlaceholder((next.plans as Record<string, unknown>[])[0]?.name as string))) {
      next.plans = _nx.pricingTiers.map((t) => ({
        ...t, interval: 'month',
        cta: t.name === 'Enterprise' ? 'Talk to sales' : `Get started`,
      }))
    }
    if (componentName === 'TestimonialGrid' && (!next.testimonials || _isPlaceholder((next.testimonials as Record<string, unknown>[])[0]?.quote as string))) {
      next.testimonials = _nx.testimonials.slice(0, 3)
    }
    if (componentName === 'LandingTestimonialGrid' && !next.testimonialItems) {
      next.testimonialItems = _nx.testimonials
      next.testimonials = _nx.testimonials
    }
    if (componentName === 'LandingTestimonial' && !next.testimonialItems) {
      next.testimonialItems = _nx.testimonials.slice(0, 3)
      next.testimonials = _nx.testimonials.slice(0, 3)
    }
    if (componentName === 'SocialProof' && !next.testimonials) {
      next.testimonials = _nx.testimonials.slice(0, 3)
    }
    if (componentName === 'SocialProof' && (!next.avatars || _isPlaceholderArray(next.avatars))) {
      next.avatars = [
        { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&q=80', alt: 'Sarah' },
        { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80', alt: 'Marcus' },
        { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80', alt: 'Priya' },
      ]
    }
    if (componentName === 'LandingSocialProof' && !next.testimonials) {
      next.testimonials = _nx.testimonials
      next.avatarItems = [
        { imageSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&q=80', name: 'Sarah Chen' },
        { imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&q=80', name: 'Marcus Webb' },
        { imageSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&q=80', name: 'Priya Sharma' },
        { imageSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&q=80', name: 'Jordan Lee' },
      ]
      next.numberOfUsers = 2847
      next.showRating = true
    }
    if (componentName === 'StatsGrid' && (!next.stats || _isPlaceholder((next.stats as Record<string, unknown>[])[0]?.label as string))) {
      next.stats = _nx.metrics.map(({ label, value, detail }) => ({ label, value, description: detail }))
    }
    if (componentName === 'LandingProductStatsCarousel' && !next.stats) {
      next.stats = _nx.metrics
    }
    if (componentName === 'FeatureGrid' && (!next.features || !(next.features as Record<string, unknown>[])[0]?.icon)) {
      const _featureIcons = [BarChart2, Target, Zap, Users, TrendingUp, Shield, Globe, Layers]
      next.features = _nx.features.slice(0, 6).map((f, i) => ({ icon: _featureIcons[i % _featureIcons.length], title: f, description: _pick(_nx.descriptions, i) }))
    }
    if (componentName === 'FeatureShowcase' && (!next.features || !(next.features as Record<string, unknown>[])[0]?.icon)) {
      const _featureIcons2 = [BarChart2, Target, Zap, Users]
      next.features = _nx.features.slice(0, 4).map((f, i) => ({ icon: React.createElement(_featureIcons2[i % _featureIcons2.length], { className: 'size-5' }), title: f, description: _pick(_nx.descriptions, i) }))
    }
    if (componentName === 'WelcomeSection') {
      if (!next.name || _isPlaceholder(next.name as string)) next.name = 'Sarah Chen'
      if (!next.subtitle || _isPlaceholder(next.subtitle as string)) next.subtitle = 'CRO at Vertex Cloud'
      if (!next.avatarUrl || next.avatarUrl === '#') next.avatarUrl = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80'
      if (!next.actions || _isPlaceholder((next.actions as Record<string, unknown>[])[0]?.label as string)) {
        next.actions = [
          { label: 'View pipeline', description: 'Track all active deals', href: '#' },
          { label: 'Run forecast', description: 'See confidence-scored predictions', href: '#' },
          { label: 'Board report', description: 'Generate exec-ready summary', href: '#' },
        ]
      }
    }
    if ((componentName === 'SocialProof' || componentName === 'LandingSocialProof' || componentName === 'LandingSocialProofBand') && !next.testimonials) {
      next.testimonials = _nx.testimonials.slice(0, 3)
      if (!next.count || _isPlaceholder(next.count as string)) next.count = '2,000+'
      if (!next.label || _isPlaceholder(next.label as string)) next.label = 'Revenue leaders trust Nexus'
    }
    if (componentName === 'ProjectShowcase' && (!next.projects || _isPlaceholder((next.projects as Record<string, unknown>[])[0]?.title as string))) {
      next.projects = [
        { title: 'Pipeline Intelligence', description: 'AI-scored deal signals for every rep.', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=70', tags: ['AI', 'Revenue Ops', 'Forecasting'], liveUrl: '#', sourceUrl: '#' },
        { title: 'Buying Committee Graph', description: 'Map every stakeholder across every deal.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=70', tags: ['Graph', 'Relationships', 'Multi-thread'], liveUrl: '#', sourceUrl: '#' },
        { title: 'Revenue Capacity Planner', description: 'Model headcount scenarios against ARR.', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=70', tags: ['Planning', 'FP&A', 'Headcount'], liveUrl: '#', sourceUrl: '#' },
      ]
    }
    if (componentName === 'LogoCloud' && (!next.logos || _isPlaceholder((next.logos as Record<string, unknown>[])[0]?.name as string))) {
      next.logos = _nx.partnerNames.map((name) => ({ name, src: `https://cdn.simpleicons.org/${name.toLowerCase().replace(/\s+/g, '')}/888888` }))
    }
    if (componentName === 'HeroSection') {
      if (!next.title || _isPlaceholder(next.title as string)) next.title = 'Revenue intelligence for'
      if (!next.titleAccent || _isPlaceholder(next.titleAccent as string)) next.titleAccent = 'modern sales teams'
      if (!next.description || _isPlaceholder(next.description as string)) next.description = 'AI-powered signals that surface deal risk before it becomes revenue loss. Trusted by 2,000+ revenue teams.'
      if (!next.badge || _isPlaceholder((next.badge as Record<string, unknown>)?.text as string)) next.badge = { text: 'Now with AI Forecasting →' }
      if (!next.stats || _isPlaceholder((next.stats as Record<string, unknown>[])[0]?.label as string)) {
        next.stats = _nx.metrics.slice(0, 3).map(({ label, value }) => ({ value, label }))
      }
    }
    if (componentName === 'SplitHero' || componentName === 'GradientMeshHero' || componentName === 'TextRotateHero') {
      if (!next.title || _isPlaceholder(next.title as string)) { next.title = 'Revenue clarity starts here'; next.headline = 'Revenue clarity starts here' }
      if (!next.subtitle || _isPlaceholder(next.subtitle as string)) { next.subtitle = "Nexus gives every revenue team the signal-to-action layer they've been missing."; next.description = next.subtitle }
      if (componentName === 'TextRotateHero') {
        if (!next.words || _isPlaceholderArray(next.words)) next.words = ['pipeline clarity', 'forecast confidence', 'deal velocity', 'revenue growth']
        if (_isPlaceholder(next.wordClassName as string)) next.wordClassName = 'text-violet-400 font-bold'
      }
    }
    if (componentName === 'VideoHero' && !next.videoSrc) {
      next.videoSrc = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      next.thumbnailSrc = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80'
      next.thumbnailAlt = 'Nexus product demo'
      if (!next.title) next.title = 'See Nexus in 3 minutes'
    }
    if (componentName === 'Newsletter') {
      if (!next.title || _isPlaceholder(next.title as string)) next.title = 'Revenue insights, weekly'
      if (!next.description || _isPlaceholder(next.description as string)) next.description = 'Join 18,000 revenue leaders. Pipeline intelligence, GTM plays, and Nexus product updates.'
      if (!next.placeholder || _isPlaceholder(next.placeholder as string)) next.placeholder = 'Work email address'
      if (!next.buttonText || _isPlaceholder(next.buttonText as string)) next.buttonText = 'Subscribe'
    }
    if (componentName === 'CTASection' || componentName === 'LandingCTA') {
      if (!next.title || _isPlaceholder(next.title as string)) next.title = 'Start closing more revenue today'
      if ((!next.description && !next.subtitle) || _isPlaceholder(next.description as string)) next.description = 'Join 2,000+ revenue teams. Free to start, no credit card required.'
      if ((!next.primaryCta && !next.cta) || _isPlaceholder(next.primaryCta as string)) next.primaryCta = 'Get started free'
      if (next.primaryAction && typeof next.primaryAction === 'object') {
        const pa = next.primaryAction as Record<string, unknown>
        if (_isPlaceholder(pa.label as string)) pa.label = 'Get started free'
      }
    }
    if (componentName === 'AnnouncementBanner' && (_isPlaceholder(next.message as string) || !next.message)) {
      next.message = '🎉 Nexus AI Forecasting is now generally available — '
      next.linkText = 'See what\'s new →'
      next.text = next.message
    }
    if (componentName === 'GenericLogo') {
      if (_isPlaceholder(next.text as string) || !next.text) next.text = 'Nexus'
      if (!next.imageSrc || next.imageSrc === '#') next.imageSrc = 'https://placehold.co/40x40/6366f1/ffffff?text=N'
      if (!next.imageAlt || (next.imageAlt as string).startsWith('https://placehold.co')) next.imageAlt = 'Nexus logo'
      next.withText = true
    }
    if ((componentName === 'FAQSection' || componentName === 'LandingFAQ' || componentName === 'LandingFAQCollapsible') && (!next.faqs && !next.faqItems && (!next.items || _isPlaceholder((next.items as Record<string, unknown>[])[0]?.question as string)))) {
      const faqData = _nx.objections.map((q, i) => ({ question: q, answer: _nx.objectionAnswers[i] }))
      next.faqItems = faqData
      next.faqs = faqData
      next.items = faqData
    }
    if (componentName === 'ProductSteps' && (!next.steps || _isPlaceholder((next.steps as Record<string, unknown>[])[0]?.title as string))) {
      next.steps = [
        { title: 'Connect your CRM', description: 'Nexus syncs with Salesforce or HubSpot in under 5 minutes.', step: 1 },
        { title: 'Nexus learns your motion', description: 'AI maps your pipeline patterns, win signals, and team behavior.', step: 2 },
        { title: 'Get instant intelligence', description: 'Surface deal risk, expansion signals, and forecast confidence scores.', step: 3 },
      ]
      next.items = next.steps
    }
    if (componentName === 'TechStackGrid' && (!next.technologies && (!next.items || _isPlaceholder((next.items as Record<string, unknown>[])[0]?.name as string)))) {
      next.technologies = _nx.partnerNames.map((name, i) => ({ name, description: _pick(_nx.descriptions, i) }))
      next.items = next.technologies
    }
  }

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

  if (componentName === 'AuroraBackground' || componentName === 'AuroraBackgroundEffect') {
    if (!next.className) next.className = 'w-full h-full'
    if (!next.children) next.children = _demoHeroBg(componentName)
    if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981']
  }
  if (componentName === 'MeshGradient') {
    if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
  }
  if (componentName === 'WavyBackground') {
    if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#6366f1', '#8b5cf6', '#06b6d4']
    if (!next.className) next.className = 'w-full h-full'
  }
  if (componentName === 'GradientMeshHero') {
    if (!next.colors || _isPlaceholderArray(next.colors)) next.colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981']
  }
  if (componentName === 'ConfettiExplosion') {
    if (!next.particles || _isPlaceholderArray(next.particles)) next.particles = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444']
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

  return next
}
