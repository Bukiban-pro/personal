'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { DURATIONS, EASINGS } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * StaggerContainer + staggerItemVariants — Drop-in list animation.
 *
 * Dependencies: framer-motion, motion.ts
 *
 * Usage:
 * ```tsx
 * <StaggerContainer>
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={staggerItemVariants}>
 *       <Card {...item} />
 *     </motion.div>
 *   ))}
 * </StaggerContainer>
 * ```
 */

interface StaggerContainerProps {
	children: ReactNode
	className?: string
	staggerDelay?: number
}

export function StaggerContainer({
	children,
	className,
	staggerDelay = 0.1,
}: StaggerContainerProps) {
	const prefersReducedMotion = useReducedMotion()

	const variants = prefersReducedMotion
		? { hidden: {}, visible: {} }
		: {
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: { staggerChildren: staggerDelay },
				},
			}

	return (
		<motion.div
			className={className}
			initial='hidden'
			animate='visible'
			variants={variants}
		>
			{children}
		</motion.div>
	)
}

export const staggerItemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: DURATIONS.slow / 1000,
			ease: EASINGS.smooth,
		},
	},
}
