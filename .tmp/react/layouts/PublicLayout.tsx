import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * PublicLayout — Header + content + footer for public/marketing pages.
 *
 * Stolen from: Bookverse (public) layout — simple, sticky header, flex-1 body, footer.
 *
 * Dependencies: cn()
 *
 * @example
 * // Next.js layout.tsx
 * export default function Layout({ children }) {
 *   return (
 *     <PublicLayout header={<Navbar />} footer={<Footer />}>
 *       {children}
 *     </PublicLayout>
 *   )
 * }
 */

interface PublicLayoutProps {
	children: ReactNode
	header?: ReactNode
	footer?: ReactNode
	/** Max-width constraint for main content. Default: '7xl' (1280px) */
	maxWidth?: 'full' | '5xl' | '6xl' | '7xl'
	className?: string
}

const maxWidthMap = {
	full: '',
	'5xl': 'max-w-5xl',
	'6xl': 'max-w-6xl',
	'7xl': 'max-w-7xl',
}

export function PublicLayout({
	children,
	header,
	footer,
	maxWidth = '7xl',
	className,
}: PublicLayoutProps) {
	return (
		<div className={cn('flex min-h-screen flex-col bg-background', className)}>
			{header}
			<main className='flex-1'>
				<div className={cn('mx-auto px-4 sm:px-6', maxWidthMap[maxWidth])}>
					{children}
				</div>
			</main>
			{footer}
		</div>
	)
}
