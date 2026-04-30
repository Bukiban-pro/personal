'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'

/**
 * AnimatedCounter — Count-up from 0 to target when in view.
 * 60fps requestAnimationFrame with easeOutQuart easing.
 *
 * Dependencies: framer-motion (useInView)
 *
 * @example
 * <AnimatedCounter value={12500} />
 * <AnimatedCurrency value={99.99} currency="USD" locale="en-US" />
 * <AnimatedPercent value={73.5} />
 */

interface AnimatedCounterProps {
	value: number
	duration?: number
	formatFn?: (value: number) => string
	className?: string
}

export function AnimatedCounter({
	value,
	duration = 1500,
	formatFn = (v) => v.toLocaleString(),
	className = '',
}: AnimatedCounterProps) {
	const [displayValue, setDisplayValue] = useState(0)
	const ref = useRef<HTMLSpanElement>(null)
	const isInView = useInView(ref, { once: true, margin: '-50px' })
	const hasAnimated = useRef(false)

	useEffect(() => {
		if (!isInView || hasAnimated.current || value === 0) return
		hasAnimated.current = true

		const startTime = performance.now()
		const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
		let frameId: number | null = null

		const animate = (currentTime: number) => {
			const progress = Math.min((currentTime - startTime) / duration, 1)
			setDisplayValue(value * easeOutQuart(progress))
			if (progress < 1) frameId = requestAnimationFrame(animate)
			else setDisplayValue(value)
		}

		frameId = requestAnimationFrame(animate)
		return () => { if (frameId) cancelAnimationFrame(frameId) }
	}, [isInView, value, duration])

	return (
		<motion.span
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 10 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.3 }}
		>
			{formatFn(displayValue)}
		</motion.span>
	)
}

/** Animated counter formatted as currency */
export function AnimatedCurrency({
	value,
	currency = 'USD',
	locale = 'en-US',
	duration = 1500,
	className = '',
}: {
	value: number
	currency?: string
	locale?: string
	duration?: number
	className?: string
}) {
	const fmt = (v: number) =>
		new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Math.round(v))
	return <AnimatedCounter value={value} duration={duration} formatFn={fmt} className={className} />
}

/** Animated counter formatted as percentage */
export function AnimatedPercent({
	value,
	decimals = 1,
	duration = 1500,
	className = '',
}: {
	value: number
	decimals?: number
	duration?: number
	className?: string
}) {
	return <AnimatedCounter value={value} duration={duration} formatFn={v => `${v.toFixed(decimals)}%`} className={className} />
}
