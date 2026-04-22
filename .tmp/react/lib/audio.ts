/**
 * Audio Utilities — Programmatic sound generation via Web Audio API.
 *
 * Stolen from: ChefKix audio.ts — timer chime, urgent beep, celebration,
 * level-up, achievement sparkle, XP ping, vibrate.
 *
 * Dependencies: None (uses native Web Audio API)
 *
 * Why not audio files? Programmatic sounds are:
 * - Zero network requests (no loading, no 404)
 * - Fully customizable (pitch, duration, volume)
 * - Tiny footprint (~3KB vs 50KB+ for WAV/MP3)
 *
 * @example
 * import { playSuccessSound, playNotificationSound, vibrate } from '@/lib/audio'
 *
 * // On achievement unlock:
 * playSuccessSound()
 * vibrate([100, 50, 100]) // haptic: buzz-pause-buzz
 */

// ─── Audio Context (lazy singleton) ─────────────────

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      return null
    }
  }

  // Resume if suspended (browsers require user gesture)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }

  return audioContext
}

// ─── Core Oscillator Helpers ────────────────────────

interface ToneOptions {
  frequency: number
  duration: number
  type?: OscillatorType
  volume?: number
  startTime?: number
  fadeOut?: boolean
}

function playTone(ctx: AudioContext, options: ToneOptions): void {
  const {
    frequency,
    duration,
    type = 'sine',
    volume = 0.3,
    startTime = ctx.currentTime,
    fadeOut = true,
  } = options

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startTime)
  gainNode.gain.setValueAtTime(volume, startTime)

  if (fadeOut) {
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  }

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

// ─── Musical Note Frequencies ───────────────────────

const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
} as const

// ─── Sound Library ──────────────────────────────────

/**
 * Notification sound — gentle ascending arpeggio (C5 → E5 → G5).
 * Use for: new messages, incoming data, passive alerts.
 */
export function playNotificationSound(volume = 0.2): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  playTone(ctx, { frequency: NOTE.C5, duration: 0.15, type: 'sine', volume, startTime: now })
  playTone(ctx, { frequency: NOTE.E5, duration: 0.15, type: 'sine', volume, startTime: now + 0.1 })
  playTone(ctx, { frequency: NOTE.G5, duration: 0.2, type: 'sine', volume, startTime: now + 0.2 })
}

/**
 * Success/celebration sound — bright major chord with shimmer.
 * Use for: form submit success, purchase complete, achievement unlock.
 */
export function playSuccessSound(volume = 0.25): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // Major chord (C-E-G)
  playTone(ctx, { frequency: NOTE.C5, duration: 0.3, type: 'sine', volume, startTime: now })
  playTone(ctx, { frequency: NOTE.E5, duration: 0.3, type: 'sine', volume: volume * 0.8, startTime: now })
  playTone(ctx, { frequency: NOTE.G5, duration: 0.3, type: 'sine', volume: volume * 0.6, startTime: now })
  // Sparkle on top
  playTone(ctx, { frequency: NOTE.C6, duration: 0.15, type: 'sine', volume: volume * 0.4, startTime: now + 0.15 })
}

/**
 * Warning/urgent sound — sharp descending beep.
 * Use for: timer expiring, error alerts, required attention.
 */
export function playWarningSound(volume = 0.3): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  playTone(ctx, { frequency: NOTE.A5, duration: 0.1, type: 'square', volume, startTime: now })
  playTone(ctx, { frequency: NOTE.A5, duration: 0.1, type: 'square', volume: volume * 0.8, startTime: now + 0.15 })
  playTone(ctx, { frequency: NOTE.F4, duration: 0.2, type: 'square', volume: volume * 0.6, startTime: now + 0.3 })
}

/**
 * Error sound — low dissonant tone.
 * Use for: failed actions, validation errors requiring attention.
 */
export function playErrorSound(volume = 0.2): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  playTone(ctx, { frequency: 220, duration: 0.15, type: 'sawtooth', volume, startTime: now })
  playTone(ctx, { frequency: 180, duration: 0.25, type: 'sawtooth', volume: volume * 0.7, startTime: now + 0.1 })
}

/**
 * Achievement / level-up sound — triumphant ascending brass-like fanfare.
 * Use for: level ups, milestone unlocks, rank promotions.
 */
export function playAchievementSound(volume = 0.25): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // Ascending fanfare: C4 → E4 → G4 → C5
  playTone(ctx, { frequency: NOTE.C4, duration: 0.15, type: 'triangle', volume, startTime: now })
  playTone(ctx, { frequency: NOTE.E4, duration: 0.15, type: 'triangle', volume, startTime: now + 0.12 })
  playTone(ctx, { frequency: NOTE.G4, duration: 0.15, type: 'triangle', volume, startTime: now + 0.24 })
  playTone(ctx, { frequency: NOTE.C5, duration: 0.4, type: 'triangle', volume: volume * 1.2, startTime: now + 0.36 })
  // Harmonic shimmer
  playTone(ctx, { frequency: NOTE.E5, duration: 0.3, type: 'sine', volume: volume * 0.3, startTime: now + 0.4 })
  playTone(ctx, { frequency: NOTE.G5, duration: 0.25, type: 'sine', volume: volume * 0.2, startTime: now + 0.45 })
}

/**
 * Subtle click/tap — quick feedback for micro-interactions.
 * Use for: toggle switches, button taps, selection changes.
 */
export function playClickSound(volume = 0.1): void {
  const ctx = getAudioContext()
  if (!ctx) return

  playTone(ctx, { frequency: 800, duration: 0.03, type: 'sine', volume, startTime: ctx.currentTime })
}

// ─── Haptic Feedback ────────────────────────────────

/**
 * Trigger device vibration (mobile only, fails silently on desktop).
 * @param pattern - Duration in ms, or array of [vibrate, pause, vibrate, ...].
 *
 * @example
 * vibrate(100)           // single short buzz
 * vibrate([100, 50, 100]) // buzz-pause-buzz
 */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // Silently fail — vibration is enhancement, not requirement
    }
  }
}
