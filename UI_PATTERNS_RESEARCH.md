# Universal Reusable UI Patterns — Research Report
> Extracted from 6 open-source repos. Implementation-ready. Framework: React + TypeScript + Tailwind + Framer Motion.

---

## Table of Contents
1. [Repo Overview](#repo-overview)
2. [Pattern Catalog](#pattern-catalog)
   - [Spotlight / Magic Card](#1-spotlight--magic-card)
   - [Dot Pattern](#2-dot-pattern)
   - [Retro Grid](#3-retro-grid)
   - [Border Beam](#4-border-beam)
   - [Shimmer Button](#5-shimmer-button)
   - [Glare Hover](#6-glare-hover)
   - [Noise Texture](#7-noise-texture)
   - [Text Animations](#8-text-animations)
   - [Blur Fade](#9-blur-fade)
   - [Marquee](#10-marquee)
   - [Animated Counter / Number Ticker](#11-animated-counter--number-ticker)
   - [Sparkles Text](#12-sparkles-text)
   - [Morphing Text](#13-morphing-text)
   - [HyperText Scramble](#14-hypertext-scramble)
   - [Animated Gradient Text](#15-animated-gradient-text)
   - [Neon Gradient Card](#16-neon-gradient-card)
   - [Animated Beam](#17-animated-beam)
   - [Warp Background](#18-warp-background)
   - [Confetti / Cool Mode](#19-confetti--cool-mode)
   - [3D Mouse-Tracking Camera](#20-3d-mouse-tracking-camera)
   - [GSAP Timeline Animations](#21-gsap-timeline-animations)
   - [Scroll-Triggered Spring Animations](#22-scroll-triggered-spring-animations)
   - [GLSL Shader Effects](#23-glsl-shader-effects)
   - [Code-Editor UI Shell](#24-code-editor-ui-shell)
   - [Custom Cursor](#25-custom-cursor)
   - [Context Menu](#26-context-menu)
   - [Text Reveal Effect](#27-text-reveal-effect)
   - [Progressive Blur](#28-progressive-blur)
3. [CSS-Only Techniques](#css-only-techniques)
4. [Framer Motion Cheat Sheet](#framer-motion-cheat-sheet)
5. [Spring Physics Reference](#spring-physics-reference)

---

## Repo Overview

| # | Repo | Stars | Stack | Best Patterns |
|---|------|-------|-------|---------------|
| 1 | **magicuidesign/magicui** | 20.7k | React, TS, Tailwind, motion/react, shadcn | Everything — THE definitive component library |
| 2 | **gianlucajahn/portfolio** | ~200 | React, TS, SCSS, Framer Motion | Scroll spring animations, dark mode, animated gradient text, custom cursor/context menu |
| 3 | **adrianhajdin/threejs-portfolio** | 1k | React, Three.js, R3F, Drei, GSAP, Tailwind | 3D mouse-tracking, GSAP timelines, useVideoTexture |
| 4 | **jrefusta/joan-portfolio** | ~50 | JS, Three.js, GLSL, GSAP | GLSL shaders (smoke, CRT screen, shell texturing), 3D confetti, interactive Rubik's cube |
| 5 | **mo-hassann/developer-portfolio** | 12 | Next.js, TS, Framer Motion, Tailwind, shadcn | Code-editor UI, animated counter, text reveal animation, gradient buttons |
| 6 | **codebucks27/Next.js-Developer-Portfolio** | 1.2k | Next.js, Tailwind, Framer Motion | Repeating-radial-gradient backgrounds, conic-gradient borders, SMIL SVG animations |

---

## Pattern Catalog

---

### 1. Spotlight / Magic Card
**Source:** Magic UI — `magicui/magic-card.tsx`
**Deps:** `motion/react` (`useMotionValue`, `useSpring`, `useMotionTemplate`)

**How it works:** A radial gradient follows the mouse cursor along the card's border, creating a spotlight effect.

**Two modes:**
- **gradient** — radial gradient on border follows cursor
- **orb** — glowing orb follows cursor with spring physics

**Key implementation:**
```tsx
// Mouse tracking
const mouseX = useMotionValue(-gradientSize);
const mouseY = useMotionValue(-gradientSize);

const handleMouseMove = (e: React.MouseEvent) => {
  const { left, top } = e.currentTarget.getBoundingClientRect();
  mouseX.set(e.clientX - left);
  mouseY.set(e.clientY - top);
};

// Gradient mode — radial gradient follows cursor
const background = useMotionTemplate`
  radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
    ${gradientColor}, transparent 100%)
`;

// Orb mode — spring physics for smooth following
const orbX = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.6 });
const orbY = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.6 });
```

**CSS trick for animated borders:**
```css
/* padding-box for background, border-box for gradient border */
background: linear-gradient(bg-color, bg-color) padding-box,
            radial-gradient(...) border-box;
border: 1px solid transparent;
```

**Spring configs:**
- Orb position: `stiffness: 250, damping: 30, mass: 0.6`
- Visibility: `stiffness: 300, damping: 35`

---

### 2. Dot Pattern
**Source:** Magic UI — `magicui/dot-pattern.tsx`
**Deps:** `motion/react`

**How it works:** SVG-based dot grid rendered from container dimensions. Optional glow animation per dot.

**Key implementation:**
```tsx
// Calculate dot grid
const cols = Math.ceil(width / spacing);
const rows = Math.ceil(height / spacing);

// Glow dot animation
<motion.circle
  animate={{
    opacity: [0.4, 1, 0.4],
    scale: [1, 1.5, 1],
  }}
  transition={{
    duration: randomBetween(2, 4),
    delay: randomBetween(0, 3),
    repeat: Infinity,
  }}
/>
```

**Masking technique (vignette fade):**
```css
[mask-image: radial-gradient(300px circle at center, white, transparent)]
```

---

### 3. Retro Grid
**Source:** Magic UI — `magicui/retro-grid.tsx`
**Deps:** None (CSS fallback) or WebGL

**How it works:** Perspective-projected vanishing grid with scroll animation.

**Constants:** `PERSPECTIVE_PX=200`, `ANIMATION_DURATION=15s`, `cellSize=60`, angle clamped 1-89°

**CSS fallback:**
```css
.grid {
  perspective: 200px;
  transform: rotateX(var(--angle));
  background: repeating-linear-gradient(...);
  animation: scroll var(--duration) linear infinite;
}

@keyframes scroll {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-1 * var(--cell-size))); }
}
```

---

### 4. Border Beam
**Source:** Magic UI — `magicui/border-beam.tsx`
**Deps:** `motion/react`

**How it works:** An animated gradient dot travels along the border using CSS `offset-path`.

**Key implementation:**
```tsx
<motion.div
  style={{
    width: size,
    offsetPath: `rect(0 auto auto 0 round ${size}px)`,
    "--color-from": colorFrom,  // default: #ffaa40
    "--color-to": colorTo,      // default: #9c40ff
  }}
  className="bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent"
  initial={{ offsetDistance: `${initialOffset}%` }}
  animate={{
    offsetDistance: reverse
      ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
      : [`${initialOffset}%`, `${100 + initialOffset}%`],
  }}
  transition={{
    repeat: Infinity,
    ease: "linear",
    duration, // default: 6
    delay: -delay,
  }}
/>
```

**Container masking (keeps beam on border only):**
```css
mask: linear-gradient(transparent, transparent),
      linear-gradient(#000, #000);
mask-composite: intersect;
mask-clip: padding-box, border-box;
```

**Props:** `size=50`, `duration=6`, `delay=0`, `colorFrom=#ffaa40`, `colorTo=#9c40ff`, `reverse=false`, `initialOffset=0`, `borderWidth=1`

**Multi-beam example (dual beams):**
```tsx
<BorderBeam duration={6} size={400} className="from-transparent via-red-500 to-transparent" />
<BorderBeam duration={6} delay={3} size={400} borderWidth={2} className="from-transparent via-blue-500 to-transparent" />
```

---

### 5. Shimmer Button
**Source:** Magic UI — `magicui/shimmer-button.tsx`
**Deps:** None (CSS-only)

**How it works:** Layered structure using `conic-gradient` rotation + shimmer slide.

**CSS variables:**
```css
--spread: 90deg;
--shimmer-color: #ffffff;
--radius: 100px;
--speed: 3s;
--cut: 0.1em;
--bg: rgba(0, 0, 0, 1);
```

**Keyframes:**
```css
@keyframes spin-around {
  0% { transform: translateZ(0) rotate(0); }
  15%, 35% { transform: translateZ(0) rotate(90deg); }
  65%, 85% { transform: translateZ(0) rotate(270deg); }
  100% { transform: translateZ(0) rotate(360deg); }
}

@keyframes shimmer-slide {
  to { transform: translate(calc(100cqw - 100%), 0); }
}
```

**Structure:** spark container (blurred conic-gradient) → highlight (inset box-shadow) → backdrop

---

### 6. Glare Hover
**Source:** Magic UI — `magicui/glare-hover.tsx`
**Deps:** None (pure CSS)

**How it works:** `::before` pseudo-element with sweeping linear-gradient on hover.

**CSS variables:**
```css
--gh-angle: 135deg;
--gh-duration: 500ms;
--gh-size: 200%;
--gh-rgba: rgba(255, 255, 255, 0.3);
```

**Implementation:**
```css
&::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--gh-angle),
    transparent 60%,
    var(--gh-rgba) 70%,
    transparent 100%
  );
  background-size: var(--gh-size) var(--gh-size);
  background-position: -100% -100%;
  transition: background-position var(--gh-duration) ease;
}

&:hover::before {
  background-position: 200% 200%;
}
```

---

### 7. Noise Texture
**Source:** Magic UI — `magicui/noise-texture.tsx`
**Deps:** None (SVG)

**How it works:** SVG `feTurbulence` fractal noise with contrast/slope controls.

```tsx
<svg className="pointer-events-none absolute inset-0 z-0 size-full opacity-50 select-none">
  <filter id={filterId}>
    <feTurbulence
      type="fractalNoise"
      baseFrequency={0.4}    // density of noise
      numOctaves={6}          // detail levels
      stitchTiles="stitch"
    />
    <feComponentTransfer>
      <feFuncR type="linear" slope={0.15} />
      <feFuncG type="linear" slope={0.15} />
      <feFuncB type="linear" slope={0.15} />
      <feFuncA type="linear" slope={0.6} />
    </feComponentTransfer>
  </filter>
  <rect width="100%" height="100%" filter={`url(#${filterId})`} />
</svg>
```

**Props:** `frequency=0.4`, `octaves=6`, `slope=0.15`, `noiseOpacity=0.6`

---

### 8. Text Animations
**Source:** Magic UI — `magicui/text-animate.tsx`
**Deps:** `motion/react` (`AnimatePresence`, `motion`, `Variants`)

**Architecture:** Split text by `word | character | line | text` → stagger animate each segment.

**Available animation presets:**
| Preset | Hidden State | Show State |
|--------|-------------|------------|
| `fadeIn` | `opacity: 0, y: 20` | `opacity: 1, y: 0` |
| `blurIn` | `opacity: 0, filter: blur(10px)` | `opacity: 1, filter: blur(0px)` |
| `blurInUp` | `opacity: 0, filter: blur(10px), y: 20` | `opacity: 1, filter: blur(0px), y: 0` |
| `blurInDown` | `opacity: 0, filter: blur(10px), y: -20` | same |
| `slideUp` | `y: 20, opacity: 0` | `y: 0, opacity: 1` |
| `slideDown` | `y: -20, opacity: 0` | `y: 0, opacity: 1` |
| `slideLeft` | `x: 20, opacity: 0` | `x: 0, opacity: 1` |
| `slideRight` | `x: -20, opacity: 0` | `x: 0, opacity: 1` |
| `scaleUp` | `scale: 0.5, opacity: 0` | `scale: 1, opacity: 1` |
| `scaleDown` | `scale: 1.5, opacity: 0` | `scale: 1, opacity: 1` |

**Stagger timings:**
```ts
const staggerTimings = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
};
```

**Container variants:**
```ts
const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0, staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
```

**Custom spring variant example (wavy character entrance):**
```ts
{
  hidden: { opacity: 0, y: 30, rotate: 45, scale: 0.5 },
  show: (i) => ({
    opacity: 1, y: 0, rotate: 0, scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      y: { type: "spring", damping: 12, stiffness: 200, mass: 0.8 },
      rotate: { type: "spring", damping: 8, stiffness: 150 },
      scale: { type: "spring", damping: 10, stiffness: 300 },
    },
  }),
}
```

**Usage examples:**
```tsx
<TextAnimate animation="blurInUp" by="character" once>Blur in</TextAnimate>
<TextAnimate animation="fadeIn" by="line" as="p">{multilineText}</TextAnimate>
<TextAnimate animation="scaleUp" by="text">Scale up</TextAnimate>
```

---

### 9. Blur Fade
**Source:** Magic UI — `magicui/blur-fade.tsx`
**Deps:** `motion/react`

**Props:** `duration=0.4`, `delay=0`, `offset=6`, `direction="down"` (up/down/left/right), `inView=false`

**Usage pattern (staggered section reveal):**
```tsx
<BlurFade delay={0.25} inView>
  <h2 className="text-3xl font-bold">Hello World 👋</h2>
</BlurFade>
<BlurFade delay={0.25 * 2} inView>
  <span className="text-xl">Nice to meet you</span>
</BlurFade>
```

---

### 10. Marquee
**Source:** Magic UI — `magicui/marquee.tsx`
**Deps:** None (CSS animation)

**Keyframes:**
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - var(--gap))); }
}

@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--gap))); }
}
```

**Animation:** `marquee var(--duration) infinite linear`

**Alternative (from mo-hassann):** Uses `react-fast-marquee` with `autoFill` and `pauseOnClick` props.

---

### 11. Animated Counter / Number Ticker
**Source:** mo-hassann — `components/sections/about/animated-counter.tsx`
**Deps:** `framer-motion` (`animate`, `useInView`, `useIsomorphicLayoutEffect`)

**Implementation:**
```tsx
const AnimatedCounter = ({ from, to }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !inView) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      ref.current.textContent = String(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 4,
      ease: "easeOut",
      onUpdate(value) {
        ref.current!.textContent = value.toFixed(0);
      },
    });

    return () => controls.stop();
  }, [inView, from, to]);

  return <span ref={ref} />;
};
```

---

### 12. Sparkles Text
**Source:** Magic UI — `magicui/sparkles-text.tsx`
**Deps:** `motion/react`

**Sparkle animation config:**
```tsx
<motion.svg
  initial={{ opacity: 0, left: x, top: y }}
  animate={{
    opacity: [0, 1, 0],
    scale: [0, scale, 0],
    rotate: [75, 120, 150],
  }}
  transition={{ duration: 0.8, repeat: Infinity, delay }}
  width="21" height="21" viewBox="0 0 21 21"
>
  <path d="M9.82531 0.843845C10.0553 ..." fill={color} />
</motion.svg>
```

Sparkles are positioned randomly around the text with random delays to create a continuous twinkling effect.

---

### 13. Morphing Text
**Source:** Magic UI — `magicui/morphing-text.tsx`
**Deps:** None (requestAnimationFrame)

**How it works:** Two overlapping text elements with complementary blur + opacity. Text morphs by cross-fading with blur.

**Key math:**
```ts
// Text 2 (incoming): fraction controls reveal
text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

// Text 1 (outgoing): inverted fraction controls hide
const invertedFraction = 1 - fraction;
text1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
text1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;
```

Uses `morphTime` and `cooldownTime` to control pacing between text transitions.

---

### 14. HyperText Scramble
**Source:** Magic UI — `magicui/hyper-text.tsx`
**Deps:** None (requestAnimationFrame)

**How it works:** Characters scramble through a random character set before settling on final text.

```ts
const DEFAULT_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const animate = (currentTime) => {
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);

  iterationCount.current = progress * maxIterations;

  setDisplayText((currentText) =>
    currentText.map((letter, index) =>
      letter === " "
        ? letter
        : index <= iterationCount.current
          ? children[index]                              // revealed
          : characterSet[getRandomInt(characterSet.length)]  // scrambled
    )
  );
};
```

**Props:** `duration=800ms`, `delay=0`, `startOnView=false`, `animateOnHover=true`

---

### 15. Animated Gradient Text
**Source:** gianlucajahn + Magic UI

**CSS-only animated gradient (gianlucajahn):**
```css
.manifest {
  background: linear-gradient(300deg, #ffee07, #ff2b6a, #ab4bff, #5ca2ff, #df1700);
  background-size: 360% 360%;
  animation: gradient-animation 30s ease infinite;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**mo-hassann gradient utility:**
```css
.text-gradient-primary {
  @apply bg-gradient-primary text-transparent bg-clip-text;
}
/* Where bg-gradient-primary = linear-gradient(45deg, var(--gradient-primary)) */
```

---

### 16. Neon Gradient Card
**Source:** Magic UI — `magicui/neon-gradient-card.tsx`
**Deps:** CSS animation

**Keyframes:**
```css
@keyframes background-position-spin {
  0% { background-position: top center; }
  100% { background-position: bottom center; }
}
/* Animation: background-position-spin 3000ms infinite alternate */
```

---

### 17. Animated Beam
**Source:** Magic UI — `magicui/animated-beam.tsx`
**Deps:** `motion/react`

**How it works:** SVG path connects two DOM elements (via refs). Animated gradient travels along the path.

**Props:**
```ts
containerRef: RefObject<HTMLElement>  // parent container
fromRef: RefObject<HTMLElement>       // start element
toRef: RefObject<HTMLElement>         // end element
curvature?: number                    // default: 0
reverse?: boolean
duration?: number                     // default: 5
pathColor?: string                    // default: "gray"
pathWidth?: number                    // default: 2
pathOpacity?: number                  // default: 0.2
gradientStartColor?: string           // default: #ffaa40
gradientStopColor?: string            // default: #9c40ff
```

**Usage pattern (integration diagram):**
```tsx
const containerRef = useRef(null);
const fromRef = useRef(null);
const toRef = useRef(null);

<div ref={containerRef}>
  <Circle ref={fromRef}><Icon /></Circle>
  <Circle ref={toRef}><Icon /></Circle>
  <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
</div>
```

---

### 18. Warp Background
**Source:** Magic UI — `magicui/warp-background.tsx`
**Deps:** `motion/react`

**How it works:** Perspective grid with animated beams rising from bottom to top.

**Beam generation:**
```tsx
const Beam = ({ width, x, delay, duration }) => {
  const hue = Math.floor(Math.random() * 360);
  const ar = Math.floor(Math.random() * 10) + 1;

  return (
    <motion.div
      style={{
        "--background": `linear-gradient(hsl(${hue} 80% 60%), transparent)`,
      }}
      initial={{ y: "100cqmax", x: "-50%" }}
      animate={{ y: "-100%", x: "-50%" }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
};
```

**Props:** `perspective=100`, `beamsPerSide=3`, `beamSize=5`, `beamDelayMax=3`, `beamDelayMin=0`, `beamDuration=3`

---

### 19. Confetti / Cool Mode
**Sources:** Magic UI (`cool-mode.tsx`), joan-portfolio (`Confetti.js`)

**Magic UI Cool Mode:** Click-to-spawn particles with physics (gravity, velocity). Uses DOM elements.
- Touch/mouse detection: `"ontouchstart" in window`
- Particle generation delay: 30ms
- Uses `requestAnimationFrame` loop

**joan-portfolio 3D Confetti (Three.js):**
```js
// InstancedMesh for performance (100 particles)
this.particles = new InstancedMesh(geometry, material, CONFETTI_AMOUNT);

// Physics per particle
destination.y -= randomFromTo(3, 6);  // gravity
const speedX = (destination.x - current.x) / 8000;  // drift
const speedY = (destination.y - current.y) / 10000;  // fall speed
const speedZ = (destination.z - current.z) / 8000;

// Random rotation per particle
rotateSpeed = { x: ±0.4, y: ±0.4, z: ±0.4 };
```

---

### 20. 3D Mouse-Tracking Camera
**Source:** adrianhajdin — `HeroCamera.jsx`
**Deps:** `@react-three/fiber`, `maath` (easing library)

**How it works:** Camera smoothly follows mouse pointer with easing.

```jsx
useFrame((state, delta) => {
  // Smooth camera position easing
  easing.damp3(state.camera.position, [0, 0, 20], 0.25, delta);

  // Mouse-driven rotation
  if (isMobile) {
    easing.dampE(group.current.rotation, [state.pointer.y / 10, 0, 0], 0.25, delta);
  } else {
    easing.dampE(
      group.current.rotation,
      [-state.pointer.y / 3, state.pointer.x / 5, 0],
      0.25,
      delta
    );
  }
});
```

**Key math:** `[-state.pointer.y / 3, state.pointer.x / 5, 0]` — X rotation from vertical mouse, Y rotation from horizontal mouse. Division factors control sensitivity.

---

### 21. GSAP Timeline Animations
**Source:** adrianhajdin + joan-portfolio
**Deps:** `gsap`

**Pattern: Staggered entrance (Rings.jsx)**
```js
gsap.timeline({ repeat: -1 })
  .to(group.current.rotation, {
    y: `+=${Math.PI * 2}`,
    duration: 2.5,
    stagger: { each: 0.15 },
  });
```

**Pattern: Hover-triggered rotation (Cube.jsx)**
```js
gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
  .to(meshRef.current.rotation, {
    y: hovered ? "+=2" : `+=${Math.PI * 2}`,
    x: hovered ? "+=2" : `-=${Math.PI * 2}`,
    duration: 2.5,
    stagger: { each: 0.15 },
  });
```

**Pattern: Yoyo bounce (Target.jsx)**
```js
gsap.to(targetRef.current.position, {
  y: targetRef.current.position.y + 0.5,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
});
```

**Pattern: Camera movement with easing (joan-portfolio Navigation.js)**
```js
gsap.to(camera.position, {
  x, y, z,
  duration: 1,
  ease: "sine.out",
});
```

**Pattern: Win celebration with elastic + back easing (joan-portfolio RubiksCube.js)**
```js
gsap.to(child.position, { ...originalPos, duration: 2, ease: "elastic.in" });
gsap.to(group.scale, { ...originalScale, duration: 2, ease: "circ.out" });
gsap.to(group.rotation, {
  x: Math.PI * 3, y: origY + Math.PI * 6, z: Math.PI * 3,
  duration: 2.2, ease: "back.in",
  onComplete: () => confetti.explode(),
});
```

---

### 22. Scroll-Triggered Spring Animations
**Source:** gianlucajahn/portfolio
**Deps:** `framer-motion`

**Pattern: Slide-up on scroll (all sections)**
```tsx
<motion.h3
  initial={{ y: 300 }}
  whileInView={{ y: 0 }}
  viewport={{ once: true }}
>
  Projects
</motion.h3>
```

**Pattern: Spring entrance with bounce**
```tsx
<motion.h3
  initial={{ y: 350 }}
  whileInView={{ y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
>
  Resume
</motion.h3>
```

**Pattern: Scale-in cards with staggered delays**
```tsx
<motion.div
  initial={{ scale: 0 }}
  whileInView={{ scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: 0.35 }}
>
  <SkillTab />
</motion.div>
```

**Pattern: Slide-in from sides (contact section)**
```tsx
<motion.div
  initial={{ x: -250, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  viewport={{ once: true }}
  transition={{
    opacity: { duration: 0.3, delay: 0.3 },
    x: { duration: 0.8, type: "spring", delay: 0.25 },
  }}
/>
```

**Pattern: Hero staggered entrance**
```tsx
// Avatar: spring
initial={{ opacity: 0, y: 350 }}
animate={{ opacity: 1, y: 0 }}
transition={{ type: "spring", duration: 0.6 }}

// Name: staggered spring
initial={{ opacity: 0, y: 140 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.2, opacity: { duration: 0.2, type: "tween" }, y: { duration: 0.55, type: "spring" } }}

// Title: further delayed
transition={{ delay: 0.29, ... }}

// Description: even more delayed
transition={{ delay: 0.5, ... }}

// CTA button: final
transition={{ delay: 0.7, ... }}
```

**Pattern: Image hover scale**
```tsx
<motion.img
  whileHover={{ scale: 1.025 }}
  transition={{ type: "tween", duration: 0.15 }}
/>
```

---

### 23. GLSL Shader Effects
**Source:** joan-portfolio — `shaders/`

**Coffee Steam (Perlin noise distortion):**
```glsl
// vertex.glsl — twist + wind
float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r;
float angle = twistPerlin * 10.0;
newPosition.xz = rotate2D(newPosition.xz, angle);

vec2 windOffset = vec2(
  texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
  texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
);
windOffset *= pow(uv.y, 2.0) * 1.0;

// fragment.glsl — smoke with edge fade
float smoke = texture(uPerlinTexture, smokeUv).r;
smoke = smoothstep(0.4, 1.0, smoke);
smoke *= smoothstep(0.0, 0.1, vUv.x);  // left edge
smoke *= smoothstep(1.0, 0.9, vUv.x);  // right edge
smoke *= smoothstep(0.0, 0.1, vUv.y);  // bottom edge
smoke *= smoothstep(1.0, 0.2, vUv.y);  // top edge (wider fade)
gl_FragColor = vec4(0.7, 0.7, 0.7, smoke);
```

**CRT Screen Effect:**
```glsl
// Barrel distortion
vec2 curveRemapUV(vec2 uv) {
  uv = uv * 2.0 - 1.0;
  vec2 offset = abs(uv.yx) / vec2(uCurvature.x, uCurvature.y);
  uv = uv + uv * offset * offset;
  uv = uv * 0.5 + 0.5;
  return uv;
}

// Scan lines
float intensity = sin(uv * resolution * PI * 2.0);
intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;

// Vignette
float intensity = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
clamp(pow((resolution.x / roundness) * intensity, opacity), 0.0, 1.0);
```

**Shell Texturing (Carpet fur):**
```glsl
// Vertex: offset along normal per shell layer
float shellHeight = uShellIndex / uShellCount;
shellHeight = pow(shellHeight, 0.1);
vPosition += normal.xyz * uShellLength * shellHeight;

// Fragment: hash-based fur density
uint seed = tid.x + uint(100.0) * tid.y + uint(100.0) * uint(10.0);
float rand = hash(seed);
float h = uShellIndex / uShellCount;
bool outside = localDistanceFromCenter > (uThickness * (rand - h));
if (outside && uShellIndex > 0.0 || distanceToCenter > 0.5 || rand < h) discard;
```

---

### 24. Code-Editor UI Shell
**Source:** mo-hassann/developer-portfolio
**Deps:** `react-resizable-panels`, shadcn

**Layout structure:**
```tsx
<div className="flex flex-col size-full">
  <Header />           {/* Tab bar: _Home.ts, _About.ts, _Projects.ts */}
  <div className="flex size-full">
    <Sidebar />         {/* Icon sidebar */}
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={91}>
        <LinesNumber />  {/* Line numbers gutter */}
        <div className="overflow-y-auto">{children}</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={9}>
        <Terminal />     {/* Fake terminal */}
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
  <Footer />
</div>
```

**Terminal simulation:**
```tsx
// On route change, simulate compilation
useEffect(() => {
  setTimeout(() => {
    setTerminalLines(prev => [...prev, `GET ${pathname} in ${Math.floor(Math.random() * 1000)}ms`]);
  }, 600);
  setTimeout(() => {
    setTerminalLines(prev => [...prev, `✓ Compiled in ${(Math.random() * 1.5).toFixed(2)}s (${Math.floor(Math.random() * 1000)} modules)`]);
  }, 1000);
}, [pathname]);
```

**Active tab indicator:**
```tsx
const BorderActive = () => (
  <>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
    <div className="absolute -bottom-0.5 left-0 w-full h-1 bg-background" />
  </>
);
```

**Text reveal animation (mo-hassann HomeSection):**
```tsx
const TextAnimation = ({ children }) => (
  <div className="overflow-hidden relative">
    {/* Gradient wipe mask */}
    <motion.div
      className="absolute top-0 left-0 h-full w-full bg-gradient-primary origin-left"
      initial={{ scaleX: 1 }}
      animate={{ scaleX: [1, 0] }}
      transition={{ duration: 0.5 }}
    />
    {/* Text slides in from above */}
    <motion.div
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {children}
    </motion.div>
  </div>
);
```

---

### 25. Custom Cursor
**Source:** gianlucajahn/portfolio
**Deps:** Event listeners

**Pattern:** `cursor: none` globally, track mouse position, render custom div.
```css
* { cursor: none; }
```
```tsx
onMouseMove={(e) => setCursorLocation(e)}
onMouseDown={(e) => setCursorAppearance(e)}
onMouseUp={(e) => setCursorAppearance(e)}
```

---

### 26. Context Menu
**Source:** gianlucajahn/portfolio

**CSS pattern:**
```scss
.context-menu {
  position: absolute;
  z-index: 50;
  border-radius: 20px;
  backdrop-filter: blur(6px);
  visibility: hidden;   /* shown via JS */

  .context-menu-item {
    transition: 0.2s scale, 0.2s background-color, 0.2s transform;
    &:active { transform: scale(0.95); }
    &:hover {
      background-color: #0064ff;
      scale: 1.07;
    }
  }
}
```

---

### 27. Text Reveal Effect
**Source:** Magic UI — `magicui/text-reveal.tsx`

Fade-in text as you scroll. Uses `useMotionValueEvent` on scroll progress to reveal words/characters progressively.

---

### 28. Progressive Blur
**Source:** Magic UI — `magicui/progressive-blur.tsx`

Smooth blur gradient at edges of scrollable content, indicating more content exists.

---

## CSS-Only Techniques

### Repeating Radial Gradient (Background dots)
```css
/* From codebucks27 */
background-image: repeating-radial-gradient(
  rgba(0, 0, 0, 0.4) 2px,
  transparent 5px
);
background-size: 30px 30px;

/* Dark mode variant */
background-image: repeating-radial-gradient(
  rgba(255, 255, 255, 0.4) 2px,
  transparent 5px
);
```

### Conic Gradient Border
```css
/* Animated rotating border */
background: conic-gradient(from var(--angle), color1, color2, color1);
animation: spin 3s linear infinite;
```

### Mask Image (Vignette / Fade edges)
```css
/* Radial fade */
mask-image: radial-gradient(300px circle at center, white, transparent);

/* Linear fade at bottom */
mask-image: linear-gradient(to bottom, white 80%, transparent 100%);
```

### Gradient Button Outline (mo-hassann)
```css
.gradient-outline-button {
  position: relative;
  background-clip: padding-box;
  border: 2px solid transparent;
  background-color: var(--background);
}
.gradient-outline-button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  margin: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, var(--gradient-primary));
}
```

### Frosted Glass Navbar
```css
nav {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 38px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
}
```

### Scrollbar Styling
```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track {
  background: #ccc;
  margin: 8px;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb {
  background: #3f3f3f;
  border-radius: 20px;
}
```

---

## Framer Motion Cheat Sheet

### Core Patterns
```tsx
// 1. Entrance animation
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

// 2. Scroll-triggered
<motion.div
  initial={{ y: 200 }}
  whileInView={{ y: 0 }}
  viewport={{ once: true }}
/>

// 3. Hover effect
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />

// 4. Staggered children
<motion.div variants={containerVariants} initial="hidden" animate="show">
  <motion.div variants={itemVariants} />
  <motion.div variants={itemVariants} />
</motion.div>

// 5. Layout animation
<motion.div layout />  // auto-animates position/size changes

// 6. Mouse tracking
const mouseX = useMotionValue(0);
const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
```

### Transition Types
```tsx
// Tween (default)
transition={{ duration: 0.3, ease: "easeInOut" }}

// Spring
transition={{ type: "spring", stiffness: 300, damping: 30 }}
transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}

// Infinite repeat
transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}

// Per-property
transition={{
  opacity: { duration: 0.3, delay: 0.3 },
  x: { duration: 0.8, type: "spring", delay: 0.25 },
}}
```

---

## Spring Physics Reference

| Use Case | Stiffness | Damping | Mass | Bounce |
|----------|-----------|---------|------|--------|
| Spotlight orb follow | 250 | 30 | 0.6 | — |
| Spotlight visibility | 300 | 35 | — | — |
| Skill card entrance | — | — | — | 0.4 |
| Wavy character Y | 200 | 12 | 0.8 | — |
| Wavy character rotate | 150 | 8 | — | — |
| Wavy character scale | 300 | 10 | — | — |
| Hero avatar entrance | spring | — | — | — (duration: 0.6) |
| Nav bar entrance | spring | — | — | — (duration: 0.7) |
| Button entrance | spring | — | — | — (duration: 0.5) |
| Contact slide-in | spring | — | — | — (duration: 0.8) |
| 3D camera tracking | — | — | — | — (easing.damp3 factor: 0.25) |

**Rules of thumb:**
- **High stiffness (300+):** Snappy, responsive (buttons, toggles)
- **Low stiffness (100-200):** Gentle, flowing (page elements)
- **High damping (30+):** Less oscillation (UI controls)
- **Low damping (8-15):** Bouncy, playful (decorative elements)
- **Mass > 1:** Heavy, sluggish feel
- **Mass < 1:** Light, zippy feel

---

## Complete Component Registry (Magic UI)

### Layout
`marquee`, `bento-grid`, `dock`

### Hero
`globe`, `warp-background`, `animated-grid-pattern`, `retro-grid`

### Text Motion
`text-animate` (10 presets), `typing-animation`, `blur-fade`, `text-reveal`, `sparkles-text`, `morphing-text`, `hyper-text`, `word-rotate`, `number-ticker`, `spinning-text`, `aurora-text`, `video-text`, `line-shadow-text`, `animated-gradient-text`, `animated-shiny-text`, `comic-text`, `text-3d-flip`

### Buttons
`shiny-button`, `shimmer-button`, `rainbow-button`, `ripple-button`, `cool-mode`

### Cards
`magic-card`, `neon-gradient-card`, `glare-hover`

### Ambient Effects
`particles`, `flickering-grid`, `dot-pattern`, `grid-pattern`, `light-rays`, `noise-texture`, `animated-theme-toggler`

### Special Effects
`animated-beam`, `border-beam`, `shine-border`, `meteors`, `confetti`

### Utilities
`progressive-blur`, `smooth-cursor`, `orbiting-circles`, `animated-circular-progress-bar`, `scroll-based-velocity`
