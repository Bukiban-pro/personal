import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Footer — Multi-column responsive footer with link groups and bottom bar.
 *
 * Stolen from: Bookverse Footer — dark footer with link columns and copyright row.
 *
 * Features:
 * - Slot-based: pass link groups as data, render automatically
 * - Bottom bar with copyright + extra links
 * - Responsive: stacks columns on mobile, rows on desktop
 * - Dark by default (bg-black text-white), easily overrideable
 *
 * Dependencies: cn()
 *
 * @example
 * <Footer
 *   brand={<Logo className="h-8" />}
 *   tagline="A marketplace for book lovers."
 *   columns={[
 *     { title: 'Quick Links', links: [{ label: 'Browse', href: '/browse' }, ...] },
 *     { title: 'Support', links: [{ label: 'FAQ', href: '/faq' }, ...] },
 *     { title: 'Legal', links: [{ label: 'Terms', href: '/terms' }, ...] },
 *   ]}
 *   bottomLinks={[
 *     { label: 'Terms of Service', href: '/terms' },
 *     { label: 'Privacy Policy', href: '/privacy' },
 *   ]}
 * />
 */

interface FooterLink {
	label: string
	href: string
}

interface FooterColumn {
	title: string
	links: FooterLink[]
}

interface FooterProps {
	/** Brand element (logo, wordmark, etc.) */
	brand?: ReactNode
	/** Short tagline below brand */
	tagline?: string
	/** Link columns */
	columns?: FooterColumn[]
	/** Additional links in the bottom bar */
	bottomLinks?: FooterLink[]
	/** Override copyright text. Defaults to "© {year} All Rights Reserved." */
	copyright?: string
	/** Custom link component (Next.js Link, React Router Link, etc.) */
	linkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }>
	className?: string
}

export function Footer({
	brand,
	tagline,
	columns = [],
	bottomLinks = [],
	copyright,
	linkComponent: LinkComp = 'a' as unknown as React.ComponentType<{ href: string; className?: string; children: ReactNode }>,
	className,
}: FooterProps) {
	const year = new Date().getFullYear()

	return (
		<footer className={cn('bg-foreground text-background pt-12 pb-8 md:pt-14 md:pb-10 lg:pt-16 lg:pb-12', className)}>
			<div className='mx-auto flex w-full max-w-7xl flex-col justify-between gap-10 px-5 md:gap-12 md:px-8 lg:flex-row lg:gap-16 lg:px-10'>
				{/* Brand + tagline + link columns */}
				<div className='flex flex-col gap-6 lg:max-w-xs'>
					{brand}
					{tagline && <p className='text-sm leading-relaxed text-background/60'>{tagline}</p>}
				</div>

				{/* Link columns */}
				{columns.length > 0 && (
					<div className='flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16 xl:gap-24'>
						{columns.map(col => (
							<div key={col.title} className='flex shrink-0 flex-col gap-3'>
								<div className='text-sm font-medium uppercase tracking-wide'>{col.title}</div>
								{col.links.map(link => (
									<LinkComp
										key={link.href}
										href={link.href}
										className='text-sm text-background/50 transition-colors hover:text-background'
									>
										{link.label}
									</LinkComp>
								))}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Bottom bar: copyright + links */}
			<div className='mx-auto mt-8 flex w-full max-w-7xl flex-col justify-between gap-4 px-5 md:mt-10 md:flex-row md:gap-0 md:px-8 lg:mt-12 lg:px-10'>
				<div className='text-center text-xs text-background/50 md:text-left md:text-sm'>
					{copyright ?? `© ${year} All Rights Reserved.`}
				</div>

				{bottomLinks.length > 0 && (
					<div className='flex flex-wrap justify-center gap-3 md:justify-end md:gap-5'>
						{bottomLinks.map(link => (
							<LinkComp
								key={link.href}
								href={link.href}
								className='text-xs text-background/50 transition-colors hover:text-background md:text-sm'
							>
								{link.label}
							</LinkComp>
						))}
					</div>
				)}
			</div>
		</footer>
	)
}
