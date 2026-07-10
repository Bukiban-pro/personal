import confetti from 'canvas-confetti'

/**
 * Confetti utilities — Celebration effects for user achievements and interactions.
 *
 * Dependencies: canvas-confetti (npm install canvas-confetti)
 *
 * All functions respect `disableForReducedMotion` where supported.
 *
 * @example
 * triggerConfetti() // Basic burst
 * triggerSuccessConfetti() // Two-sided green burst
 * triggerElementConfetti(buttonRef.current) // Burst from a specific element
 * triggerEpicCelebration() // 3-second sustained fireworks
 */

/** Basic confetti burst — centered */
export const triggerConfetti = (options?: confetti.Options) => {
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 },
		...options,
	})
}

/** Two-sided green burst — success actions (save, complete, etc.) */
export const triggerSuccessConfetti = () => {
	const colors = ['#10b981', '#34d399', '#6ee7b7']
	confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors })
	confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors })
}

/** Dual burst from center — big celebrations (milestones, connections, etc.) */
export const triggerDualBurstConfetti = (colors = ['#f97316', '#fb923c', '#fdba74']) => {
	const count = 150
	const defaults = { origin: { y: 0.7 } }

	const fire = (ratio: number, opts: confetti.Options) =>
		confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) })

	fire(0.25, { spread: 26, startVelocity: 55, colors })
	fire(0.2, { spread: 60, colors })
	fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors })
}

/** Gold burst — achievements, badges, rewards (alias with gold palette) */
export const triggerAchievementConfetti = (colors = ['#fbbf24', '#f59e0b', '#d97706']) =>
	triggerDualBurstConfetti(colors)

/** Element-positioned burst — anchored to a button/icon (likes, saves, bookmarks) */
export const triggerElementConfetti = (element?: HTMLElement, colors = ['#ef4444', '#f87171', '#fca5a5']) => {
	let origin: { x?: number; y: number }

	if (element) {
		const rect = element.getBoundingClientRect()
		origin = {
			x: (rect.left + rect.width / 2) / window.innerWidth,
			y: (rect.top + rect.height / 2) / window.innerHeight,
		}
	} else {
		origin = { y: 0.6 }
	}

	requestAnimationFrame(() => {
		confetti({
			particleCount: 30,
			spread: 40,
			origin,
			colors,
			ticks: 100,
			disableForReducedMotion: true,
		})
	})
}

/** Epic 3-second sustained fireworks — major milestones */
export const triggerEpicCelebration = (durationMs = 3000) => {
	const animationEnd = Date.now() + durationMs
	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

	const randomInRange = (min: number, max: number) =>
		Math.random() * (max - min) + min

	const interval = setInterval(() => {
		const timeLeft = animationEnd - Date.now()
		if (timeLeft <= 0) return clearInterval(interval)

		const particleCount = 50 * (timeLeft / durationMs)
		confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
		confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
	}, 250)
}

/** Subtle gold sparkle — positioned at element (bookmarks, favorites) */
export const triggerSparkleConfetti = (element?: HTMLElement, colors = ['#fbbf24', '#f59e0b']) => {
	let origin: { x?: number; y: number }

	if (element) {
		const rect = element.getBoundingClientRect()
		origin = {
			x: (rect.left + rect.width / 2) / window.innerWidth,
			y: (rect.top + rect.height / 2) / window.innerHeight,
		}
	} else {
		origin = { y: 0.7 }
	}

	requestAnimationFrame(() => {
		confetti({
			particleCount: 20,
			spread: 30,
			origin,
			colors,
			ticks: 80,
			disableForReducedMotion: true,
		})
	})
}
