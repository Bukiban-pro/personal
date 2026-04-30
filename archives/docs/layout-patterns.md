# Layout Patterns — Raw Code Extract
# Extracted from: bookverse-fe, chefkix-fe, 5TProMart-fe
# Total files: 47


---

# BOOKVERSE-FE

## `bookverse-fe\src\app\layout.tsx`

```tsx
import AppProviders from '@/components/providers/AppProviders'
import fonts from '@/configs/fonts'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import Footer from '@/components/footer/Footer'

export const metadata: Metadata = {
	title: 'Bookverse',
	icons: {
		icon: '/images/logo.png',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<head>
				{/* PERFORMANCE: DNS prefetch for external resources */}
				<link rel='dns-prefetch' href='//res.cloudinary.com' />
				<link rel='dns-prefetch' href='//ui-avatars.com' />

				{/* PERFORMANCE: Preconnect to critical origins */}
				<link
					rel='preconnect'
					href='https://res.cloudinary.com'
					crossOrigin='anonymous'
				/>
			</head>
			<body
				className={cn(
					fonts.sans.variable,
					fonts.serif.variable,
					'font-sans text-[0.9375rem] min-h-screen flex flex-col',
				)}
			>
				<NextTopLoader
					color='#11DCE8'
					crawlSpeed={200}
					height={3}
					showSpinner={false}
					shadow={false}
				/>
				<div className='flex-1'>
					<AppProviders>{children}</AppProviders>
				</div>
				<Footer />
				<ToastContainer
					position='bottom-right'
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					pauseOnHover
					draggable
					theme='colored'
				/>
			</body>
		</html>
	)
}
```

## `bookverse-fe\src\app\(public)\layout.tsx`

```tsx
import { PublicBrowsingHeader } from '@/components/header/PublicBrowsingHeader'
import { ReactNode } from 'react'

interface PublicLayoutProps {
	children: ReactNode
}

/**
 * Layout for public browsing pages (/books, /listings, /authors).
 * Provides a lightweight navigation header so users aren't stranded.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
	return (
		<div className="flex flex-col min-h-screen bg-cream">
			<PublicBrowsingHeader />
			<main className="flex-1">
				{children}
			</main>
		</div>
	)
}
```

## `bookverse-fe\src\app\home\layout.tsx`

```tsx
'use client'

import LandingButtons from '@/components/buttons/LandingButtons'
import Logo from '@/components/Logo'
import { MobileNav } from '@/components/header/MobileNavBar'
import SearchBar from '@/components/SearchBar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { AuthRequiredModal } from '@/components/modals/AuthRequiredModal'
import { useAuthStore, useUserStore } from '@/store'
import { useCart } from '@/hooks/use-cart'
import { useGetMe } from '@/hooks/use-get-me'
import { useUnreadCount } from '@/hooks/use-messaging'
import { useWishlistCount } from '@/hooks/use-wishlist'
import { RoleEnum, isSeller } from '@/lib/enums'
import {
	BellIcon,
	Flag,
	HeartIcon,
	HomeIcon,
	InboxIcon,
	MessageSquare,
	SearchIcon,
	ShieldIcon,
	ShoppingCartIcon,
	StoreIcon,
	User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'
import Profile from './dashboard/components/Profile'
import type { AuthRequiredAction } from '@/components/modals/AuthRequiredModal'

interface HomeLayoutProps {
	children: ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
	const pathname = usePathname()
	const { hasHydrated, isLoggedIn } = useAuthStore()
	const { user, setUser } = useUserStore()
	const { data: cart } = useCart()
	const { data: unreadCount } = useUnreadCount()
	const { data: wishlistCountData } = useWishlistCount()
	const [searchText, setSearchText] = useState<string>('')
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [authAction, setAuthAction] = useState<AuthRequiredAction>('generic')
	
	// POKE #16 FIX: Fetch fresh user data at layout level to prevent role flickering
	// Previously, layout used stale persisted user while page component fetched fresh data
	// This caused nav tabs to show wrong roles briefly on page load
	const { data: freshUserData, isLoading: isUserLoading } = useGetMe(hasHydrated && isLoggedIn === true)
	
	// Sync fresh user to store (same pattern as dashboard page)
	useEffect(() => {
		if (freshUserData) setUser(freshUserData.result)
	}, [freshUserData, setUser])
	
	// Use fresh data for role decisions, fall back to persisted only if not loading
	// While loading, we DON'T trust persisted data for role-based nav items
	const roleDataReady = !isLoggedIn || (isLoggedIn && !isUserLoading && !!freshUserData)
	const roleUser = freshUserData?.result ?? (roleDataReady ? user : null)
	
	// Cart item count (0 if not logged in or no cart)
	const cartItemCount = cart?.itemCount ?? 0
	
	// Unread messages count (0 if not logged in or no messages)
	const unreadMessagesCount = unreadCount ?? 0
	
	// Wishlist count (0 if not logged in or no wishlist items)
	const wishlistCount = wishlistCountData ?? 0
	
	// Prevent hydration mismatch from Radix components generating different IDs on server vs client
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	const cleanPathname = (pathname || '/').split('?')[0]

	// Check if menu item is active
	const isActive = (menuPath: string, exact = false) => {
		if (!cleanPathname) return false
		if (exact) return cleanPathname === menuPath
		// Active if menuPath is a prefix of current URL
		return (
			cleanPathname === menuPath || cleanPathname.startsWith(menuPath + '/')
		)
	}

	const navItems = [
		{
			name: 'Home',
			icon: HomeIcon,
			href: '/home/dashboard',
			activeColor: 'text-burgundy',
			exact: true, // Only active when exactly at /home/dashboard
			requiresAuth: false,
			authAction: 'generic' as AuthRequiredAction,
		},
		{
			name: 'Search',
			icon: SearchIcon,
			href: '/home/dashboard/search',
			requiresAuth: false,
			authAction: 'generic' as AuthRequiredAction,
		},
		{
			name: 'Wishlist',
			icon: HeartIcon,
			href: '/home/my-account?tab=wishlist',
			requiresAuth: true, // Guests should see AuthRequiredModal
			authAction: 'wishlist' as AuthRequiredAction,
			badgeCount: wishlistCount,
		},
		// P5 #177: My Account now prominent in nav (was hidden in Profile dropdown, unfair vs Seller)
		...(isLoggedIn
			? [
					{
						name: 'Account',
						icon: User,
						href: '/home/my-account?tab=profile',
						activeColor: 'text-burgundy',
						requiresAuth: true,
						authAction: 'generic' as AuthRequiredAction,
					},
				]
			: []),
		// POKE #16: Use roleUser (fresh data when available) to prevent stale role flickering
		// FIX: Accept both "SELLER" (backend) and "CASUAL_SELLER" (legacy frontend) values
		...(isSeller(roleUser?.accountType)
			? [
					{
						name: 'Seller',
						icon: StoreIcon,
						href: '/home/dashboard/seller?tab=analytics',
						activeColor: 'text-green-600',
						requiresAuth: true,
						authAction: 'generic' as AuthRequiredAction,
					},
				]
			: []),
		...(roleUser?.roles?.includes(RoleEnum.MODERATOR)
			? [
					{
						name: 'Moderation',
						icon: Flag,
						href: '/moderation',
						activeColor: 'text-orange-600',
						requiresAuth: true,
						authAction: 'generic' as AuthRequiredAction,
					},
				]
			: []),
		...(roleUser?.roles?.includes(RoleEnum.ADMIN)
			? [
					{
						name: 'Admin',
						icon: ShieldIcon,
						href: '/admin',
						activeColor: 'text-red-600',
						requiresAuth: true,
						authAction: 'generic' as AuthRequiredAction,
					},
				]
			: []),
	]

	// Handle nav item click - show auth modal for guests on protected routes
	const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
		if (item.requiresAuth && !isLoggedIn) {
			e.preventDefault()
			setAuthAction(item.authAction)
			setShowAuthModal(true)
		}
	}
	
	// Handle cart click - show auth modal for guests
	const handleCartClick = (e: React.MouseEvent) => {
		if (!isLoggedIn) {
			e.preventDefault()
			setAuthAction('cart')
			setShowAuthModal(true)
		}
	}

	// P5 #173: Handle messages click - show auth modal for guests (discoverability)
	const handleMessagesClick = (e: React.MouseEvent) => {
		if (!isLoggedIn) {
			e.preventDefault()
			setAuthAction('messages')
			setShowAuthModal(true)
		}
	}

	return (
		<div className='flex flex-col min-h-screen'>
			<header
				className='sticky top-0 z-50 bg-white backdrop-blur-md border-b border-linen'
				style={{ height: 'var(--header-height)' }}
			>
				<div className='max-w-7xl mx-auto flex items-center justify-between px-6 py-4 relative'>
					<Logo />

					{/* Desktop Nav - only show at lg (1024px+) to prevent tablet collision */}
						<nav className='items-center gap-4 lg:gap-6 lg:flex hidden'>
						{navItems.map(item => {
							const Icon = item.icon
							const active = isActive(item.href, item.exact)
							const badgeCount = (item as { badgeCount?: number }).badgeCount ?? 0
							return (
								<Link
									key={item.name}
									href={item.href}
									onClick={(e) => handleNavClick(item, e)}
									className={`flex flex-col items-center gap-1 transition-colors ${
										active
												? item.activeColor || 'text-burgundy'
												: 'text-walnut hover:text-charcoal'
									}`}
								>
									<div className='relative'>
										<Icon size={20} />
										{badgeCount > 0 && (
											<span className='absolute -top-2 -right-2 bg-burgundy text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1'>
												{badgeCount > 99 ? '99+' : badgeCount}
											</span>
										)}
									</div>
									<span className='text-xs font-medium'>{item.name}</span>
								</Link>
							)
						})}
					</nav>

					{/* Right-side actions - only show at lg (1024px+) */}
					<div className='items-center gap-3 lg:gap-4 hidden lg:flex'>
						<SearchBar searchText={searchText} setSearchText={setSearchText} />
						
						{/* Notifications - honest empty state until real notification system exists */}
						{mounted ? (
							<Popover>
								<PopoverTrigger asChild>
									<button className='relative p-2 rounded-lg hover:bg-linen transition-literary'>
										<BellIcon className='text-walnut' size={22} />
									</button>
								</PopoverTrigger>
								<PopoverContent className='mr-4 w-80 p-4 shadow-xl border-linen'>
									<div className='flex items-center justify-between mb-4'>
										<h3 className='font-semibold text-charcoal'>
											Notifications
										</h3>
									</div>
									<div className='flex flex-col items-center justify-center py-8 text-center'>
										<InboxIcon className='text-walnut/40 mb-3' size={40} />
										<p className='text-sm text-walnut'>
											No notifications yet
										</p>
										<p className='text-xs text-walnut/60 mt-1'>
											We&apos;ll notify you when something arrives
										</p>
									</div>
									</PopoverContent>
							</Popover>
						) : (
							<button className='relative p-2 rounded-lg hover:bg-linen transition-literary'>
								<BellIcon className='text-walnut' size={22} />
							</button>
						)}

						{/* Messages - P5 #173: Now visible to guests with auth modal (discoverability) */}
						<Link
							href='/home/messages'
							onClick={handleMessagesClick}
							className='relative p-2 rounded-lg hover:bg-linen transition-literary'
						>
							<MessageSquare className='text-walnut' size={22} />
							{isLoggedIn && unreadMessagesCount > 0 && (
								<span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-burgundy text-white text-xs font-medium rounded-full border-2 border-white px-1'>
									{unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
								</span>
							)}
						</Link>

						{/* Cart - protected for guests, shows real item count */}
						<Link
							href='/home/cart'
							onClick={handleCartClick}
							className='relative p-2 rounded-lg hover:bg-linen transition-literary'
						>
							<ShoppingCartIcon className='text-walnut' size={22} />
							{cartItemCount > 0 && (
								<span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-burgundy text-white text-xs font-medium rounded-full border-2 border-white px-1'>
									{cartItemCount > 99 ? '99+' : cartItemCount}
								</span>
							)}
						</Link>

						{isLoggedIn ? <Profile user={user} /> : <LandingButtons />}
					</div>

					{/* Mobile Nav - visible up to lg breakpoint (handles tablets too) */}
					<div className='block lg:hidden'>
						<MobileNav />
					</div>
				</div>
			</header>

			<main className='flex-1'>
				<div className='max-w-7xl mx-auto px-6'>{children}</div>
			</main>

			{/* Auth Required Modal - shown when guests try to access protected features */}
			<AuthRequiredModal 
				open={showAuthModal} 
				onOpenChange={setShowAuthModal}
				action={authAction}
			/>
		</div>
	)
}
```

## `bookverse-fe\src\app\seller\layout.tsx`

```tsx
import { SellerToolsHeader } from '@/components/header/SellerToolsHeader'
import { ReactNode } from 'react'

interface SellerToolsLayoutProps {
	children: ReactNode
}

/**
 * Layout for seller tools pages (/seller/listings/add, /seller/promotions, etc.)
 * 
 * Provides navigation context so users don't feel stranded.
 * The SellerToolsHeader gives them:
 * - Back button (step-by-step return)
 * - Dashboard link (direct escape to hub)
 * - Products link (quick access to listings)
 */
export default function SellerToolsLayout({ children }: SellerToolsLayoutProps) {
	return (
		<div className="flex flex-col min-h-screen bg-cream">
			<SellerToolsHeader />
			<main className="flex-1">
				{children}
			</main>
		</div>
	)
}
```

## `bookverse-fe\src\app\home\dashboard\page.tsx`

```tsx
'use client'

import WelcomeSection from '@/app/home/dashboard/components/WelcomeSection'
import NewReleasesSection from '@/components/NewReleasesSection'
import TrendingBookSection from '@/components/TrendingBookSection'
import PopularBooks from '@/components/PopularBooks'
import PopularAuthors from '@/components/PopularAuthors'
import PlatformStats from '@/components/PlatformStats'
import ForYouRecommendations from '@/components/ForYouRecommendations'
import RecentlyViewedBooks from '@/components/RecentlyViewedBooks'
import MoodPicks from '@/components/MoodPicks'
import OnSaleSection from '@/components/OnSaleSection'
import Loading from '@/components/ui/loading'
import { LazySection, AISectionSkeleton, SectionSkeleton } from '@/components/LazySection'
import routes from '@/configs/routes'
import { useCategories } from '@/hooks/use-get-categories'
import { useGetMe } from '@/hooks'
import { useAuthStore, useUserStore } from '@/store'
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import OfferBanner from './components/OfferBanner'
import { designTokens, categoryVisuals } from '@/lib/design-tokens'
import { getCategoryIcon } from '@/components/icons/CategoryIcons'

/**
 * Unified Home Page — Discovery + Personalization in ONE place
 * 
 * Philosophy: No artificial split between "Home" and "Discover".
 * Users expect ONE surface for everything. This is it.
 * 
 * Design Aesthetic: Literary marketplace. Powell's Books meets Strand.
 * Warm tones, sophisticated typography, subtle textures.
 * NO emojis. NO SaaS gradients. NO startup-speak.
 */
const HomePage = () => {
	const router = useRouter()
	const { hasHydrated, isLoggedIn } = useAuthStore()
	const { setUser, user } = useUserStore()
	const { data, isLoading, error } = useGetMe(isLoggedIn === true)
	const recentlyViewed = useRecentlyViewedStore(state => state.books)
	const hasRecentlyViewed = recentlyViewed.length > 0
	const { data: categories = [], isLoading: categoriesLoading } = useCategories()

	useEffect(() => {
		if (data) setUser(data.result)
	}, [data, setUser])

	const axiosErr = error as { response?: { data?: { message?: string } } }
	const profileNotFound = axiosErr?.response?.data?.message === 'Profile not found'

	if (profileNotFound) {
		router.push(routes.setupProfile)
		return <Loading />
	}

	if (!hasHydrated || isLoading) return <Loading />

	return (
		<div className='space-y-10 md:py-6 py-4'>
			{/* 1. Personalized Welcome */}
			<WelcomeSection user={user} />

			{/* 2. Continue Browsing — FIRST for returning users (if has history) */}
			{hasRecentlyViewed && (
				<section>
					<div className='flex items-center gap-3 mb-6'>
						<div className='w-1 h-6 rounded-full' style={{ backgroundColor: designTokens.colors.walnut }} />
						<h2 className='text-xl font-semibold' style={{ 
							color: designTokens.colors.text.primary,
							fontFamily: designTokens.typography.fontFamily.serif 
						}}>
							Continue Browsing
						</h2>
					</div>
					<RecentlyViewedBooks showHeader={false} />
				</section>
			)}
			
			{/* 3. Platform Stats — Social Proof (builds trust) */}
			<PlatformStats />

			{/* 4. Marketing Banner */}
			<OfferBanner />

			{/* 5. For You — Personalized Recommendations (AI-powered, viewport-triggered) */}
			<LazySection 
				placeholderHeight="350px" 
				skeleton={<AISectionSkeleton />}
				rootMargin="200px"
			>
				<ForYouRecommendations />
			</LazySection>

			{/* 6. Mood Discovery — AI-powered atmospheric picks (viewport-triggered) */}
			<LazySection 
				placeholderHeight="400px" 
				skeleton={<AISectionSkeleton />}
				rootMargin="200px"
			>
				<MoodPicks />
			</LazySection>
			
			{/* 7. On Sale — Listings with active promotions (only shows if items exist) */}
			<LazySection placeholderHeight="300px" skeleton={<SectionSkeleton cardCount={4} />}>
				<OnSaleSection />
			</LazySection>

			{/* 8. Popular Authors — #413 in audit: "I want more Haruki Murakami" had NO pathway */}
			<LazySection placeholderHeight="250px" skeleton={<SectionSkeleton cardCount={6} />}>
				<section>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<div className='w-1 h-6 rounded-full' style={{ backgroundColor: designTokens.colors.forest }} />
							<h2 className='text-xl font-semibold' style={{ 
								color: designTokens.colors.text.primary,
								fontFamily: designTokens.typography.fontFamily.serif 
							}}>
								Popular Authors
							</h2>
						</div>
						<Link 
							href={routes.authors.list}
							className='text-sm font-medium transition-colors hover:opacity-80'
							style={{ color: designTokens.colors.forest }}
						>
							View All →
						</Link>
					</div>
					<PopularAuthors />
				</section>
			</LazySection>

			{/* 9. Trending Now — Social proof */}
			<LazySection placeholderHeight="300px" skeleton={<SectionSkeleton cardCount={4} />}>
				<section>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<div className='w-1 h-6 rounded-full' style={{ backgroundColor: designTokens.colors.copper }} />
							<h2 className='text-xl font-semibold' style={{ 
								color: designTokens.colors.text.primary,
								fontFamily: designTokens.typography.fontFamily.serif 
							}}>
								Trending Now
							</h2>
						</div>
						<Link 
							href={`${routes.search}?sort=trending`}
							className='text-sm font-medium transition-colors hover:opacity-80'
							style={{ color: designTokens.colors.copper }}
						>
							View All →
						</Link>
					</div>
					<TrendingBookSection />
				</section>
			</LazySection>

			{/* 10. Best Sellers — Trust signal */}
			<LazySection placeholderHeight="300px" skeleton={<SectionSkeleton cardCount={4} />}>
				<section>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<div className='w-1 h-6 rounded-full' style={{ backgroundColor: designTokens.colors.burgundy }} />
							<h2 className='text-xl font-semibold' style={{ 
								color: designTokens.colors.text.primary,
								fontFamily: designTokens.typography.fontFamily.serif 
							}}>
								Best Sellers
							</h2>
						</div>
						<Link 
							href={`${routes.search}?sort=bestselling`}
							className='text-sm font-medium transition-colors hover:opacity-80'
							style={{ color: designTokens.colors.burgundy }}
						>
							View All →
						</Link>
					</div>
					<PopularBooks />
				</section>
			</LazySection>

				{/* 11. New Releases — Freshness */}
			<LazySection placeholderHeight="300px" skeleton={<SectionSkeleton cardCount={4} />}>
				<section>
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3'>
							<div className='w-1 h-6 rounded-full' style={{ backgroundColor: designTokens.colors.forest }} />
							<h2 className='text-xl font-semibold' style={{ 
								color: designTokens.colors.text.primary,
								fontFamily: designTokens.typography.fontFamily.serif 
							}}>
								Just Added
							</h2>
						</div>
						<Link 
							href={`${routes.search}?sort=newest`}
							className='text-sm font-medium transition-colors hover:opacity-80'
							style={{ color: designTokens.colors.forest }}
						>
							View All →
						</Link>
					</div>
					<NewReleasesSection />
				</section>
			</LazySection>

			{/* 12. Browse by Category — Elegant grid with icons */}
			<section>
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center gap-3'>
						<div className='w-1 h-6 rounded-full' style={{ backgroundColor: designTokens.colors.navy }} />
						<h2 className='text-xl font-semibold' style={{ 
							color: designTokens.colors.text.primary,
							fontFamily: designTokens.typography.fontFamily.serif 
						}}>
							Browse Categories
						</h2>
					</div>
					<Link 
						href={routes.search} 
						className='text-sm font-medium transition-colors hover:opacity-80'
						style={{ color: designTokens.colors.navy }}
					>
						View All →
					</Link>
				</div>
				{categoriesLoading ? (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div 
								key={i} 
								className='h-20 rounded-lg animate-pulse' 
								style={{ backgroundColor: designTokens.colors.parchment }} 
							/>
						))}
					</div>
				) : (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
						{categories.slice(0, 12).map((category) => {
							const visual = categoryVisuals[category.slug || ''] || { color: designTokens.colors.navy, iconKey: 'book', accent: designTokens.colors.gold }
							const IconComponent = getCategoryIcon(visual.iconKey)
							
							return (
								<Link
									key={category.id}
									href={`${routes.search}?category=${category.slug}`}
									className='group relative overflow-hidden rounded-lg p-4 transition-all duration-300 hover:shadow-lg'
									style={{
										backgroundColor: designTokens.colors.ivory,
										border: `1px solid ${designTokens.colors.border.light}`,
									}}
								>
									{/* Subtle top accent bar */}
									<div 
										className='absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity'
										style={{ backgroundColor: visual.color }}
									/>
									
									<div className='relative z-10 flex flex-col items-center text-center gap-3 pt-2'>
										{/* Icon with category color */}
										<div 
											className='w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110'
											style={{ 
												backgroundColor: `${visual.color}15`,
											}}
										>
											<IconComponent 
												size={22} 
												strokeWidth={1.75}
												style={{ color: visual.color }} 
											/>
										</div>
										<span 
											className='text-sm font-medium transition-colors'
											style={{ 
												color: designTokens.colors.text.primary,
												fontFamily: designTokens.typography.fontFamily.sans,
											}}
										>
											{category.name}
										</span>
									</div>
								</Link>
							)
						})}
					</div>
				)}
			</section>

			{/* 13. CTA for guests — Literary, not startup-speak */}
			{!isLoggedIn && (
				<section 
					className='relative overflow-hidden rounded p-8 md:p-12 text-center'
					style={{
						background: `linear-gradient(135deg, ${designTokens.colors.burgundy} 0%, ${designTokens.colors.walnut} 100%)`,
					}}
				>
					{/* Subtle texture overlay */}
					<div 
						className='absolute inset-0 opacity-10'
						style={{
							backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="none"/%3E%3Cpath d="M10 0v20M0 10h20" stroke="%23fff" stroke-width="0.5" opacity="0.3"/%3E%3C/svg%3E")',
						}}
					/>
					
					<div className='relative z-10'>
						{/* Book silhouette decoration */}
						<div 
							className='w-16 h-16 mx-auto mb-6 rounded-lg flex items-center justify-center'
							style={{ 
								backgroundColor: 'rgba(255,255,255,0.15)',
								backdropFilter: 'blur(10px)',
							}}
						>
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
								<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
								<path d="M8 7h6" />
								<path d="M8 11h4" />
							</svg>
						</div>
						
						<h2 
							className='text-2xl md:text-3xl font-bold mb-3 text-white'
							style={{ fontFamily: designTokens.typography.fontFamily.serif }}
						>
							Your Next Great Read Awaits
						</h2>
						<p className='text-white/80 mb-8 max-w-lg mx-auto text-lg'>
							Discover rare editions, connect with passionate booksellers, 
							and build a library that tells your story.
						</p>
						<div className='flex flex-col sm:flex-row justify-center gap-4'>
							{/* Sign In first (existing users = primary action) */}
							<Link
								href={routes.logIn}
								className='px-8 py-3 rounded-sm font-semibold transition-literary shadow-literary hover:shadow-literary-lg'
								style={{ 
									backgroundColor: designTokens.colors.ivory,
									color: designTokens.colors.burgundy,
								}}
							>
								Sign In
							</Link>
							{/* Create Account second (new users = secondary action) */}
							<Link
								href={routes.signUp}
								className='border-2 border-white/50 text-white px-8 py-3 rounded-sm font-semibold hover:bg-white/10 transition-literary'
							>
								Create Account
							</Link>
						</div>
					</div>
				</section>
			)}
		</div>
	)
}

export default HomePage
```

## `bookverse-fe\src\app\home\dashboard\search\components\HeroSection.tsx`

```tsx
'use client'

import Link from 'next/link'
import { Search, BookOpen, Star, Users } from 'lucide-react'
import Image from 'next/image'
import { usePublicStats } from '@/hooks/use-public-stats'

/**
 * Search Hero Section — The Gateway to Discovery
 * 
 * Design Philosophy:
 * - Bold, confident messaging
 * - Social proof with live stats
 * - Visual richness with book fan and floating elements
 */
const HeroSection = () => {
	const { stats } = usePublicStats()

	return (
		<section
			className='relative overflow-hidden rounded bg-gradient-to-r 
		from-burgundy via-burgundy/80 to-copper px-6 py-10 md:px-10 md:py-14 text-white
		md:mt-0 mt-4'
		>
			{/* Background decoration */}
			<div className='absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
			<div className='absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl' />
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl' />

			<div className='relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
				{/* LEFT */}
				<div className='max-w-xl'>
					{/* Badge */}
					<div className='inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full'>
						<Search className='w-4 h-4' />
						<span className='text-sm font-medium'>Discover Your Next Read</span>
					</div>

					{/* Title */}
					<h1 className='text-3xl md:text-5xl font-bold leading-tight'>
						Every book has
						<br />
						<span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-white'>
							a story waiting
						</span>
					</h1>

					{/* Description */}
					<p className='mt-4 text-lg text-white/90 max-w-md'>
						Search by title, author, ISBN, or browse categories. 
						Find rare editions, best sellers, and hidden gems.
					</p>

					{/* Mini stats */}
					{stats && (
						<div className='mt-6 flex flex-wrap gap-4'>
							<MiniStat 
								icon={BookOpen} 
								value={formatNumber(stats.totalBooks)} 
								label='Books' 
							/>
							<MiniStat 
								icon={Users} 
								value={formatNumber(stats.totalSellers)} 
								label='Sellers' 
							/>
							<MiniStat 
								icon={Star} 
								value={stats.avgRating.toFixed(1)} 
								label='Rating' 
							/>
						</div>
					)}

					{/* Actions */}
					<div className='mt-8 flex flex-wrap gap-3'>
						<button
						className='inline-flex items-center gap-2 rounded-sm bg-white text-burgundy px-6 py-3 font-semibold hover:bg-white/90 transition shadow-literary hover:shadow-literary-lg cursor-pointer'
							onClick={() => {
								const section = document.getElementById('intro-section')
								if (section) {
									const yOffset = -80
									const y =
										section.getBoundingClientRect().top +
										window.pageYOffset +
										yOffset
									window.scrollTo({ top: y, behavior: 'smooth' })
								}
							}}
						>
							<Search size={18} />
							Start Searching
						</button>

						<Link
							href='/home/dashboard'
							className='inline-flex items-center gap-2 rounded-sm 
							border-2 border-white/30 px-6 py-3 font-semibold 
							hover:bg-white/10 transition'
						>
							<BookOpen size={18} />
							Browse Home
						</Link>
					</div>
				</div>

				{/* RIGHT */}
				<div className='hidden md:flex justify-end relative'>
					{/* Glow */}
					<div className='absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110' />

					{/* Book stack - fan out */}
					<div className='relative flex items-end gap-6'>
						{[
							'/images/books/it/clean-code.jpg',
							'/images/books/non-fiction/black-swan.png',
							'/images/books/science/brief-history.png',
						].map((src, i) => (
							<div
								key={i}
								className={`relative w-28 h-40 rounded overflow-hidden shadow-literary-lg transform transition-transform hover:scale-105
								${i === 0 ? '-rotate-6 -translate-y-2' : ''}
								${i === 1 ? 'translate-y-0 z-10 scale-110' : ''}
								${i === 2 ? 'rotate-6 -translate-y-2' : ''}`}
							>
								<Image
									src={src}
									alt='Book preview'
									fill
									sizes='112px'
									className='select-none object-cover'
								/>
							</div>
						))}

						{/* Floating search icon */}
						<div className='absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded shadow-literary-lg animate-bounce'>
							<Search className='w-6 h-6' />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

/**
 * Mini stat badge for hero section
 */
function MiniStat({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
	return (
		<div className='flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg'>
			<Icon className='w-4 h-4 text-white/80' />
			<span className='font-bold'>{value}</span>
			<span className='text-white/70 text-sm'>{label}</span>
		</div>
	)
}

/**
 * Format large numbers with K/M suffix
 */
function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M'
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K'
	}
	return num.toLocaleString()
}

export default HeroSection
```

## `bookverse-fe\src\app\home\dashboard\components\WelcomeSection.tsx`

```tsx
'use client'

import { motion } from 'framer-motion'
import { HeartIcon, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { User } from '@/lib/@types/user.type'

interface WelcomeSectionProps {
	user: User | null
}

const getGreeting = () => {
	const hour = new Date().getHours()
	if (hour < 12) return 'Good morning'
	if (hour < 18) return 'Good afternoon'
	return 'Good evening'
}

const VISIT_KEY = 'bookverse_has_visited'

const WelcomeSection = ({ user }: WelcomeSectionProps) => {
	const [isReturningUser, setIsReturningUser] = useState(false)

	useEffect(() => {
		// Check if user has visited before
		const hasVisited = localStorage.getItem(VISIT_KEY)
		if (hasVisited) {
			setIsReturningUser(true)
		}
		// Mark this visit for next time
		localStorage.setItem(VISIT_KEY, 'true')
	}, [])

	// Only show "Welcome back" if logged in AND returning visitor
	const welcomeText = user && isReturningUser ? 'Welcome back,' : 'Welcome,'

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className='
        relative overflow-hidden rounded-lg
        bg-gradient-to-br from-white via-parchment/40 to-white
        border border-burgundy/10
        px-6 py-5
        shadow-literary
        min-h-[180px] md:min-h-[160px]
      '
		>
			{/* subtle decorative blur */}
			<div className='pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-burgundy/10 blur-3xl' />

			<div className='relative space-y-4'>
				{/* Greeting */}
				<div className='space-y-1'>
					<div className='flex items-center gap-2'>
						<Sparkles className='h-4 w-4 text-burgundy' />
						<span className='text-xs font-medium text-burgundy uppercase tracking-wide'>
							{getGreeting()}
						</span>
					</div>

					<h2 className='text-2xl font-semibold text-charcoal'>
						{welcomeText}{' '}
						<span className='text-burgundy font-bold'>
						{user?.profile?.displayName || user?.username || 'Reader'}
						</span>
					</h2>
				</div>

				{/* Subtitle */}
				<p className='max-w-lg text-sm text-walnut'>
					Ready to continue your reading or explore something new?
				</p>

				{/* Actions */}
				<div className='flex flex-wrap gap-3 pt-1'>
					<Link
						href='/home/dashboard/search'
						className='
              inline-flex items-center gap-2
              rounded-sm bg-burgundy
              px-5 py-2.5
              text-sm font-medium text-white
              transition-literary
              hover:bg-burgundy/90
              active:scale-[0.98] cursor-pointer
            '
					>
						<Search className='h-4 w-4' />
						Search books
					</Link>

					{user && (
						<Link
							href='/home/my-account?tab=wishlist'
							className='
								inline-flex items-center gap-2
								rounded-sm border border-stone
								bg-white
								px-5 py-2.5
								text-sm font-medium text-walnut
								transition-literary
								hover:bg-parchment
								active:scale-[0.98] cursor-pointer
							'
						>
							<HeartIcon className='h-4 w-4' />
							My Wishlist
						</Link>
					)}
				</div>
			</div>
		</motion.div>
	)
}

export default WelcomeSection
```

## `bookverse-fe\src\components\header\PublicBrowsingHeader.tsx`

```tsx
'use client'

import Logo from '@/components/Logo'
import SearchBar from '@/components/SearchBar'
import { AuthRequiredModal } from '@/components/modals/AuthRequiredModal'
import { useAuthStore } from '@/store'
import { useCart } from '@/hooks/use-cart'
import { ShoppingCartIcon, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * Lightweight header for public browsing pages (/books, /listings, /authors).
 * Provides essential navigation: logo, search, cart, and back/home buttons.
 * Prevents users from being "stranded" on detail pages.
 */
export function PublicBrowsingHeader() {
	const router = useRouter()
	const { isLoggedIn } = useAuthStore()
	const { data: cart } = useCart()
	const [searchText, setSearchText] = useState('')
	const [showAuthModal, setShowAuthModal] = useState(false)
	
	// Cart item count (0 if not logged in or no cart)
	const cartItemCount = cart?.itemCount ?? 0
	
	const handleCartClick = (e: React.MouseEvent) => {
		if (!isLoggedIn) {
			e.preventDefault()
			setShowAuthModal(true)
		}
	}
	
	const handleBack = () => {
		// Try to go back, fallback to home if no history
		if (window.history.length > 1) {
			router.back()
		} else {
			router.push('/home/dashboard')
		}
	}

	return (
		<>
			<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-linen shadow-sm">
				<div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
					{/* Left section: Back button + Logo */}
					<div className="flex items-center gap-3">
						<button
							type='button'
							onClick={handleBack}
							className="p-2 rounded-lg hover:bg-linen transition-colors text-walnut hover:text-charcoal"
							aria-label="Go back"
						>
							<ArrowLeft size={20} />
						</button>
						<Logo />
					</div>

					{/* Center: Search bar (hidden on very small screens) */}
					<div className="hidden sm:block flex-1 max-w-md mx-4">
						<SearchBar searchText={searchText} setSearchText={setSearchText} />
					</div>

					{/* Right section: Home + Cart */}
					<div className="flex items-center gap-2">
						<Link
							href="/home/dashboard"
							className="p-2 rounded-lg hover:bg-linen transition-colors text-walnut hover:text-charcoal"
							aria-label="Go to home"
						>
							<Home size={20} />
						</Link>
						
						<Link
							href="/home/my-account?tab=cart"
							onClick={handleCartClick}
							className="relative p-2 rounded-lg hover:bg-linen transition-colors text-walnut hover:text-charcoal"
							aria-label="View cart"
						>
							<ShoppingCartIcon size={20} />
							{cartItemCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-burgundy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
									{cartItemCount > 99 ? '99+' : cartItemCount}
								</span>
							)}
						</Link>
					</div>
				</div>
				
				{/* Mobile search bar */}
				<div className="sm:hidden px-4 pb-3">
					<SearchBar searchText={searchText} setSearchText={setSearchText} />
				</div>
			</header>
			
			<AuthRequiredModal
				open={showAuthModal}
				onOpenChange={setShowAuthModal}
				action="cart"
			/>
		</>
	)
}
```

## `bookverse-fe\src\components\header\MobileNavBar.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import Profile from '@/app/home/dashboard/components/Profile'
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import routes from '@/configs/routes'
import { useAuthStore, useUserStore } from '@/store'
import { useUnreadCount } from '@/hooks/use-messaging'
import { useCart } from '@/hooks/use-cart'
import { RoleEnum, isSeller } from '@/lib/enums'
import { designTokens } from '@/lib/design-tokens'
import { Menu, Home, Search, Heart, ShoppingCart, Package, Store, Flag, Shield, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export function MobileNav() {
	const { isLoggedIn } = useAuthStore()
	const { user } = useUserStore()
	const { data: unreadCount = 0 } = useUnreadCount()
	const { data: cart } = useCart()
	const cartItemCount = cart?.itemCount ?? 0
	
	// Prevent hydration mismatch: Radix Dialog generates random IDs on SSR vs client
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => { setIsMounted(true) }, [])

	// Navigation items with proper routes
	const publicTabs = [
		{ title: 'Home', href: routes.dashboard, icon: Home },
		{ title: 'Search', href: routes.search, icon: Search },
	]

	const authTabs = [
		{ title: 'Messages', href: '/home/messages', icon: MessageSquare },
		{ title: 'My Wishlist', href: '/home/my-account?tab=wishlist', icon: Heart },
		{ title: 'My Cart', href: '/home/cart', icon: ShoppingCart },
		{ title: 'My Orders', href: '/home/my-account?tab=orders', icon: Package },
	]

	// FIX: Use isSeller() helper to handle backend/frontend enum mismatch
	const sellerTabs = isSeller(user?.accountType) ? [
		{ title: 'Seller Dashboard', href: routes.seller.dashboard, icon: Store },
	] : []

	const moderationTabs = user?.roles?.includes(RoleEnum.MODERATOR) ? [
		{ title: 'Moderation', href: '/moderation', icon: Flag },
	] : []

	const adminTabs = user?.roles?.includes(RoleEnum.ADMIN) ? [
		{ title: 'Admin', href: '/admin', icon: Shield },
	] : []

	// Hydration guard: Don't render Sheet on SSR to avoid aria-controls mismatch
	if (!isMounted) {
		return (
			<Button
				variant='ghost'
				size='icon'
				className='lg:hidden hover:bg-transparent focus-visible:ring-0'
			>
				<Menu className='h-6 w-6' style={{ color: designTokens.colors.walnut }} />
				<span className='sr-only'>Open menu</span>
			</Button>
		)
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='lg:hidden hover:bg-transparent focus-visible:ring-0'
				>
					<Menu className='h-6 w-6' style={{ color: designTokens.colors.walnut }} />
					<span className='sr-only'>Open menu</span>
				</Button>
			</SheetTrigger>

			<SheetContent 
				side='right' 
				className='w-75 sm:w-80'
				style={{ backgroundColor: designTokens.colors.ivory }}
			>
				<SheetHeader>
					<SheetTitle className='text-lg font-semibold' style={{ color: designTokens.colors.charcoal }}>
						<Logo />
					</SheetTitle>
				</SheetHeader>

				<nav className='mt-6 flex flex-col gap-1'>
					{/* Public navigation */}
					{publicTabs.map(tab => (
						<SheetClose asChild key={tab.href}>
							<Link
								href={tab.href}
								className='flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors hover:opacity-90'
								style={{ color: designTokens.colors.walnut }}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = designTokens.colors.parchment
									e.currentTarget.style.color = designTokens.colors.burgundy
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'transparent'
									e.currentTarget.style.color = designTokens.colors.walnut
								}}
							>
								<tab.icon className='w-5 h-5' />
								{tab.title}
							</Link>
						</SheetClose>
					))}

					{/* Authenticated navigation */}
					{isLoggedIn && (
						<>
							<div className='my-2 border-t' style={{ borderColor: designTokens.colors.linen }} />
							{authTabs.map(tab => (
								<SheetClose asChild key={tab.href}>
									<Link
										href={tab.href}
										className='flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors'
										style={{ color: designTokens.colors.walnut }}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = designTokens.colors.parchment
											e.currentTarget.style.color = designTokens.colors.burgundy
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = 'transparent'
											e.currentTarget.style.color = designTokens.colors.walnut
										}}
									>
										<tab.icon className='w-5 h-5' />
										<span className='flex-1'>{tab.title}</span>
										{/* Show unread badge for Messages */}
										{tab.title === 'Messages' && unreadCount > 0 && (
											<Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-xs">
												{unreadCount > 99 ? '99+' : unreadCount}
											</Badge>
										)}
										{/* Show cart item count badge */}
										{tab.title === 'My Cart' && cartItemCount > 0 && (
											<Badge variant="secondary" className="h-5 min-w-[20px] px-1.5 text-xs bg-burgundy text-white">
												{cartItemCount > 99 ? '99+' : cartItemCount}
											</Badge>
										)}
									</Link>
								</SheetClose>
							))}

							{/* Seller navigation */}
							{sellerTabs.length > 0 && (
								<>
									<div className='my-2 border-t' style={{ borderColor: designTokens.colors.linen }} />
									{sellerTabs.map(tab => (
										<SheetClose asChild key={tab.href}>
											<Link
												href={tab.href}
												className='flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors'
												style={{ color: designTokens.colors.forest }}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor = designTokens.colors.parchment
													e.currentTarget.style.color = designTokens.colors.forest
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor = 'transparent'
													e.currentTarget.style.color = designTokens.colors.forest
												}}
											>
												<tab.icon className='w-5 h-5' />
												{tab.title}
											</Link>
										</SheetClose>
									))}
								</>
							)}

							{/* Moderation navigation */}
							{moderationTabs.length > 0 && (
								<>
									<div className='my-2 border-t' style={{ borderColor: designTokens.colors.linen }} />
									{moderationTabs.map(tab => (
										<SheetClose asChild key={tab.href}>
											<Link
												href={tab.href}
												className='flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors'
												style={{ color: designTokens.colors.warning }}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor = designTokens.colors.parchment
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor = 'transparent'
												}}
											>
												<tab.icon className='w-5 h-5' />
												{tab.title}
											</Link>
										</SheetClose>
									))}
								</>
							)}

							{/* Admin navigation */}
							{adminTabs.length > 0 && (
								<>
									<div className='my-2 border-t' style={{ borderColor: designTokens.colors.linen }} />
									{adminTabs.map(tab => (
										<SheetClose asChild key={tab.href}>
											<Link
												href={tab.href}
												className='flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors'
												style={{ color: designTokens.colors.error }}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor = designTokens.colors.parchment
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor = 'transparent'
												}}
											>
												<tab.icon className='w-5 h-5' />
												{tab.title}
											</Link>
										</SheetClose>
									))}
								</>
							)}
						</>
					)}
				</nav>

				{/* Auth section */}
				<div className='mt-8'>
					{isLoggedIn ? (
						<div className='flex flex-col items-center justify-center'>
							<Profile user={user} />
						</div>
					) : (
						<div className='flex items-center justify-center gap-3 flex-col px-4'>
							<Button className='cursor-pointer w-full' variant='outline' asChild>
								<Link href={routes.logIn}>Login</Link>
							</Button>

							<Button className='cursor-pointer w-full' asChild>
								<Link href={routes.signUp}>Register</Link>
							</Button>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
```

## `bookverse-fe\src\components\footer\Footer.tsx`

```tsx
import React from 'react'
import Link from 'next/link'

/**
 * Footer link component - ALL links must work. No "Coming Soon" allowed.
 * P5 #122: Removed dead social icons (no real accounts exist)
 * P5 #122: Converted bottom links to proper <Link> components
 */
const FooterLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
	<Link href={href} className='text-sm text-white/50 hover:text-white transition-colors'>
		{children}
	</Link>
)

const Footer = () => {
	return (
		<footer className='bg-black text-white pt-12 pb-8 md:pt-14 md:pb-10 lg:pt-16 lg:pb-12'>
			<div className='w-full max-w-7xl px-5 md:px-8 lg:px-10 mx-auto flex justify-between flex-col lg:flex-row gap-10 md:gap-12 lg:gap-16'>
				{/* LEFT START */}
				<div className='flex gap-8 md:gap-12 lg:gap-16 xl:gap-24 flex-col md:flex-row'>
					{/* Quick Links */}
					<div className='flex flex-col gap-3 shrink-0'>
						<div className='font-oswald font-medium uppercase text-sm'>
							Quick Links
						</div>
						<FooterLink href='/home/dashboard'>Browse Books</FooterLink>
						<FooterLink href='/onboarding/seller'>Sell Your Books</FooterLink>
						<FooterLink href='/#contact'>Contact Us</FooterLink>
						<FooterLink href='/#about'>About Us</FooterLink>
					</div>

{/* Customer Support - P5 #180: Added Help Center link */}
				<div className='flex flex-col gap-3'>
					<div className='font-oswald font-medium uppercase text-sm'>
						Customer Support
					</div>
					<FooterLink href='/policies/faq'>Help & FAQ</FooterLink>
						<FooterLink href='/home/my-account'>My Orders</FooterLink>
						<FooterLink href='/policies/shipping'>Shipping Policy</FooterLink>
						<FooterLink href='/policies/returns'>Returns & Refunds</FooterLink>
						<FooterLink href='/policies/payments'>Payment Methods</FooterLink>
					</div>

					{/* About BookVerse */}
					<div className='flex flex-col gap-3'>
						<div className='font-oswald font-medium uppercase text-sm'>
							About BookVerse
						</div>
						<FooterLink href='/#about'>Our Mission</FooterLink>
						<FooterLink href='/policies/terms'>Terms of Service</FooterLink>
						<FooterLink href='/policies/privacy'>Privacy Policy</FooterLink>
					</div>
				</div>
				{/* LEFT END */}

				{/* Social icons removed - P5 #122: No real social accounts exist.
				    Dead clickable buttons erode trust. Add back when real accounts are created. */}
			</div>

			<div className='w-full max-w-7xl px-5 md:px-8 lg:px-10 mx-auto flex justify-between mt-8 md:mt-10 lg:mt-12 flex-col md:flex-row gap-4 md:gap-0'>
				{/* LEFT START */}
				<div className='text-xs md:text-sm text-white/50 hover:text-white cursor-pointer text-center md:text-left transition-colors'>
					© {new Date().getFullYear()} BookVerse. All Rights Reserved.
				</div>
				{/* LEFT END */}

				{/* RIGHT START - P5 #122: Fixed dead links, now all go to real pages */}
				<div className='flex gap-3 md:gap-5 text-center md:text-left flex-wrap justify-center md:justify-end'>
					<FooterLink href='/policies/shipping'>Shipping Guide</FooterLink>
					<FooterLink href='/policies/terms'>Terms of Service</FooterLink>
					<FooterLink href='/policies/privacy'>Privacy Policy</FooterLink>
				</div>
				{/* RIGHT END */}
			</div>
		</footer>
	)
}

export default Footer
```

## `bookverse-fe\src\components\LottieLanding.tsx`

```tsx
'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const LandingImageSwiper = () => {
	const slides = [
		{ id: 1, image: '/images/hero/hero-4.jpg', alt: 'Reading books' },
		{ id: 2, image: '/images/hero/hero-2.jpg', alt: 'Book library' },
		{ id: 3, image: '/images/hero/hero-3.jpg', alt: 'Books stack' },
		{ id: 4, image: '/images/hero/hero-1.jpg', alt: 'Books stack' },
	]

	return (
		<Swiper
			modules={[Autoplay, Pagination]}
			autoplay={{ delay: 4000 }}
			loop
			pagination={{
				clickable: true,
			}}
			style={{
				['--swiper-theme-color' as any]: '#ffffff',
			}}
			className='w-full h-[560px] rounded overflow-hidden'
		>
			{slides.map(slide => (
				<SwiperSlide
					key={slide.id}
					className='relative h-full overflow-hidden rounded'
				>
					<Image
						src={slide.image}
						alt={slide.alt}
						fill
						sizes='(max-width: 768px) 100vw, 50vw'
						priority={slide.id === 1}
						className='object-cover cursor-pointer'
					/>
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export default LandingImageSwiper
```

## `bookverse-fe\src\components\buttons\LandingButtons.tsx`

```tsx
'use client'
import { Button } from '@/components/ui/button'
import routes from '@/configs/routes'
import Link from 'next/link'

const LandingButtons = () => {
	return (
		<div className='flex items-center justify-center gap-2 flex-col md:flex-row'>
			<Button className='cursor-pointer' variant='outline' asChild>
				<Link href={routes.logIn}>Login</Link>
			</Button>

			<Button className='cursor-pointer' asChild>
				<Link href={routes.signUp}>Register</Link>
			</Button>
		</div>
	)
}

export default LandingButtons
```

## `bookverse-fe\src\configs\fonts.ts`

```typescript
import { Merriweather, Inter } from 'next/font/google'

/**
 * Bookverse Typography System
 *
 * Philosophy: Literary Precision
 * - Serif (Merriweather): Headings, literary content
 * - Sans (Inter): Body text, UI elements
 */

const serif = Merriweather({
	subsets: ['latin', 'vietnamese'],
	weight: ['300', '400', '700', '900'],
	display: 'swap',
	variable: '--font-serif',
})

const sans = Inter({
	subsets: ['latin', 'vietnamese'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-sans',
})

const fonts = { serif, sans }

export default fonts
```

## `bookverse-fe\src\app\globals.css`

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

/* ─────────────────────────────────────────────────────────────────────────────
   BOOKVERSE LITERARY DESIGN TOKENS
   Philosophy: Warm, literary, timeless. Not trendy SaaS.
   
   THE OPINION: We are an antique bookshop, not a fintech app.
   - Serif for headings (literary gravitas)
   - Crisp corners (4-8px, not pillowy 16-24px)
   - Warm shadows (charcoal-based, not gray)
   ───────────────────────────────────────────────────────────────────────────── */

@theme inline {
	--color-background: var(--background);
	--color-foreground: var(--foreground);
	
	/* Typography — THE SOUL */
	--font-sans: var(--font-sans), 'Source Sans 3', system-ui, sans-serif;
	--font-serif: var(--font-serif), 'Libre Baskerville', Georgia, serif;
	--font-mono: 'JetBrains Mono', Consolas, monospace;
	
	--color-sidebar-ring: var(--sidebar-ring);
	--color-sidebar-border: var(--sidebar-border);
	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
	--color-sidebar-accent: var(--sidebar-accent);
	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
	--color-sidebar-primary: var(--sidebar-primary);
	--color-sidebar-foreground: var(--sidebar-foreground);
	--color-sidebar: var(--sidebar);
	--color-chart-5: var(--chart-5);
	--color-chart-4: var(--chart-4);
	--color-chart-3: var(--chart-3);
	--color-chart-2: var(--chart-2);
	--color-chart-1: var(--chart-1);
	--color-ring: var(--ring);
	--color-input: var(--input);
	--color-border: var(--border);
	--color-destructive: var(--destructive);
	--color-accent-foreground: var(--accent-foreground);
	--color-accent: var(--accent);
	--color-muted-foreground: var(--muted-foreground);
	--color-muted: var(--muted);
	--color-secondary-foreground: var(--secondary-foreground);
	--color-secondary: var(--secondary);
	--color-primary-foreground: var(--primary-foreground);
	--color-primary: var(--primary);
	--color-popover-foreground: var(--popover-foreground);
	--color-popover: var(--popover);
	--color-card-foreground: var(--card-foreground);
	--color-card: var(--card);
	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);
	
	/* ─────────────────────────────────────────────────────────────────────────
	   LITERARY PALETTE — The Bookverse Soul
	   ───────────────────────────────────────────────────────────────────────── */
	
	/* Primary — Deep library tones */
	--color-burgundy: #722F37;
	--color-forest: #2D4739;
	--color-navy: #1E3A5F;
	
	/* Neutrals — Paper and wood */
	--color-ivory: #FEFCF6;
	--color-parchment: #F5F0E6;
	--color-linen: #E8E2D6;
	--color-stone: #C4BAA8;
	--color-walnut: #5C4A3D;
	--color-charcoal: #2C2520;
	
	/* Accents — Precious metals and inks */
	--color-gold: #B8860B;
	--color-copper: #B87333;
	--color-ink: #1A1A2E;
	--color-sepia: #704214;
	
	/* Semantic — For UI states */
	--color-success: #4A7C59;
	--color-warning: #C4A35A;
	--color-error: #A63D40;
	--color-info: #4A6FA5;
}

:root {
	--radius: 0.625rem;
	--background: oklch(1 0 0);
	--foreground: oklch(0.141 0.005 285.823);
	--card: oklch(1 0 0);
	--card-foreground: oklch(0.141 0.005 285.823);
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.141 0.005 285.823);
	--primary: oklch(0.21 0.006 285.885);
	--primary-foreground: oklch(0.985 0 0);
	--secondary: oklch(0.967 0.001 286.375);
	--secondary-foreground: oklch(0.21 0.006 285.885);
	--muted: oklch(0.967 0.001 286.375);
	--muted-foreground: oklch(0.552 0.016 285.938);
	--accent: oklch(0.967 0.001 286.375);
	--accent-foreground: oklch(0.21 0.006 285.885);
	--destructive: oklch(0.577 0.245 27.325);
	--border: oklch(0.92 0.004 286.32);
	--input: oklch(0.92 0.004 286.32);
	--ring: oklch(0.705 0.015 286.067);
	--chart-1: oklch(0.646 0.222 41.116);
	--chart-2: oklch(0.6 0.118 184.704);
	--chart-3: oklch(0.398 0.07 227.392);
	--chart-4: oklch(0.828 0.189 84.429);
	--chart-5: oklch(0.769 0.188 70.08);
	--sidebar: oklch(0.985 0 0);
	--sidebar-foreground: oklch(0.141 0.005 285.823);
	--sidebar-primary: oklch(0.21 0.006 285.885);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.967 0.001 286.375);
	--sidebar-accent-foreground: oklch(0.21 0.006 285.885);
	--sidebar-border: oklch(0.92 0.004 286.32);
	--sidebar-ring: oklch(0.705 0.015 286.067);
	--header-height: 72px;
}

.dark {
	--background: oklch(0.141 0.005 285.823);
	--foreground: oklch(0.985 0 0);
	--card: oklch(0.21 0.006 285.885);
	--card-foreground: oklch(0.985 0 0);
	--popover: oklch(0.21 0.006 285.885);
	--popover-foreground: oklch(0.985 0 0);
	--primary: oklch(0.92 0.004 286.32);
	--primary-foreground: oklch(0.21 0.006 285.885);
	--secondary: oklch(0.274 0.006 286.033);
	--secondary-foreground: oklch(0.985 0 0);
	--muted: oklch(0.274 0.006 286.033);
	--muted-foreground: oklch(0.705 0.015 286.067);
	--accent: oklch(0.274 0.006 286.033);
	--accent-foreground: oklch(0.985 0 0);
	--destructive: oklch(0.704 0.191 22.216);
	--border: oklch(1 0 0 / 10%);
	--input: oklch(1 0 0 / 15%);
	--ring: oklch(0.552 0.016 285.938);
	--chart-1: oklch(0.488 0.243 264.376);
	--chart-2: oklch(0.696 0.17 162.48);
	--chart-3: oklch(0.769 0.188 70.08);
	--chart-4: oklch(0.627 0.265 303.9);
	--chart-5: oklch(0.645 0.246 16.439);
	--sidebar: oklch(0.21 0.006 285.885);
	--sidebar-foreground: oklch(0.985 0 0);
	--sidebar-primary: oklch(0.488 0.243 264.376);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.274 0.006 286.033);
	--sidebar-accent-foreground: oklch(0.985 0 0);
	--sidebar-border: oklch(1 0 0 / 10%);
	--sidebar-ring: oklch(0.552 0.016 285.938);
}

html {
	scroll-behavior: smooth;
}

@layer base {
	* {
		@apply border-border outline-ring/50;
	}

	body {
		@apply bg-background text-foreground;
	}

	/* ─────────────────────────────────────────────────────────────────────────
	   LITERARY TYPOGRAPHY — THE OPINION
	   Headings use serif. Body uses sans. This is intentional.
	   ───────────────────────────────────────────────────────────────────────── */
	
	h1, h2, h3, h4 {
		font-family: var(--font-serif);
		font-weight: 700;
		color: var(--color-charcoal);
		letter-spacing: -0.01em;
	}

	h1 {
		font-size: 2.25rem;
		line-height: 1.2;
	}

	h2 {
		font-size: 1.875rem;
		line-height: 1.25;
	}

	h3 {
		font-size: 1.5rem;
		line-height: 1.3;
	}

	h4 {
		font-size: 1.25rem;
		line-height: 1.4;
	}
}

/* ─────────────────────────────────────────────────────────────────────────────
   LITERARY GEOMETRY — CRISP, NOT PILLOWY
   Cards: rounded (6px). Buttons: rounded-sm (4px). Pills only for badges/avatars.
   ───────────────────────────────────────────────────────────────────────────── */

@layer utilities {
	.font-serif {
		font-family: var(--font-serif);
	}
	
	.font-sans {
		font-family: var(--font-sans);
	}

	/* ─────────────────────────────────────────────────────────────────────────
	   LITERARY SHADOWS — Warm, Paper-Like
	   Use shadow-literary for cards/containers. Use shadow-literary-lg for modals/elevated.
	   NEVER use default shadow-sm/md/lg (they're cold gray).
	   ───────────────────────────────────────────────────────────────────────── */
	
	.shadow-literary {
		box-shadow: 0 1px 3px rgba(44, 37, 32, 0.06), 0 4px 12px rgba(44, 37, 32, 0.04);
	}

	.shadow-literary-lg {
		box-shadow: 0 4px 12px rgba(44, 37, 32, 0.08), 0 8px 24px rgba(44, 37, 32, 0.06);
	}
	
	.shadow-literary-sm {
		box-shadow: 0 1px 2px rgba(44, 37, 32, 0.04);
	}

	/* ─────────────────────────────────────────────────────────────────────────
	   LITERARY MOTION — Deliberate, Not Flashy
	   THE OPINION: Movement should feel like turning pages, not fireworks.
	   
	   transition-literary: 200ms ease-out — For hover/focus states (snappy)
	   transition-literary-slow: 300ms ease-out — For enter/exit animations
	   
	   NEVER use duration-500 (too slow). NEVER use ease-in (unnatural exit).
	   ───────────────────────────────────────────────────────────────────────── */
	
	.transition-literary {
		transition: all 200ms ease-out;
	}
	
	.transition-literary-colors {
		transition: color 200ms ease-out, background-color 200ms ease-out, border-color 200ms ease-out;
	}
	
	.transition-literary-slow {
		transition: all 300ms ease-out;
	}

	/* ─────────────────────────────────────────────────────────────────────────
	   LITERARY FOCUS — Burgundy Ring
	   Consistent keyboard navigation feedback across all interactive elements.
	   ───────────────────────────────────────────────────────────────────────── */
	
	.focus-literary {
		@apply outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30 focus-visible:ring-offset-1;
	}
}
```

## `bookverse-fe\src\lib\design-tokens.ts`

```typescript
/**
 * Bookverse Design Tokens
 * 
 * THE OPINION: We are an antique bookshop, not a fintech app.
 * 
 * Inspired by: Powell's Books, The Strand, classic libraries
 * Philosophy: Warm, literary, timeless. Not trendy SaaS.
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * ECOSYSTEM QUICK REFERENCE
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * TYPOGRAPHY:
 *   - Headings: Libre Baskerville (serif) — literary gravitas
 *   - Body: Source Sans 3 (sans) — readable, warm
 *   - CSS: h1-h4 auto-apply serif via globals.css base layer
 * 
 * GEOMETRY:
 *   - Buttons/Inputs: rounded-sm (4px) — crisp, not pillowy
 *   - Cards/Containers: rounded (6px) — subtle softness
 *   - Pills/Avatars ONLY: rounded-full
 *   - NEVER use rounded-xl, rounded-2xl, rounded-3xl
 * 
 * SHADOWS:
 *   - Cards: shadow-literary (warm charcoal)
 *   - Elevated/Modals: shadow-literary-lg
 *   - NEVER use default shadow-sm/md/lg (cold gray)
 * 
 * TRANSITIONS:
 *   - Hover/Focus: transition-literary (200ms ease-out)
 *   - Enter/Exit: transition-literary-slow (300ms ease-out)
 *   - Colors only: transition-literary-colors
 *   - NEVER use duration-500 (too slow)
 * 
 * FOCUS STATES:
 *   - All interactive elements: focus-visible:ring-burgundy/30
 *   - Or use: focus-literary utility class
 * 
 * COLORS:
 *   - Primary action: bg-burgundy text-white
 *   - Default action: bg-charcoal text-white
 *   - Secondary: bg-parchment text-charcoal
 *   - Ghost: hover:bg-parchment
 *   - Destructive: bg-error text-white
 *   - Text primary: text-charcoal
 *   - Text secondary: text-walnut
 *   - Text muted: text-stone
 *   - Borders: border-linen
 *   - Backgrounds: bg-ivory (page), bg-parchment (cards)
 * 
 * ───────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
	// Primary — Deep library tones
	primary: {
		burgundy: '#722F37',      // Rich wine red — primary accent
		forest: '#2D4739',        // Deep forest green — secondary accent  
		navy: '#1E3A5F',          // Classic navy — tertiary
	},
	
	// Neutrals — Paper and wood
	neutral: {
		ivory: '#FEFCF6',         // Cream paper — primary background
		parchment: '#F5F0E6',     // Aged paper — card backgrounds
		linen: '#E8E2D6',         // Linen texture — borders
		stone: '#C4BAA8',         // Stone — muted text, dividers
		walnut: '#5C4A3D',        // Walnut wood — secondary text
		charcoal: '#2C2520',      // Near black — primary text
	},
	
	// Accents — Precious metals and inks
	accent: {
		gold: '#B8860B',          // Antique gold — highlights, badges
		copper: '#B87333',        // Copper — hover states
		ink: '#1A1A2E',           // Deep ink — headings
		sepia: '#704214',         // Sepia — vintage feel
	},
	
	// Semantic — For UI states
	semantic: {
		success: '#4A7C59',       // Muted green
		warning: '#C4A35A',       // Amber
		error: '#A63D40',         // Muted red
		info: '#4A6FA5',          // Muted blue
	},
} as const

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────

export const typography = {
	// Font families
	fonts: {
		serif: '"Libre Baskerville", "Georgia", serif',      // Headings, literary
		sans: '"Inter", "system-ui", sans-serif',            // Body, UI
		mono: '"JetBrains Mono", "Consolas", monospace',     // Code, technical
	},
	
	// Font sizes (following traditional typographic scale)
	sizes: {
		xs: '0.75rem',      // 12px — captions
		sm: '0.875rem',     // 14px — secondary text
		base: '1rem',       // 16px — body
		lg: '1.125rem',     // 18px — lead text
		xl: '1.25rem',      // 20px — h4
		'2xl': '1.5rem',    // 24px — h3
		'3xl': '1.875rem',  // 30px — h2
		'4xl': '2.25rem',   // 36px — h1
		'5xl': '3rem',      // 48px — display
	},
	
	// Line heights
	leading: {
		tight: '1.25',
		normal: '1.5',
		relaxed: '1.75',
	},
	
	// Letter spacing
	tracking: {
		tight: '-0.025em',
		normal: '0',
		wide: '0.025em',
		wider: '0.05em',
	},
} as const

// ─────────────────────────────────────────────────────────────────────────────
// SPACING & LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

export const spacing = {
	section: '4rem',      // 64px — between major sections
	card: '1.5rem',       // 24px — card padding
	element: '1rem',      // 16px — between elements
	tight: '0.5rem',      // 8px — compact spacing
}

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS & EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

export const shadows = {
	// Soft, paper-like shadows — ALWAYS use these, never Tailwind defaults
	sm: '0 1px 2px rgba(44, 37, 32, 0.04)',
	md: '0 4px 6px rgba(44, 37, 32, 0.06), 0 2px 4px rgba(44, 37, 32, 0.04)',
	lg: '0 10px 15px rgba(44, 37, 32, 0.08), 0 4px 6px rgba(44, 37, 32, 0.04)',
	xl: '0 20px 25px rgba(44, 37, 32, 0.10), 0 10px 10px rgba(44, 37, 32, 0.04)',
	
	// Inset for depth
	inset: 'inset 0 1px 2px rgba(44, 37, 32, 0.06)',
	
	// CSS class equivalents (for documentation)
	// .shadow-literary-sm → shadows.sm
	// .shadow-literary    → shadows.md  
	// .shadow-literary-lg → shadows.lg
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTION & TRANSITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * THE OPINION: Movement should feel like turning pages, not fireworks.
 * 
 * CSS Classes:
 * - .transition-literary        → 200ms ease-out (hover/focus — snappy)
 * - .transition-literary-colors → color transitions only (200ms)
 * - .transition-literary-slow   → 300ms ease-out (enter/exit animations)
 * 
 * NEVER use duration-500 (too slow). NEVER use ease-in (unnatural exit).
 */
export const motion = {
	// Duration scale
	duration: {
		instant: '0ms',       // No animation
		fast: '150ms',        // Micro-interactions (checkboxes, toggles)
		normal: '200ms',      // Hover/focus states — THE DEFAULT
		slow: '300ms',        // Enter/exit animations
	},
	
	// Easing functions
	easing: {
		default: 'ease-out',  // Natural deceleration — THE DEFAULT
		spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Slight overshoot
	},
}

// ─────────────────────────────────────────────────────────────────────────────
// BORDERS & RADII
// ─────────────────────────────────────────────────────────────────────────────

export const borders = {
	// Crisp, not pillowy — THE OPINION
	radius: {
		sm: '0.25rem',    // 4px — buttons, inputs (rounded-sm)
		md: '0.375rem',   // 6px — cards, containers (rounded)
		lg: '0.5rem',     // 8px — modals, large cards
		full: '9999px',   // Pills, avatars ONLY
	},
	
	// Border colors
	color: {
		subtle: colors.neutral.linen,
		medium: colors.neutral.stone,
		strong: colors.neutral.walnut,
	},
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY VISUAL SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Instead of emojis, each category gets:
 * - A sophisticated color from our palette
 * - An icon key that maps to custom SVG illustrations
 * - A typographic treatment
 */
export const categoryVisuals: Record<string, { color: string; iconKey: string; accent: string }> = {
	// Fiction genres
	'fiction': { color: colors.primary.burgundy, iconKey: 'book-open', accent: colors.accent.gold },
	'literary-fiction': { color: colors.accent.ink, iconKey: 'quill', accent: colors.accent.sepia },
	'science-fiction': { color: colors.primary.navy, iconKey: 'stars', accent: colors.accent.copper },
	'fantasy': { color: colors.primary.forest, iconKey: 'castle', accent: colors.accent.gold },
	'mystery': { color: colors.accent.ink, iconKey: 'magnifier', accent: colors.primary.burgundy },
	'thriller': { color: '#1A1A2E', iconKey: 'dagger', accent: colors.semantic.error },
	'romance': { color: colors.primary.burgundy, iconKey: 'heart-book', accent: colors.accent.copper },
	'horror': { color: '#1A1A2E', iconKey: 'moon', accent: colors.neutral.stone },
	'historical-fiction': { color: colors.accent.sepia, iconKey: 'scroll', accent: colors.accent.gold },
	'adventure': { color: colors.primary.forest, iconKey: 'compass', accent: colors.accent.copper },
	'classics': { color: colors.accent.sepia, iconKey: 'laurel', accent: colors.accent.gold },
	
	// Non-fiction
	'non-fiction': { color: colors.primary.navy, iconKey: 'bookmark', accent: colors.accent.gold },
	'biography': { color: colors.neutral.walnut, iconKey: 'portrait', accent: colors.accent.sepia },
	'memoir': { color: colors.accent.sepia, iconKey: 'diary', accent: colors.accent.copper },
	'self-help': { color: colors.primary.forest, iconKey: 'sunrise', accent: colors.accent.gold },
	'business': { color: colors.primary.navy, iconKey: 'chart', accent: colors.accent.copper },
	'history': { color: colors.accent.sepia, iconKey: 'hourglass', accent: colors.accent.gold },
	'science': { color: colors.primary.navy, iconKey: 'atom', accent: colors.accent.copper },
	'philosophy': { color: colors.accent.ink, iconKey: 'owl', accent: colors.accent.gold },
	'psychology': { color: colors.primary.forest, iconKey: 'mind', accent: colors.primary.burgundy },
	
	// Technical
	'technology': { color: colors.primary.navy, iconKey: 'circuit', accent: colors.accent.copper },
	'programming': { color: colors.accent.ink, iconKey: 'code', accent: colors.primary.forest },
	'web-development': { color: colors.primary.forest, iconKey: 'globe', accent: colors.accent.copper },
	'data-science': { color: colors.primary.navy, iconKey: 'graph', accent: colors.accent.gold },
	
	// Lifestyle
	'cooking': { color: colors.accent.copper, iconKey: 'chef', accent: colors.primary.forest },
	'travel': { color: colors.primary.forest, iconKey: 'map', accent: colors.accent.gold },
	'art': { color: colors.primary.burgundy, iconKey: 'palette', accent: colors.accent.gold },
	
	// Children & YA
	'children': { color: colors.semantic.info, iconKey: 'teddy', accent: colors.accent.gold },
	'young-adult': { color: colors.primary.burgundy, iconKey: 'spark', accent: colors.accent.copper },
	
	// Default
	'default': { color: colors.neutral.walnut, iconKey: 'book', accent: colors.accent.gold },
}

/**
 * Get visual config for a category
 */
export const getCategoryVisual = (slug: string) => {
	return categoryVisuals[slug] || categoryVisuals['default']
}

// ─────────────────────────────────────────────────────────────────────────────
// MOOD VISUAL SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Moods as sophisticated reading atmospheres, not toy-ish emoji cards
 */
export const moodVisuals: Record<string, { 
	gradient: string
	iconKey: string
	atmosphere: string
}> = {
	'adventurous': {
		gradient: `linear-gradient(135deg, ${colors.primary.forest} 0%, ${colors.accent.copper} 100%)`,
		iconKey: 'compass',
		atmosphere: 'A crackling fire in a mountain lodge, maps spread across the table.',
	},
	'cozy': {
		gradient: `linear-gradient(135deg, ${colors.accent.copper} 0%, ${colors.accent.gold} 100%)`,
		iconKey: 'fireplace',
		atmosphere: 'Rain against the window, a worn armchair, and a cup of tea.',
	},
	'intellectual': {
		gradient: `linear-gradient(135deg, ${colors.primary.navy} 0%, ${colors.accent.ink} 100%)`,
		iconKey: 'owl',
		atmosphere: 'A library at midnight, the world distilled to thought.',
	},
	'romantic': {
		gradient: `linear-gradient(135deg, ${colors.primary.burgundy} 0%, ${colors.accent.copper} 100%)`,
		iconKey: 'rose',
		atmosphere: 'Candlelight, handwritten letters, and the ache of longing.',
	},
	'suspenseful': {
		gradient: `linear-gradient(135deg, ${colors.accent.ink} 0%, ${colors.primary.burgundy} 100%)`,
		iconKey: 'shadow',
		atmosphere: 'A single lamp in the dark, turning pages with held breath.',
	},
	'nostalgic': {
		gradient: `linear-gradient(135deg, ${colors.accent.sepia} 0%, ${colors.accent.gold} 100%)`,
		iconKey: 'vintage',
		atmosphere: 'Dusty shelves, sun-faded spines, the smell of old paper.',
	},
	'inspiring': {
		gradient: `linear-gradient(135deg, ${colors.primary.forest} 0%, ${colors.accent.gold} 100%)`,
		iconKey: 'sunrise',
		atmosphere: 'Morning light through tall windows, the world full of possibility.',
	},
	'dark': {
		gradient: `linear-gradient(135deg, ${colors.accent.ink} 0%, #000 100%)`,
		iconKey: 'moon',
		atmosphere: 'Shadows that move, secrets that whisper, beauty in the macabre.',
	},
}

export const getMoodVisual = (mood: string) => {
	return moodVisuals[mood] || moodVisuals['cozy']
}

// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATE EXPORT — For convenience in components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Flattened design tokens for easy component access.
 * Maps semantic names to actual values.
 */
export const designTokens = {
	colors: {
		// Primary palette (flattened for convenience)
		burgundy: colors.primary.burgundy,
		forest: colors.primary.forest,
		navy: colors.primary.navy,
		
		// Neutrals
		ivory: colors.neutral.ivory,
		parchment: colors.neutral.parchment,
		linen: colors.neutral.linen,
		stone: colors.neutral.stone,
		walnut: colors.neutral.walnut,
		charcoal: colors.neutral.charcoal,
		
		// Accents
		gold: colors.accent.gold,
		copper: colors.accent.copper,
		ink: colors.accent.ink,
		sepia: colors.accent.sepia,
		
		// Semantic text colors
		text: {
			primary: colors.neutral.charcoal,
			secondary: colors.neutral.walnut,
			muted: colors.neutral.stone,
			inverse: colors.neutral.ivory,
		},
		
		// Semantic border colors
		border: {
			light: colors.neutral.linen,
			medium: colors.neutral.stone,
			strong: colors.neutral.walnut,
		},
		
		// Semantic background colors
		background: {
			primary: colors.neutral.ivory,
			secondary: colors.neutral.parchment,
			accent: colors.primary.burgundy,
		},
		
		// Status colors
		success: colors.semantic.success,
		warning: colors.semantic.warning,
		error: colors.semantic.error,
		info: colors.semantic.info,
	},
	
	typography: {
		fontFamily: {
			serif: typography.fonts.serif,
			sans: typography.fonts.sans,
			mono: typography.fonts.mono,
		},
		fontSize: typography.sizes,
		lineHeight: typography.leading,
		letterSpacing: typography.tracking,
	},
	
	spacing,
	shadows,
	borders,
} as const
```


---

# CHEFKIX-FE

## `chefkix-fe\src\app\layout.tsx`

```tsx
import {
	Plus_Jakarta_Sans,
	Space_Grotesk,
	Playfair_Display,
} from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { TokenRefreshProvider } from '@/components/providers/TokenRefreshProvider'
import { CelebrationProvider } from '@/components/providers/CelebrationProvider'
import { GoogleOAuthWrapper } from '@/components/providers/GoogleOAuthWrapper'
import { NetworkStatusProvider } from '@/components/providers/NetworkStatusProvider'
import { BlockedUsersProvider } from '@/components/providers/BlockedUsersProvider'
import { Toaster } from '@/components/ui/toaster'

// Primary font: Plus Jakarta Sans - Modern, friendly, slightly rounded
// Perfect for a social cooking app - warm but professional
const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-sans',
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600', '700', '800'],
})

// Display font: Space Grotesk - Bold, geometric, gaming vibes
// For headings, stats, XP numbers - gives that Duolingo energy
const spaceGrotesk = Space_Grotesk({
	variable: '--font-display',
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600', '700'],
})

// Accent font: Playfair Display - Elegant serif for recipe titles
// Adds sophistication, like a cookbook or food magazine
const playfair = Playfair_Display({
	variable: '--font-serif',
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
	title: {
		default: 'Chefkix - Gamified Cooking Recipes & Community',
		template: '%s | Chefkix',
	},
	description:
		'Transform cooking into an interactive game! Follow step-by-step recipes with timers, earn badges, level up, and connect with a community of food enthusiasts.',
	keywords: [
		'cooking recipes',
		'gamified cooking',
		'step-by-step recipes',
		'cooking community',
		'cooking timers',
		'recipe sharing',
		'culinary challenges',
	],
	authors: [{ name: 'Chefkix Team' }],
	openGraph: {
		type: 'website',
		locale: 'en_US',
		siteName: 'Chefkix',
		title: 'Chefkix - Gamified Cooking Recipes',
		description:
			'Transform cooking into an interactive game! Earn badges, level up, and master recipes with our step-by-step cooking platform.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Chefkix - Gamified Cooking Recipes',
		description:
			'Transform cooking into an interactive game! Earn badges and master recipes.',
	},
	robots: {
		index: true,
		follow: true,
	},
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body
				className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${playfair.variable} font-sans antialiased`}
			>
				<GoogleOAuthWrapper>
					<AuthProvider>
						<TokenRefreshProvider>
							<BlockedUsersProvider>
								<CelebrationProvider>{children}</CelebrationProvider>
							</BlockedUsersProvider>
						</TokenRefreshProvider>
					</AuthProvider>
				</GoogleOAuthWrapper>
				<NetworkStatusProvider />
				<Toaster position='top-right' maxToasts={5} />
			</body>
		</html>
	)
}
```

## `chefkix-fe\src\app\page.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Typewriter } from 'react-simple-typewriter'

export default function HomePage() {
	const router = useRouter()
	const { user, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading) {
			if (user) {
				// Redirect authenticated users to dashboard
				router.push('/dashboard')
			} else {
				// Redirect guests to sign-in
				router.push('/auth/sign-in')
			}
		}
	}, [user, isLoading, router])

	// Show loading state while redirecting with Typewriter effect
	return (
		<div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5'>
			<div className='text-center'>
				<h1 className='mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent'>
					Chefkix
				</h1>
				<p className='text-lg text-text-secondary'>
					<Typewriter
						words={[
							'Cook with confidence...',
							'Learn new recipes...',
							'Share your creations...',
							'Join the community...',
						]}
						loop={0}
						cursor
						cursorStyle='|'
						typeSpeed={70}
						deleteSpeed={50}
						delaySpeed={1000}
					/>
				</p>
			</div>
		</div>
	)
}
```

## `chefkix-fe\src\app\(main)\layout.tsx`

```tsx
import { Topbar } from '@/components/layout/Topbar'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { MessagesDrawer } from '@/components/layout/MessagesDrawer'
import { NotificationsPopup } from '@/components/layout/NotificationsPopup'
import { CookingPlayer } from '@/components/cooking/CookingPlayer'
import { CookingPanel } from '@/components/cooking/CookingPanel'
import { MiniCookingBar } from '@/components/cooking/MiniCookingBar'
import { CookingSidebarSwitch } from '@/components/cooking/CookingSidebarSwitch'
import { CookingTimerProvider } from '@/components/providers/CookingTimerProvider'
import { ErrorBoundary } from '@/components/providers/ErrorBoundary'
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts'

export default function MainAppLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex h-screen w-full flex-col overflow-hidden bg-background'>
			{/* Topbar fixed at top, spans full width */}
			<ErrorBoundary>
				<Topbar />
			</ErrorBoundary>
			{/* Main content area with sidebars - scrollable */}
			<div className='flex flex-1 overflow-hidden'>
				<ErrorBoundary>
					<LeftSidebar />
				</ErrorBoundary>
				<main className='flex flex-1 flex-col gap-4 overflow-y-auto scroll-smooth p-4 lg:gap-6 lg:p-6'>
					<ErrorBoundary>{children}</ErrorBoundary>
				</main>
				{/* Conditional: CookingPanel (when cooking) or RightSidebar (default) */}
				<ErrorBoundary>
					<CookingSidebarSwitch />
				</ErrorBoundary>
			</div>
			<MessagesDrawer />
			<NotificationsPopup />
			{/* Fullscreen cooking player - for expanded mode */}
			<CookingPlayer />
			{/* Mini cooking bar - for mobile collapsed mode */}
			<MiniCookingBar />
			{/* Centralized timer ticking + completion notifications */}
			<CookingTimerProvider />
			<KeyboardShortcuts />
		</div>
	)
}
```

## `chefkix-fe\src\app\(main)\dashboard\page.tsx`

```tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Post } from '@/lib/types'
import { getFeedPosts } from '@/services/post'
import {
	getPendingSessions,
	SessionHistoryItem,
} from '@/services/cookingSession'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageTransition } from '@/components/layout/PageTransition'
import { PostCard } from '@/components/social/PostCard'
import { PostCardSkeleton } from '@/components/social/PostCardSkeleton'
import { CreatePostForm } from '@/components/social/CreatePostForm'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyStateGamified } from '@/components/shared'
import { Stories } from '@/components/social/Stories'
import { StaggerContainer } from '@/components/ui/stagger-animation'
import {
	Users,
	MessageSquare,
	Home,
	Sparkles,
	TrendingUp,
	Clock,
	Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useFilterBlockedContent } from '@/hooks/useBlockedUsers'
import { AnimatePresence } from 'framer-motion'
import { StreakRiskBanner } from '@/components/streak'
import { PendingPostsSection, type PendingSession } from '@/components/pending'
import { ResumeCookingBanner } from '@/components/cooking'
import { SinceLastVisitCard } from '@/components/dashboard'
import { useRouter } from 'next/navigation'
import { TRANSITION_SPRING } from '@/lib/motion'
import { cn } from '@/lib/utils'

// ============================================
// CONSTANTS
// ============================================

const POSTS_PER_PAGE = 10

// ============================================
// TYPES
// ============================================

type FeedMode = 'latest' | 'trending'

// ============================================
// HELPERS
// ============================================

/**
 * Calculate pending status based on days remaining
 */
const getPendingStatus = (
	daysRemaining: number,
): 'urgent' | 'warning' | 'normal' | 'expired' => {
	if (daysRemaining <= 0) return 'expired'
	if (daysRemaining <= 2) return 'urgent'
	if (daysRemaining <= 5) return 'warning'
	return 'normal'
}

/**
 * Transform SessionHistoryItem to PendingSession format for UI component
 */
const transformToPendingSession = (
	session: SessionHistoryItem,
): PendingSession => {
	const daysRemaining = session.daysRemaining ?? 14
	const cookedAt = new Date(session.completedAt || session.startedAt)
	// Calculate expiresAt: postDeadline from API or 14 days from completion
	const expiresAt = session.postDeadline
		? new Date(session.postDeadline)
		: new Date(cookedAt.getTime() + 14 * 24 * 60 * 60 * 1000)

	return {
		id: session.sessionId,
		recipeId: session.recipeId,
		recipeName: session.recipeTitle,
		recipeImage: session.coverImageUrl?.[0] || '/placeholder-recipe.jpg',
		cookedAt,
		duration: 0, // API doesn't provide cook duration
		baseXP: session.baseXpAwarded || 0,
		currentXP: session.pendingXp || 0,
		expiresAt,
		status: getPendingStatus(daysRemaining),
		postId: session.postId || undefined,
	}
}

// ============================================
// PAGE
// ============================================

export default function DashboardPage() {
	const { user } = useAuth()
	const router = useRouter()
	const [posts, setPosts] = useState<Post[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showStreakBanner, setShowStreakBanner] = useState(true)
	const [pendingSessions, setPendingSessions] = useState<PendingSession[]>([])
	const [feedMode, setFeedMode] = useState<FeedMode>('latest')
	const [currentPage, setCurrentPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const loadMoreRef = useRef<HTMLDivElement>(null)

	// Filter out posts from blocked users
	const filteredPosts = useFilterBlockedContent(posts)

	// Streak at risk = has active streak AND hasn't cooked within window
	// Backend computes cookedToday (within 72h window) and hoursUntilStreakBreaks
	const stats = user?.statistics
	const hasActiveStreak = (stats?.streakCount ?? 0) > 0
	const hasStreakAtRisk = hasActiveStreak && !stats?.cookedToday
	const hoursUntilBreak = stats?.hoursUntilStreakBreaks ?? 0
	const isUrgent =
		hasStreakAtRisk && hoursUntilBreak > 0 && hoursUntilBreak <= 2

	// Fetch initial page
	useEffect(() => {
		const fetchInitialData = async () => {
			setIsLoading(true)
			setError(null)
			setCurrentPage(0)
			setPosts([])

			try {
				// Fetch feed posts and pending sessions in parallel
				const [feedResponse, pendingResponse] = await Promise.all([
					getFeedPosts({ page: 0, size: POSTS_PER_PAGE, mode: feedMode }),
					getPendingSessions(),
				])

				if (feedResponse.success && feedResponse.data) {
					let feedPosts = feedResponse.data

					// OPTIMISTIC UPDATE: Check for newly created post with XP
					// This handles the "Two Truths" problem where the FE has the
					// correct XP from linkPostToSession, but the post-service DB
					// hasn't been updated yet by the Kafka consumer.
					const newPostJson = sessionStorage.getItem('newPost')
					if (newPostJson) {
						try {
							const newPost = JSON.parse(newPostJson) as Post
							// Remove from sessionStorage immediately (one-time use)
							sessionStorage.removeItem('newPost')
							// Prepend to feed if not already present
							const exists = feedPosts.some(p => p.id === newPost.id)
							if (!exists) {
								feedPosts = [newPost, ...feedPosts]
							} else {
								// Post exists but may have stale xpEarned - update it
								feedPosts = feedPosts.map(p =>
									p.id === newPost.id
										? { ...p, xpEarned: newPost.xpEarned }
										: p,
								)
							}
						} catch (e) {
							console.error('Failed to parse newPost from sessionStorage:', e)
							sessionStorage.removeItem('newPost')
						}
					}

					setPosts(feedPosts)
					// Use pagination info from backend - check if current page is the last
					if (feedResponse.pagination) {
						setHasMore(
							feedResponse.pagination.currentPage <
								feedResponse.pagination.totalPages - 1,
						)
					} else {
						setHasMore(feedPosts.length >= POSTS_PER_PAGE)
					}
				}

				if (pendingResponse.success && pendingResponse.data) {
					setPendingSessions(
						pendingResponse.data.map(transformToPendingSession),
					)
				}
			} catch (err) {
				setError('Failed to load feed')
			} finally {
				setIsLoading(false)
			}
		}

		fetchInitialData()
	}, [feedMode])

	// Load more posts when scrolling
	const loadMorePosts = useCallback(async () => {
		if (isLoadingMore || !hasMore) return

		setIsLoadingMore(true)
		const nextPage = currentPage + 1

		try {
			const response = await getFeedPosts({
				page: nextPage,
				size: POSTS_PER_PAGE,
				mode: feedMode,
			})

			if (response.success && response.data) {
				setPosts(prev => [...prev, ...response.data!])
				setCurrentPage(nextPage)
				if (response.pagination) {
					setHasMore(
						response.pagination.currentPage <
							response.pagination.totalPages - 1,
					)
				} else {
					setHasMore(response.data.length >= POSTS_PER_PAGE)
				}
			}
		} catch (err) {
			console.error('Failed to load more posts:', err)
		} finally {
			setIsLoadingMore(false)
		}
	}, [isLoadingMore, hasMore, currentPage, feedMode])

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (
					entries[0].isIntersecting &&
					hasMore &&
					!isLoadingMore &&
					!isLoading
				) {
					loadMorePosts()
				}
			},
			{ threshold: 0.1, rootMargin: '100px' },
		)

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current)
		}

		return () => observer.disconnect()
	}, [hasMore, isLoadingMore, isLoading, loadMorePosts])

	const handlePostCreated = (newPost: Post) => {
		setPosts(prev => (Array.isArray(prev) ? [newPost, ...prev] : [newPost]))
		// Dismiss streak banner when user creates a post (cooking activity)
		setShowStreakBanner(false)
	}

	const handlePostFromPending = (sessionId: string) => {
		// Navigate to dedicated post composer with session context for XP unlock
		router.push(`/post/new?session=${sessionId}`)
	}

	const handleDismissPending = () => {
		// Optionally hide pending section temporarily
		setPendingSessions([])
	}

	const handlePostUpdate = (updatedPost: Post) => {
		setPosts(prev =>
			Array.isArray(prev)
				? prev.map(p => (p.id === updatedPost.id ? updatedPost : p))
				: [],
		)
	}

	const handlePostDelete = (postId: string) => {
		setPosts(prev =>
			Array.isArray(prev) ? prev.filter(p => p.id !== postId) : [],
		)
	}

	return (
		<PageTransition>
			<PageContainer maxWidth='lg'>
				{/* Since Last Visit Summary - Welcome back card with activity summary */}
				<SinceLastVisitCard className='mb-4' />
				{/* Resume Cooking Banner - Show when user has an interrupted/paused session */}
				<ResumeCookingBanner className='mb-4' />
				{/* Streak Risk Banner - Show when user has a streak but hasn't cooked within window */}
				{hasStreakAtRisk && showStreakBanner && (
					<StreakRiskBanner
						currentStreak={stats?.streakCount ?? 0}
						timeRemaining={{ hours: hoursUntilBreak, minutes: 0 }}
						isUrgent={isUrgent}
						onQuickCook={() => router.push('/explore')}
						onDismiss={() => setShowStreakBanner(false)}
						className='mb-4'
					/>
				)}
				{/* Pending Posts Section - Show when user has cooked but not posted */}
				{pendingSessions.length > 0 && (
					<PendingPostsSection
						sessions={pendingSessions}
						onPost={handlePostFromPending}
						onDismiss={handleDismissPending}
						onViewAll={() => router.push(`/${user?.userId}?tab=cooking`)}
						className='mb-4'
					/>
				)}
				<div className='mb-4 md:mb-6 lg:hidden'>
					<Stories variant='horizontal' />
				</div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={TRANSITION_SPRING}
					className='mb-6'
				>
					<div className='mb-2 flex items-center gap-3'>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, ...TRANSITION_SPRING }}
							className='flex size-12 items-center justify-center rounded-2xl bg-gradient-hero shadow-md shadow-brand/25'
						>
							<Home className='size-6 text-white' />
						</motion.div>
						<h1 className='text-3xl font-bold leading-tight text-text'>
							Your Feed
						</h1>
					</div>
					<p className='flex items-center gap-2 leading-normal text-text-secondary'>
						<Sparkles className='size-4 text-streak' />
						Share your culinary journey and see what people you follow are
						cooking
					</p>
				</motion.div>
				{/* Feed Mode Tabs */}
				<div className='mb-4 flex gap-2'>
					<button
						onClick={() => setFeedMode('latest')}
						className={cn(
							'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
							feedMode === 'latest'
								? 'bg-gradient-brand text-white shadow-md shadow-brand/25'
								: 'bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text',
						)}
					>
						<Clock className='size-4' />
						Latest
					</button>
					<button
						onClick={() => setFeedMode('trending')}
						className={cn(
							'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
							feedMode === 'trending'
								? 'bg-gradient-brand text-white shadow-md shadow-brand/25'
								: 'bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text',
						)}
					>
						<TrendingUp className='size-4' />
						Trending
					</button>
				</div>
				{/* Create Post Form */}
				<div className='mb-4 md:mb-6'>
					<CreatePostForm
						onPostCreated={handlePostCreated}
						currentUser={
							user
								? {
										userId: user.userId ?? '',
										displayName: user.displayName || user.username || 'User',
										avatarUrl: user.avatarUrl,
									}
								: undefined
						}
					/>
				</div>
				{/* Content */}
				{isLoading && (
					<div className='space-y-4 md:space-y-6'>
						<PostCardSkeleton count={3} showImages={false} />
					</div>
				)}{' '}
				{error && (
					<ErrorState
						title='Failed to load feed'
						message={error}
						onRetry={() => window.location.reload()}
					/>
				)}
				{!isLoading && !error && filteredPosts.length === 0 && (
					<EmptyStateGamified
						variant='feed'
						title='Your feed is empty'
						description='Follow chefs to see their latest posts here!'
						primaryAction={{
							label: 'Discover People',
							href: '/discover',
							icon: <Users className='h-4 w-4' />,
						}}
						secondaryActions={[
							{
								label: 'Explore Posts',
								href: '/explore',
								icon: <MessageSquare className='h-4 w-4' />,
							},
						]}
						fomoStats={[
							{ label: 'Recipes posted today', value: '1,234' },
							{ label: 'Active chefs', value: '567' },
						]}
					/>
				)}
				{!isLoading && !error && filteredPosts.length > 0 && (
					<>
						<StaggerContainer className='space-y-4 md:space-y-6'>
							<AnimatePresence mode='popLayout'>
								{filteredPosts.map(post => (
									<PostCard
										key={post.id}
										post={post}
										onUpdate={handlePostUpdate}
										onDelete={handlePostDelete}
										currentUserId={user?.userId}
									/>
								))}
							</AnimatePresence>
						</StaggerContainer>

						{/* Infinite scroll trigger */}
						<div ref={loadMoreRef} className='flex justify-center py-8'>
							{isLoadingMore && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className='flex items-center gap-2 text-text-secondary'
								>
									<Loader2 className='size-5 animate-spin text-brand' />
									<span className='text-sm font-medium'>
										Loading more posts...
									</span>
								</motion.div>
							)}
							{!hasMore && filteredPosts.length > POSTS_PER_PAGE && (
								<p className='text-sm text-text-muted'>
									You&apos;ve reached the end of the feed
								</p>
							)}
						</div>
					</>
				)}
			</PageContainer>
		</PageTransition>
	)
}
```

## `chefkix-fe\src\app\auth\sign-in\page.tsx`

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SignInForm } from '@/components/auth/SignInForm'
import { SIGN_IN_MESSAGES } from '@/constants/messages'
import { TRANSITION_SPRING, staggerContainer, staggerItem } from '@/lib/motion'
import { ChefHat, Sparkles } from 'lucide-react'
import { LazyLottie } from '@/components/shared/LazyLottie'
import { cn } from '@/lib/utils'

/**
 * Floating gradient orbs - purely decorative ambient effects
 * Uses CSS animations (GPU-accelerated, zero JS overhead) instead of Framer Motion
 * Animation is subtle and stops after 3 cycles to save CPU
 */
const FloatingOrb = ({
	className,
	delay,
}: {
	className: string
	delay: number
}) => (
	<div
		className={cn('animate-float-orb opacity-30', className)}
		style={{ animationDelay: `${delay}s` }}
	/>
)

const SignInPage = () => {
	return (
		<div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4'>
			{/* Warm gradient background */}
			<div className='absolute inset-0 bg-gradient-to-br from-brand/5 via-bg to-xp/5' />

			{/* Floating decorative orbs */}
			<FloatingOrb
				className='absolute -left-32 top-1/4 size-64 rounded-full bg-gradient-to-br from-brand/20 to-brand/5 blur-3xl'
				delay={0}
			/>
			<FloatingOrb
				className='absolute -right-32 bottom-1/4 size-80 rounded-full bg-gradient-to-br from-xp/20 to-xp/5 blur-3xl'
				delay={2}
			/>
			<FloatingOrb
				className='absolute -bottom-20 left-1/3 size-48 rounded-full bg-gradient-to-br from-streak/20 to-streak/5 blur-3xl'
				delay={4}
			/>

			{/* Background Lottie Animation - lazy loaded with theatrical entrance */}
			<div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-10'>
				<LazyLottie
					src='/lottie/lottie-login.json'
					sizeOfIllustrator={(w, h) => Math.min(w * 0.5, h * 0.6, 400)}
					entrance='fade'
					loop
					autoplay
				/>
			</div>

			{/* Main Content - No z-index manipulation to avoid stacking context issues */}
			<motion.div
				variants={staggerContainer}
				initial='hidden'
				animate='visible'
				className='relative w-full max-w-md'
			>
				{/* Logo & Branding */}
				<motion.div
					variants={staggerItem}
					className='mb-8 flex flex-col items-center'
				>
					<motion.div
						whileHover={{ rotate: 10, scale: 1.1 }}
						transition={TRANSITION_SPRING}
						className='mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-hero shadow-lg shadow-brand/30'
					>
						<ChefHat className='size-10 text-white' />
					</motion.div>
					<motion.h1
						className='mb-1 text-3xl font-bold text-text'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						ChefKix
					</motion.h1>
					<motion.p
						className='flex items-center gap-1 text-sm text-text-muted'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<Sparkles className='size-3.5 text-streak' />
						Level up your cooking journey
					</motion.p>
				</motion.div>

				{/* Sign In Card - NOTE: No backdrop-blur to avoid stacking context issues with modals */}
				<motion.div
					variants={staggerItem}
					className='overflow-hidden rounded-3xl border border-border-subtle bg-bg-card p-8 shadow-xl shadow-black/5'
				>
					<motion.h2
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className='mb-2 text-center text-2xl font-bold text-text'
					>
						{SIGN_IN_MESSAGES.PAGE_TITLE}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className='mb-8 text-center text-text-secondary'
					>
						{SIGN_IN_MESSAGES.PAGE_SUBTITLE}
					</motion.p>
					<SignInForm />
				</motion.div>
			</motion.div>
		</div>
	)
}

export default SignInPage
```

## `chefkix-fe\src\app\auth\sign-up\page.tsx`

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { SIGN_UP_MESSAGES } from '@/constants/messages'
import { TRANSITION_SPRING, staggerContainer, staggerItem } from '@/lib/motion'
import { ChefHat, Sparkles, Zap, Trophy, Users } from 'lucide-react'
import { LazyLottie } from '@/components/shared/LazyLottie'
import { cn } from '@/lib/utils'

/**
 * Floating gradient orbs - purely decorative ambient effects
 * Uses CSS animations (GPU-accelerated, zero JS overhead) instead of Framer Motion
 * Animation is subtle and stops after 3 cycles to save CPU
 */
const FloatingOrb = ({
	className,
	delay,
}: {
	className: string
	delay: number
}) => (
	<div
		className={cn('animate-float-orb opacity-30', className)}
		style={{ animationDelay: `${delay}s` }}
	/>
)

const SignUpPage = () => {
	return (
		<div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4 py-8'>
			{/* Warm gradient background */}
			<div className='absolute inset-0 bg-gradient-to-br from-xp/5 via-bg to-brand/5' />

			{/* Floating decorative orbs */}
			<FloatingOrb
				className='absolute -right-32 top-1/4 size-64 rounded-full bg-gradient-to-br from-xp/20 to-xp/5 blur-3xl'
				delay={0}
			/>
			<FloatingOrb
				className='absolute -left-32 bottom-1/4 size-80 rounded-full bg-gradient-to-br from-brand/20 to-brand/5 blur-3xl'
				delay={2}
			/>
			<FloatingOrb
				className='absolute -top-20 right-1/3 size-48 rounded-full bg-gradient-to-br from-level/20 to-level/5 blur-3xl'
				delay={4}
			/>

			{/* Background Lottie Animation - lazy loaded with theatrical entrance */}
			<div className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-10'>
				<LazyLottie
					src='/lottie/lottie-register.json'
					sizeOfIllustrator={(w, h) => Math.min(w * 0.5, h * 0.6, 400)}
					entrance='fade'
					loop
					autoplay
				/>
			</div>

			{/* Main Content - No z-index manipulation to avoid stacking context issues */}
			<motion.div
				variants={staggerContainer}
				initial='hidden'
				animate='visible'
				className='relative w-full max-w-md'
			>
				{/* Logo & Branding */}
				<motion.div
					variants={staggerItem}
					className='mb-6 flex flex-col items-center'
				>
					<motion.div
						whileHover={{ rotate: -10, scale: 1.1 }}
						transition={TRANSITION_SPRING}
						className='mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-xp shadow-lg shadow-xp/30'
					>
						<ChefHat className='size-10 text-white' />
					</motion.div>
					<motion.h1
						className='mb-1 text-3xl font-bold text-text'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						Join ChefKix
					</motion.h1>
					<motion.p
						className='flex items-center gap-1 text-sm text-text-muted'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<Sparkles className='size-3.5 text-level' />
						Start your culinary adventure
					</motion.p>
				</motion.div>

				{/* Benefits Pills */}
				<motion.div
					variants={staggerItem}
					className='mb-6 flex flex-wrap justify-center gap-2'
				>
					{[
						{ icon: Zap, label: 'Earn XP', color: 'bg-xp/10 text-xp' },
						{
							icon: Trophy,
							label: 'Level Up',
							color: 'bg-level/10 text-level',
						},
						{
							icon: Users,
							label: 'Join Community',
							color: 'bg-brand/10 text-brand',
						},
					].map((benefit, i) => (
						<motion.span
							key={benefit.label}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4 + i * 0.1, ...TRANSITION_SPRING }}
							className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${benefit.color}`}
						>
							<benefit.icon className='size-3.5' />
							{benefit.label}
						</motion.span>
					))}
				</motion.div>

				{/* Sign Up Card - NOTE: No backdrop-blur to avoid stacking context issues with modals */}
				<motion.div
					variants={staggerItem}
					className='overflow-hidden rounded-3xl border border-border-subtle bg-bg-card p-8 shadow-xl shadow-black/5'
				>
					<motion.h2
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className='mb-2 text-center text-2xl font-bold text-text'
					>
						{SIGN_UP_MESSAGES.PAGE_TITLE}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className='mb-6 text-center text-text-secondary'
					>
						{SIGN_UP_MESSAGES.PAGE_SUBTITLE}
					</motion.p>
					<SignUpForm />
				</motion.div>
			</motion.div>
		</div>
	)
}

export default SignUpPage
```

## `chefkix-fe\src\components\layout\LeftSidebar.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
	Home,
	Compass,
	Target,
	PlusSquare,
	Users,
	MessageCircle,
	Settings,
	User,
	Bell,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import {
	TRANSITION_SPRING,
	ICON_BUTTON_HOVER,
	ICON_BUTTON_TAP,
} from '@/lib/motion'
import type { LucideIcon } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'

interface NavItem {
	href: string | ((userId?: string) => string)
	icon: LucideIcon
	label: string
	showBadge?: boolean // Whether this item can show a notification badge
}

const navItems: NavItem[] = [
	{ href: '/dashboard', icon: Home, label: 'Home' },
	{ href: '/explore', icon: Compass, label: 'Explore' },
	{ href: '/challenges', icon: Target, label: 'Challenges' },
	{ href: '/community', icon: Users, label: 'Community' },
	{ href: '/create', icon: PlusSquare, label: 'Create' },
	{ href: '/messages', icon: MessageCircle, label: 'Messages' },
	{ href: '/notifications', icon: Bell, label: 'Notifs', showBadge: true },
	// NOTE: Saved removed from nav - access via Profile page's Saved tab
	// Having both "Saved" and "Profile" in nav was confusing (same destination)
	{ href: '/profile', icon: User, label: 'Profile' },
	{ href: '/settings', icon: Settings, label: 'Settings' },
]

export const LeftSidebar = () => {
	const pathname = usePathname()
	const { user, isAuthenticated } = useAuth()
	const { unreadCount, startPolling, stopPolling } = useNotificationStore()

	// Start/stop polling based on auth state
	useEffect(() => {
		if (isAuthenticated) {
			startPolling()
		} else {
			stopPolling()
		}

		return () => stopPolling()
	}, [isAuthenticated, startPolling, stopPolling])

	const getHref = (item: NavItem): string => {
		if (typeof item.href === 'function') {
			return item.href(user?.userId)
		}
		return item.href
	}

	const isActive = (item: NavItem) => {
		const href = getHref(item)
		if (href === '/dashboard') return pathname === href || pathname === '/'
		// For saved tab, check if on profile with saved tab
		if (item.label === 'Saved') {
			return (
				pathname.includes(user?.userId ?? '') && pathname.includes('tab=saved')
			)
		}
		return pathname.startsWith(href)
	}

	return (
		<nav
			className='hidden border-r border-border-subtle bg-bg-card px-3 py-6 md:flex md:w-nav md:flex-col md:items-center md:gap-4'
			aria-label='Main navigation'
		>
			{navItems.map(item => {
				const href = getHref(item)
				const active = isActive(item)
				const Icon = item.icon
				return (
					<Link
						key={item.label}
						href={href}
						className='group relative flex h-11 w-full flex-col items-center justify-center gap-1 rounded-radius px-1.5 text-xs font-semibold uppercase leading-tight tracking-[0.6px] text-text-secondary transition-colors duration-300 hover:text-text-primary data-[active=true]:text-primary'
						data-active={active}
						title={item.label}
					>
						{/* Active indicator bar */}
						<motion.div
							className='absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-r-sm bg-gradient-primary'
							initial={false}
							animate={{
								height: active ? '70%' : '0%',
							}}
							transition={TRANSITION_SPRING}
						/>{' '}
						{/* Background glow on active */}
						<motion.div
							className='absolute inset-0 rounded-radius bg-gradient-to-r from-primary/10 to-transparent opacity-0'
							initial={false}
							animate={{
								opacity: active ? 1 : 0,
							}}
							transition={{
								duration: 0.3,
							}}
						/>
						{/* Icon with hover animation */}
						<motion.div
							whileHover={{
								...ICON_BUTTON_HOVER,
								scale: 1.15,
								rotate: 5,
							}}
							whileTap={ICON_BUTTON_TAP}
							transition={TRANSITION_SPRING}
							className='relative'
						>
							<Icon className='size-6 transition-all duration-300 group-data-[active=true]:drop-shadow-glow' />
							{/* Unread badge for notifications */}
							{item.showBadge && unreadCount > 0 && (
								<span className='absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white'>
									{unreadCount > 9 ? '9+' : unreadCount}
								</span>
							)}
						</motion.div>
						<div>{item.label}</div>
					</Link>
				)
			})}
		</nav>
	)
}
```

## `chefkix-fe\src\components\layout\Topbar.tsx`

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PATHS } from '@/constants'
import {
	Bell,
	MessageCircle,
	Search,
	LogOut,
	Settings,
	ChefHat,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUiStore } from '@/store/uiStore'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { logout as logoutService } from '@/services/auth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getNotifications } from '@/services/notification'
import { getMyConversations } from '@/services/chat'
import { CookingIndicator } from '@/components/cooking/CookingIndicator'
import { TRANSITION_SPRING } from '@/lib/motion'
import { Portal } from '@/components/ui/portal'

export const Topbar = () => {
	const { user } = useAuth()
	const { toggleMessagesDrawer, toggleNotificationsPopup } = useUiStore()
	const [searchQuery, setSearchQuery] = useState('')
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [unreadNotifications, setUnreadNotifications] = useState(0)
	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
	const avatarButtonRef = useRef<HTMLButtonElement>(null)
	const [unreadMessages, setUnreadMessages] = useState(0)
	const router = useRouter()
	const { logout } = useAuth()

	// Fetch unread counts on mount and periodically
	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const [notifResponse, convResponse] = await Promise.all([
					getNotifications({ size: 1 }), // Just need unreadCount
					getMyConversations(),
				])

				if (notifResponse.success && notifResponse.data) {
					setUnreadNotifications(notifResponse.data.unreadCount)
				}

				if (convResponse.success && convResponse.data) {
					// Sum up unread counts from all conversations
					const totalUnread = convResponse.data.reduce(
						(sum, conv) => sum + (conv.unreadCount || 0),
						0,
					)
					setUnreadMessages(totalUnread)
				}
			} catch (err) {
				console.error('Failed to fetch unread counts:', err)
			}
		}

		fetchCounts()
		// Refresh every 30 seconds
		const interval = setInterval(fetchCounts, 30000)
		return () => clearInterval(interval)
	}, [])

	const handleLogout = async () => {
		try {
			// Call backend logout to invalidate session/cookies
			await logoutService()
		} catch (error) {
			console.error('Logout error:', error)
			// Continue with local logout even if backend call fails
		} finally {
			// Always clear local state and redirect
			logout()
			router.push(PATHS.AUTH.SIGN_IN)
		}
	}

	// Calculate XP progress if we have user statistics - with null safety
	const xpProgress =
		user?.statistics?.currentXP != null && user?.statistics?.currentXPGoal
			? (user.statistics.currentXP / user.statistics.currentXPGoal) * 100
			: 0

	return (
		<header
			className='relative flex h-18 w-full flex-shrink-0 items-center justify-center gap-2 border-b border-border-subtle bg-bg-card px-4 md:gap-4 md:px-6'
			role='banner'
		>
			{/* Animated Logo */}
			<Link
				href='/dashboard'
				className='absolute left-4 flex items-center gap-2 md:left-6'
			>
				<motion.div
					className='flex items-center gap-2.5'
					whileHover={{ scale: 1.03 }}
					transition={TRANSITION_SPRING}
				>
					<motion.div
						className='flex size-9 items-center justify-center rounded-xl bg-gradient-hero shadow-md shadow-brand/25'
						whileHover={{ rotate: 10 }}
						transition={TRANSITION_SPRING}
					>
						<ChefHat className='size-5 text-white' />
					</motion.div>
					<div className='font-display text-2xl font-extrabold leading-none tracking-tight'>
						<span className='bg-gradient-to-r from-brand to-brand/80 bg-clip-text text-transparent'>
							Chef
						</span>
						<span className='text-text'>kix</span>
					</div>
				</motion.div>
			</Link>
			{/* Search Bar - constrained max width, with left margin to avoid overlapping the absolute logo */}
			<div className='group relative ml-20 flex min-w-0 max-w-2xl flex-1 items-center gap-3 rounded-full border-2 border-border-medium bg-bg-input px-3 py-2 shadow-sm transition-all duration-300 focus-within:border-primary focus-within:shadow-lg focus-within:scale-[1.02] md:ml-24 md:px-4 md:py-2.5'>
				<Search className='h-5 w-5 shrink-0 text-text-secondary transition-all duration-300 group-focus-within:scale-110 group-focus-within:rotate-12 group-focus-within:text-primary' />
				<input
					type='text'
					placeholder='Search...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full min-w-0 border-0 bg-transparent text-sm text-text-primary caret-primary outline-none ring-0 placeholder:text-text-muted focus:border-0 focus:ring-0 md:text-base'
				/>
			</div>

			{/* 
				Mode Toggle REMOVED (Steve Jobs Audit 2024-12-20)
				
				The player/creator toggle was purely cosmetic - local state that 
				affected nothing. "A switch that switches nothing is a lie."
				
				If ChefKix needs player vs creator modes in the future, implement
				it properly with different dashboard views and stored preference.
			*/}

			{/* Cooking Indicator - Shows when actively cooking */}
			<CookingIndicator />

			{/* User Profile - Hidden on mobile, shows level badge only on larger screens */}
			{user && (
				<div className='hidden items-center gap-2 md:flex lg:gap-3'>
					{/* Level Badge with XP - only show on larger screens */}
					<motion.div
						whileHover={{ scale: 1.05 }}
						className='relative hidden overflow-hidden rounded-xl bg-gradient-gold px-4 py-2 text-sm font-bold text-amber-950 shadow-md lg:flex lg:items-center lg:gap-2'
					>
						<span className='relative z-10'>
							Lv. {user.statistics?.currentLevel || 1}
						</span>
						{/* XP Progress bar inside */}
						<div className='relative z-10 hidden h-1.5 w-16 overflow-hidden rounded-full bg-amber-950/20 xl:block'>
							<motion.div
								className='h-full rounded-full bg-amber-950/40'
								initial={{ width: 0 }}
								animate={{ width: `${xpProgress}%` }}
								transition={{ duration: 1, ease: 'easeOut' }}
							/>
						</div>
						<div className='pointer-events-none absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent' />
					</motion.div>

					{/* Avatar with XP Ring */}
					<div className='relative'>
						<motion.button
							ref={avatarButtonRef}
							onClick={() => {
								if (!showUserMenu && avatarButtonRef.current) {
									const rect = avatarButtonRef.current.getBoundingClientRect()
									setMenuPosition({
										top: rect.bottom + 8,
										right: window.innerWidth - rect.right,
									})
								}
								setShowUserMenu(!showUserMenu)
							}}
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.98 }}
							transition={TRANSITION_SPRING}
							className='group relative cursor-pointer'
						>
							{/* XP Progress Ring */}
							<svg className='absolute -inset-1 size-14' viewBox='0 0 56 56'>
								<circle
									cx='28'
									cy='28'
									r='26'
									fill='none'
									stroke='currentColor'
									strokeWidth='3'
									className='text-border-subtle'
								/>
								<motion.circle
									cx='28'
									cy='28'
									r='26'
									fill='none'
									stroke='url(#xpGradient)'
									strokeWidth='3'
									strokeLinecap='round'
									strokeDasharray={`${2 * Math.PI * 26}`}
									initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
									animate={{
										strokeDashoffset: 2 * Math.PI * 26 * (1 - xpProgress / 100),
									}}
									transition={{ duration: 1.5, ease: 'easeOut' }}
									style={{
										transform: 'rotate(-90deg)',
										transformOrigin: 'center',
									}}
								/>
								<defs>
									<linearGradient
										id='xpGradient'
										x1='0%'
										y1='0%'
										x2='100%'
										y2='100%'
									>
										<stop offset='0%' stopColor='#8b5cf6' />
										<stop offset='100%' stopColor='#a855f7' />
									</linearGradient>
								</defs>
							</svg>
							<Avatar size='lg' className='shadow-lg'>
								<AvatarImage
									src={user.avatarUrl || '/placeholder-avatar.png'}
									alt={user.displayName || 'User'}
								/>
								<AvatarFallback>
									{user.displayName
										?.split(' ')
										.map(n => n[0])
										.join('')
										.toUpperCase()
										.slice(0, 2) || 'U'}
								</AvatarFallback>
							</Avatar>
						</motion.button>

						{/* Dropdown Menu - Portaled to escape overflow:hidden clipping */}
						{showUserMenu && (
							<Portal>
								{/* Click outside to close */}
								<div
									className='fixed inset-0 z-dropdown'
									onClick={() => setShowUserMenu(false)}
								/>
								<div
									className='fixed z-dropdown w-48 overflow-hidden rounded-lg border border-border-subtle bg-bg-card shadow-lg animate-in fade-in-0 zoom-in-95'
									style={{
										top: `${menuPosition.top}px`,
										right: `${menuPosition.right}px`,
									}}
								>
									<Link
										href={PATHS.SETTINGS}
										onClick={() => setShowUserMenu(false)}
										className='flex h-11 items-center gap-3 rounded-t-lg px-4 text-sm text-text-primary transition-colors hover:bg-bg-hover'
									>
										<Settings className='size-4' />
										<span>Settings</span>
									</Link>
									<button
										onClick={handleLogout}
										className='flex h-11 w-full items-center gap-3 rounded-b-lg px-4 text-left text-sm text-destructive transition-colors hover:bg-destructive/10'
									>
										<LogOut className='size-4' />
										<span>Sign Out</span>
									</button>
								</div>
							</Portal>
						)}
					</div>
				</div>
			)}
			{/* Communication Icons */}
			<div className='flex gap-2 md:gap-3'>
				<motion.button
					onClick={toggleNotificationsPopup}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					className='relative grid size-11 cursor-pointer place-items-center rounded-xl text-text-secondary transition-colors hover:bg-bg-elevated hover:text-brand'
					aria-label='Notifications'
				>
					<Bell className='size-5' />
					{unreadNotifications > 0 && (
						<motion.span
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={TRANSITION_SPRING}
							className='absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-brand px-1.5 py-0.5 text-xs font-bold text-white shadow-sm'
						>
							{unreadNotifications > 99 ? '99+' : unreadNotifications}
						</motion.span>
					)}
				</motion.button>
				<motion.button
					onClick={toggleMessagesDrawer}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					className='relative grid size-11 cursor-pointer place-items-center rounded-xl text-text-secondary transition-colors hover:bg-bg-elevated hover:text-xp'
					aria-label='Messages'
				>
					<MessageCircle className='size-5' />
					{unreadMessages > 0 && (
						<motion.span
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={TRANSITION_SPRING}
							className='absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-xp px-1.5 py-0.5 text-xs font-bold text-white shadow-sm'
						>
							{unreadMessages > 99 ? '99+' : unreadMessages}
						</motion.span>
					)}
				</motion.button>
			</div>
		</header>
	)
}
```

## `chefkix-fe\src\components\layout\RightSidebar.tsx`

```tsx
'use client'

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { StreakWidget } from '@/components/streak'
import { ExpandableDailyChallengeBanner } from '@/components/challenges'
import { useRouter } from 'next/navigation'
import { getTodaysChallenge } from '@/services/challenge'
import { getAllProfiles } from '@/services/profile'
import { getSessionHistory } from '@/services/cookingSession'
import { Profile } from '@/lib/types'

// ============================================
// HELPER: Compute week progress from cooking session history
// ============================================

type DayStatus = 'cooked' | 'today' | 'future'

function computeWeekProgress(
	cookDates: Date[],
	lastCookDate?: string,
): { weekProgress: DayStatus[]; isActiveToday: boolean } {
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	// Get start of week (Monday)
	const dayOfWeek = today.getDay()
	const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
	const monday = new Date(today)
	monday.setDate(today.getDate() + mondayOffset)

	// Create set of cooked dates (as date strings for comparison)
	const cookedDateSet = new Set(
		cookDates.map(d => {
			const normalized = new Date(d)
			normalized.setHours(0, 0, 0, 0)
			return normalized.toDateString()
		}),
	)

	// Check if last cook was today
	const isActiveToday = lastCookDate
		? new Date(lastCookDate).toDateString() === today.toDateString()
		: cookedDateSet.has(today.toDateString())

	// Build week progress array (Mon-Sun)
	const weekProgress: DayStatus[] = []
	for (let i = 0; i < 7; i++) {
		const date = new Date(monday)
		date.setDate(monday.getDate() + i)
		date.setHours(0, 0, 0, 0)

		if (date.toDateString() === today.toDateString()) {
			weekProgress.push('today')
		} else if (date > today) {
			weekProgress.push('future')
		} else if (cookedDateSet.has(date.toDateString())) {
			weekProgress.push('cooked')
		} else {
			weekProgress.push('future') // Missed days show as future (no special state)
		}
	}

	return { weekProgress, isActiveToday }
}

// ============================================
// COMPONENT
// ============================================

export const RightSidebar = () => {
	const { user } = useAuth()
	const router = useRouter()
	const [followedIds, setFollowedIds] = useState<string[]>([])
	const [suggestions, setSuggestions] = useState<Profile[]>([])
	const [cookDates, setCookDates] = useState<Date[]>([])
	const [dailyChallenge, setDailyChallenge] = useState<{
		id: string
		title: string
		description: string
		icon: string
		bonusXp: number
		endsAt: Date
	} | null>(null)

	useEffect(() => {
		// Don't fetch until user is authenticated
		if (!user) return

		const fetchData = async () => {
			try {
				// Fetch daily challenge, profile suggestions, and session history in parallel
				const [challengeResponse, profilesResponse, sessionResponse] =
					await Promise.all([
						getTodaysChallenge(),
						getAllProfiles(),
						getSessionHistory({ status: 'all', size: 100 }),
					])

				if (challengeResponse.success && challengeResponse.data) {
					const data = challengeResponse.data
					setDailyChallenge({
						id: data.id,
						title: data.title,
						description: data.description,
						icon: data.icon,
						bonusXp: data.bonusXp,
						endsAt: new Date(data.endsAt),
					})
				}

				if (profilesResponse.success && profilesResponse.data) {
					// Filter out current user and limit to 5 suggestions
					const filtered = profilesResponse.data
						.filter(p => p.userId !== user?.userId)
						.slice(0, 5)
					setSuggestions(filtered)
				}

				// Extract completed session dates for streak calculation
				if (sessionResponse.success && sessionResponse.data?.sessions) {
					const completedDates = sessionResponse.data.sessions
						.filter(s => s.status === 'completed' || s.status === 'posted')
						.map(s => new Date(s.completedAt || s.startedAt))
					setCookDates(completedDates)
				}
			} catch (err) {
				console.error('Failed to fetch sidebar data:', err)
			}
		}

		fetchData()
	}, [user]) // Re-fetch when user changes (login/logout)

	const handleFollow = (userId: string) => {
		setFollowedIds(prev =>
			prev.includes(userId)
				? prev.filter(id => id !== userId)
				: [...prev, userId],
		)
	}

	// Compute streak data from user stats + cooking session history
	const streakData = useMemo(() => {
		const { weekProgress, isActiveToday } = computeWeekProgress(
			cookDates,
			user?.lastCookDate,
		)
		const currentStreak = user?.statistics?.streakCount ?? 0

		// Determine streak status (must match StreakWidget props: 'active' | 'at-risk')
		let status: 'active' | 'at-risk' = 'active'
		if (currentStreak > 0 && !isActiveToday) {
			status = 'at-risk' // Has streak but hasn't cooked today
		}

		return {
			currentStreak,
			weekProgress,
			isActiveToday,
			status,
		}
	}, [cookDates, user?.statistics?.streakCount, user?.lastCookDate])

	return (
		<aside className='hidden w-right flex-shrink-0 overflow-y-auto border-l border-border-subtle bg-bg-card p-4 xl:flex xl:flex-col xl:gap-4'>
			{/* 
				FriendsCookingWidget REMOVED (Steve Jobs Audit 2024-12-20)
				
				The widget displayed "Coming Soon" — advertising a feature that
				doesn't exist. WebSocket real-time cooking status is a P2 feature.
				When implemented, add back: <FriendsCookingWidget />
			*/}

			{/* Streak Widget */}
			<StreakWidget
				currentStreak={streakData.currentStreak}
				weekProgress={streakData.weekProgress}
				isActiveToday={streakData.isActiveToday}
				status={streakData.status}
			/>

			{/* Daily Challenge Banner (Expandable) */}
			{dailyChallenge && (
				<ExpandableDailyChallengeBanner
					challenge={dailyChallenge}
					onFindRecipe={() => router.push('/explore?challenge=pasta')}
				/>
			)}

			{/* Trending Creators Card */}
			{suggestions.length > 0 && (
				<div className='rounded-radius border border-border-subtle bg-bg-card p-4 shadow-lg backdrop-blur-sm backdrop-saturate'>
					<div className='mb-4 text-sm font-bold uppercase leading-tight tracking-wide text-text-primary'>
						Trending Creators
					</div>
					<div className='flex flex-col gap-3'>
						{suggestions.map(suggestion => {
							const isFollowed = followedIds.includes(suggestion.userId)
							return (
								<div
									key={suggestion.userId}
									className='flex items-center gap-3'
								>
									<div className='relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg'>
										<Image
											src={suggestion.avatarUrl || '/placeholder-avatar.png'}
											alt={suggestion.displayName || suggestion.username}
											fill
											sizes='40px'
											className='object-cover'
										/>
									</div>
									<div className='min-w-0 flex-1'>
										<strong className='block text-sm leading-tight text-text-primary'>
											{suggestion.displayName || suggestion.username}
										</strong>
										<span className='block overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-normal text-text-secondary'>
											@{suggestion.username}
										</span>
									</div>
									<button
										onClick={() => handleFollow(suggestion.userId)}
										className='relative h-9 overflow-hidden rounded-lg border-none bg-gradient-primary px-3 text-xs font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]'
									>
										{isFollowed ? 'Following' : 'Follow'}
									</button>
								</div>
							)
						})}
					</div>
				</div>
			)}
		</aside>
	)
}
```

## `chefkix-fe\src\components\layout\MobileBottomNav.tsx`

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	TRANSITION_SPRING,
	ICON_BUTTON_HOVER,
	ICON_BUTTON_TAP,
} from '@/lib/motion'
import { useNotificationStore } from '@/store/notificationStore'

interface NavItem {
	href: string
	icon: React.ComponentType<{ className?: string }>
	label: string
	badge?: boolean
	isCreate?: boolean
}

/**
 * MobileBottomNav - 5 core items for quick access
 *
 * DESIGN DECISION: Mobile nav has 5 items (iOS/Android standard).
 * Missing items (Challenges, Community, Messages, Settings) are accessible via:
 * - Hamburger menu (to be added) OR
 * - Topbar icons (Messages, Notifications)
 * - Settings via Profile page
 *
 * Icon: PlusSquare (matches LeftSidebar, not bare Plus)
 */
const navItems: NavItem[] = [
	{
		href: '/dashboard',
		icon: Home,
		label: 'Home',
	},
	{
		href: '/explore',
		icon: Compass,
		label: 'Explore',
	},
	{
		href: '/create',
		icon: PlusSquare,
		label: 'Create',
		isCreate: true,
	},
	{
		href: '/notifications',
		icon: Bell,
		label: 'Activity',
		badge: true,
	},
	{
		href: '/profile',
		icon: User,
		label: 'Profile',
	},
]

export const MobileBottomNav = () => {
	const pathname = usePathname()
	const { unreadCount } = useNotificationStore()

	const isActive = (href: string) => {
		if (href === '/dashboard') return pathname === '/dashboard'
		return pathname?.startsWith(href)
	}

	return (
		<nav
			className='fixed bottom-0 left-0 right-0 z-sticky flex h-18 items-center justify-around border-t border-border-subtle bg-bg-card/95 px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden'
			aria-label='Mobile navigation'
		>
			{navItems.map(item => {
				const Icon = item.icon
				const active = isActive(item.href)

				// Special handling for the Create button (center elevated button)
				if (item.isCreate) {
					return (
						<Link
							key={item.href}
							href={item.href}
							className='relative -mt-6 flex flex-1 max-w-20 flex-col items-center justify-center gap-1'
						>
							<motion.div
								whileHover={ICON_BUTTON_HOVER}
								whileTap={ICON_BUTTON_TAP}
								transition={TRANSITION_SPRING}
								className='grid size-14 place-items-center rounded-full bg-gradient-primary text-white shadow-lg shadow-brand/30'
							>
								<Icon className='size-7' />
							</motion.div>
						</Link>
					)
				}

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							'group relative flex flex-1 max-w-20 flex-col items-center justify-center gap-1 rounded-radius px-3 py-2',
							active ? 'text-primary' : 'text-text-secondary',
						)}
					>
						{/* Active indicator dot */}
						<motion.div
							className='absolute -top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary'
							initial={false}
							animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
							transition={TRANSITION_SPRING}
						/>

						<motion.div
							className='relative'
							whileHover={ICON_BUTTON_HOVER}
							whileTap={ICON_BUTTON_TAP}
							transition={TRANSITION_SPRING}
						>
							<Icon
								className={cn(
									'size-6 transition-all duration-300',
									active && 'drop-shadow-glow',
								)}
							/>
							{item.badge && unreadCount > 0 && (
								<motion.span
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className='absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white'
								>
									{unreadCount > 9 ? '9+' : unreadCount}
								</motion.span>
							)}
						</motion.div>
						<span className='text-xs font-semibold'>{item.label}</span>
					</Link>
				)
			})}
		</nav>
	)
}

// ============================================================================
// Mobile Tab Bar Component (for category switching within pages)
// ============================================================================

interface TabItem {
	id: string
	icon: React.ComponentType<{ className?: string }>
	label: string
}

interface MobileTabBarProps {
	tabs: TabItem[]
	activeTab: string
	onTabChange: (tabId: string) => void
	className?: string
}

export const MobileTabBar = ({
	tabs,
	activeTab,
	onTabChange,
	className,
}: MobileTabBarProps) => {
	return (
		<div
			className={cn(
				'sticky top-mobile-header z-sticky flex flex-nowrap gap-2 overflow-x-auto border-b border-border-subtle bg-bg-card/95 p-2 backdrop-blur-xl scrollbar-hide md:hidden',
				className,
			)}
		>
			{tabs.map(tab => {
				const Icon = tab.icon
				return (
					<motion.button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						whileTap={{ scale: 0.95 }}
						transition={TRANSITION_SPRING}
						className={cn(
							'flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors',
							activeTab === tab.id
								? 'bg-primary text-white'
								: 'text-text-secondary hover:bg-bg-elevated',
						)}
					>
						<Icon className='size-4' />
						<span>{tab.label}</span>
					</motion.button>
				)
			})}
		</div>
	)
}
```

## `chefkix-fe\src\components\layout\PageContainer.tsx`

```tsx
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageContainerProps {
	children: ReactNode
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
	className?: string
}

const maxWidthClasses = {
	sm: 'max-w-container-sm',
	md: 'max-w-container-md',
	lg: 'max-w-container-lg',
	xl: 'max-w-container-xl',
	'2xl': 'max-w-7xl',
	full: 'max-w-full',
}

export const PageContainer = ({
	children,
	maxWidth = 'lg', // Default to 850px social-media-style center
	className,
}: PageContainerProps) => {
	return (
		<div className={cn('mx-auto w-full', maxWidthClasses[maxWidth], className)}>
			{children}
		</div>
	)
}
```

## `chefkix-fe\src\components\layout\PageTransition.tsx`

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PAGE_VARIANTS, DURATIONS, EASINGS } from '@/lib/motion'
import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
	children: React.ReactNode
	className?: string
}

export const PageTransition = ({
	children,
	className,
}: PageTransitionProps) => {
	const pathname = usePathname()
	const prefersReducedMotion = useReducedMotion()
	const isFirstMount = useRef(true)

	// Track first mount to skip initial animation
	useEffect(() => {
		isFirstMount.current = false
	}, [])

	const variants = prefersReducedMotion
		? {
				// No animation for reduced motion users
				initial: {},
				animate: {},
				exit: {},
			}
		: isFirstMount.current
			? {
					// No animation on first mount - content should appear immediately
					initial: { opacity: 1, y: 0 },
					animate: { opacity: 1, y: 0 },
					exit: { opacity: 0, y: -10 },
				}
			: PAGE_VARIANTS

	return (
		<AnimatePresence mode='wait'>
			<motion.div
				key={pathname}
				className={cn(className)}
				initial={variants.initial}
				animate={variants.animate}
				exit={variants.exit}
				transition={{
					duration: DURATIONS.smooth / 1000,
					ease: EASINGS.smooth,
					opacity: { duration: DURATIONS.fast / 1000 },
				}}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}
```

## `chefkix-fe\src\components\layout\MessagesDrawer.tsx`

```tsx
'use client'

import { Send, X, Search, Loader2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { useUiStore } from '@/store/uiStore'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
	getMyConversations,
	getMessages,
	sendMessage,
	Conversation,
	ChatMessage,
} from '@/services/chat'
import Image from 'next/image'
import Link from 'next/link'
import { PATHS } from '@/constants/paths'

export const MessagesDrawer = () => {
	const { user } = useAuth()
	const { isMessagesDrawerOpen, toggleMessagesDrawer } = useUiStore()
	const [width, setWidth] = useState<number | null>(null) // Start null, use CSS variable
	const [height, setHeight] = useState<number | null>(null)
	const [isResizing, setIsResizing] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const drawerRef = useRef<HTMLDivElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Chat state
	const [conversations, setConversations] = useState<Conversation[]>([])
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null)
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [newMessage, setNewMessage] = useState('')
	const [isLoadingConversations, setIsLoadingConversations] = useState(false)
	const [isLoadingMessages, setIsLoadingMessages] = useState(false)
	const [isSending, setIsSending] = useState(false)

	// Fetch conversations when drawer opens
	useEffect(() => {
		if (!isMessagesDrawerOpen) return

		const fetchConversations = async () => {
			setIsLoadingConversations(true)
			try {
				const response = await getMyConversations()
				if (response.success && response.data) {
					setConversations(response.data)
				}
			} catch (err) {
				console.error('Failed to fetch conversations:', err)
			} finally {
				setIsLoadingConversations(false)
			}
		}

		fetchConversations()
	}, [isMessagesDrawerOpen])

	// Fetch messages when conversation is selected
	const selectedConversationId = selectedConversation?.id
	useEffect(() => {
		if (!selectedConversationId) {
			setMessages([])
			return
		}

		const fetchMessages = async () => {
			setIsLoadingMessages(true)
			try {
				const response = await getMessages(selectedConversationId)
				if (response.success && response.data) {
					setMessages(response.data)
				}
			} catch (err) {
				console.error('Failed to fetch messages:', err)
			} finally {
				setIsLoadingMessages(false)
			}
		}

		fetchMessages()
	}, [selectedConversationId])

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// Handle resize
	useEffect(() => {
		if (!isResizing) return

		const handleMouseMove = (e: MouseEvent) => {
			if (!drawerRef.current) return
			const rect = drawerRef.current.getBoundingClientRect()

			// Calculate new width (from right edge)
			const newWidth = window.innerWidth - e.clientX - 20 // 20px = right margin
			// Calculate new height (from bottom edge)
			const newHeight = window.innerHeight - e.clientY

			if (newWidth > 300 && newWidth < 800) {
				setWidth(newWidth)
			}
			if (newHeight > 300 && newHeight < 800) {
				setHeight(newHeight)
			}
		}

		const handleMouseUp = () => {
			setIsResizing(false)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isResizing])

	// Helper functions
	const getConversationName = useCallback(
		(conv: Conversation) => {
			if (conv.conversationName) return conv.conversationName
			const otherParticipant = conv.participants.find(
				p => p.userId !== user?.userId,
			)
			return otherParticipant
				? `${otherParticipant.firstName} ${otherParticipant.lastName}`.trim() ||
						otherParticipant.username
				: 'Unknown'
		},
		[user?.userId],
	)

	const getConversationAvatar = useCallback(
		(conv: Conversation) => {
			if (conv.conversationAvatar) return conv.conversationAvatar
			const otherParticipant = conv.participants.find(
				p => p.userId !== user?.userId,
			)
			return otherParticipant?.avatar || '/placeholder-avatar.png'
		},
		[user?.userId],
	)

	const handleSendMessage = async () => {
		if (!newMessage.trim() || !selectedConversation || isSending) return

		setIsSending(true)
		try {
			const response = await sendMessage({
				conversationId: selectedConversation.id,
				message: newMessage.trim(),
			})

			if (response.success && response.data) {
				setMessages(prev => [...prev, response.data!])
				setNewMessage('')
			}
		} catch (err) {
			console.error('Failed to send message:', err)
		} finally {
			setIsSending(false)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	const filteredConversations = conversations.filter(conv =>
		getConversationName(conv).toLowerCase().includes(searchTerm.toLowerCase()),
	)

	if (!isMessagesDrawerOpen) return null

	return (
		<div
			ref={drawerRef}
			className='fixed bottom-0 right-6 z-popover flex w-drawer h-drawer flex-col rounded-t-lg border bg-card text-card-foreground shadow-lg'
			style={
				width || height
					? {
							width: width ? `${width}px` : undefined,
							height: height ? `${height}px` : undefined,
						}
					: undefined
			}
		>
			{/* Resize handle */}
			<div
				onMouseDown={() => setIsResizing(true)}
				className='absolute left-0 top-0 flex h-full w-2 cursor-ew-resize items-center justify-center hover:bg-primary/10'
			>
				<div className='h-12 w-1 rounded-full bg-border' />
			</div>
			<div
				onMouseDown={() => setIsResizing(true)}
				className='absolute left-0 top-0 flex h-2 w-full cursor-ns-resize items-center justify-center hover:bg-primary/10'
			>
				<div className='h-1 w-12 rounded-full bg-border' />
			</div>

			<div className='flex items-center justify-between border-b p-3'>
				<h3 className='font-semibold'>Messages</h3>
				<Button variant='ghost' size='icon' onClick={toggleMessagesDrawer}>
					<X className='h-4 w-4' />
				</Button>
			</div>

			{/* Search conversations */}
			<div className='border-b p-3'>
				<InputGroup>
					<InputGroupAddon align='inline-start'>
						<Search className='h-4 w-4 text-text-muted' />
					</InputGroupAddon>
					<InputGroupInput
						placeholder='Search conversations...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</InputGroup>
			</div>

			<div className='flex-1 overflow-y-auto'>
				{selectedConversation ? (
					// Chat view
					<div className='flex h-full flex-col'>
						{/* Chat header */}
						<div className='flex items-center gap-2 border-b p-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setSelectedConversation(null)}
								className='h-7 px-2 text-xs'
							>
								← Back
							</Button>
							<div className='relative h-6 w-6 overflow-hidden rounded-full'>
								<Image
									src={getConversationAvatar(selectedConversation)}
									alt={getConversationName(selectedConversation)}
									fill
									sizes='24px'
									className='object-cover'
								/>
							</div>
							<span className='text-sm font-medium'>
								{getConversationName(selectedConversation)}
							</span>
						</div>
						{/* Messages */}
						<div className='flex-1 overflow-y-auto p-3'>
							{isLoadingMessages ? (
								<div className='flex h-full items-center justify-center'>
									<Loader2 className='size-5 animate-spin text-muted-foreground' />
								</div>
							) : messages.length === 0 ? (
								<div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
									No messages yet
								</div>
							) : (
								<div className='flex flex-col gap-2'>
									{messages.map(message => (
										<div
											key={message.id}
											className={`flex items-end ${message.me ? 'justify-end' : 'justify-start'}`}
										>
											<div
												className={`max-w-[70%] rounded-lg p-2 ${
													message.me
														? 'rounded-br-none bg-primary text-primary-foreground'
														: 'rounded-bl-none bg-muted'
												}`}
											>
												<p className='text-sm'>{message.message}</p>
											</div>
										</div>
									))}
									<div ref={messagesEndRef} />
								</div>
							)}
						</div>
					</div>
				) : (
					// Conversations list
					<div className='p-2'>
						{isLoadingConversations ? (
							<div className='flex items-center justify-center py-8'>
								<Loader2 className='size-5 animate-spin text-muted-foreground' />
							</div>
						) : filteredConversations.length === 0 ? (
							<div className='flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground'>
								<MessageSquare className='h-8 w-8' />
								<p className='text-sm'>
									{searchTerm
										? 'No conversations found'
										: 'No conversations yet'}
								</p>
								<Link
									href={PATHS.COMMUNITY}
									onClick={toggleMessagesDrawer}
									className='text-xs text-primary hover:underline'
								>
									Find people to chat with
								</Link>
							</div>
						) : (
							<div className='flex flex-col gap-1'>
								{filteredConversations.map(conv => (
									<button
										key={conv.id}
										onClick={() => setSelectedConversation(conv)}
										className='flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-muted'
									>
										<div className='relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full'>
											<Image
												src={getConversationAvatar(conv)}
												alt={getConversationName(conv)}
												fill
												sizes='36px'
												className='object-cover'
											/>
										</div>
										<div className='min-w-0 flex-1'>
											<p className='truncate text-sm font-medium'>
												{getConversationName(conv)}
											</p>
											{conv.lastMessage && (
												<p className='truncate text-xs text-muted-foreground'>
													{conv.lastMessage.message}
												</p>
											)}
										</div>
										{conv.unreadCount && conv.unreadCount > 0 && (
											<span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
												{conv.unreadCount}
											</span>
										)}
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</div>
			<div className='flex items-center gap-2 border-t p-3'>
				{selectedConversation ? (
					<>
						<InputGroup className='flex-1'>
							<InputGroupInput
								placeholder='Type a message...'
								value={newMessage}
								onChange={e => setNewMessage(e.target.value)}
								onKeyDown={handleKeyPress}
								disabled={isSending}
							/>
						</InputGroup>
						<Button
							size='icon'
							onClick={handleSendMessage}
							disabled={!newMessage.trim() || isSending}
						>
							{isSending ? (
								<Loader2 className='size-4 animate-spin' />
							) : (
								<Send className='h-4 w-4' />
							)}
						</Button>
					</>
				) : (
					<Link
						href={PATHS.MESSAGES}
						onClick={toggleMessagesDrawer}
						className='flex w-full items-center justify-center gap-2 rounded-lg bg-muted py-2 text-sm font-medium transition-colors hover:bg-muted/80'
					>
						<MessageSquare className='h-4 w-4' />
						Open Full Messages
					</Link>
				)}
			</div>
		</div>
	)
}
```

## `chefkix-fe\src\components\layout\NotificationsPopup.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUiStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import {
	Heart,
	MessageCircle,
	UserPlus,
	ChefHat,
	X,
	CheckCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { UserHoverCard } from '@/components/social/UserHoverCard'
import {
	NotificationItemGamified,
	type GamifiedNotification,
} from '@/components/notifications/NotificationItemsGamified'
import {
	getNotifications,
	markAllNotificationsRead,
	type Notification as APINotification,
} from '@/services/notification'
import { toggleFollow } from '@/services/social'
import { toast } from '@/components/ui/toaster'

type NotificationType = 'like' | 'comment' | 'follow' | 'cook' | 'achievement'

interface SocialNotification {
	id: number
	notificationId: string // For marking as read
	type: NotificationType
	userId: string
	user: string
	avatar: string
	action: string
	target?: string
	targetEntityId?: string // Post ID for likes/comments, User ID for follows
	time: string
	read: boolean
}

// Helper to transform API notification to gamified notification format
// Uses BE NotificationType enum values (SCREAMING_SNAKE_CASE)
const transformToGamifiedNotification = (
	notif: APINotification,
): GamifiedNotification | null => {
	const data = (notif.data ?? {}) as Record<string, unknown>
	const timestamp = new Date(notif.createdAt)

	switch (notif.type) {
		case 'XP_AWARDED':
			return {
				id: notif.id,
				type: 'xp_awarded',
				recipeName: (data.recipeName as string) || 'Recipe',
				xpAmount: (data.xpAmount as number) || 0,
				pendingXp: (data.pendingXp as number) || 0,
				timestamp,
				isRead: notif.isRead,
			}
		case 'LEVEL_UP':
			return {
				id: notif.id,
				type: 'level_up',
				newLevel: (data.newLevel as number) || 1,
				newGoalXp: (data.newGoalXp as number) || 1000,
				recipesToNextLevel: (data.recipesToNextLevel as number) || 5,
				timestamp,
				isRead: notif.isRead,
			}
		case 'BADGE_EARNED':
			return {
				id: notif.id,
				type: 'badge_unlocked',
				badgeIcon: (data.badgeIcon as string) || '🏆',
				badgeName: (data.badgeName as string) || 'Badge',
				badgeRarity:
					(data.badgeRarity as 'common' | 'rare' | 'epic' | 'legendary') ||
					'common',
				requirement: (data.requirement as string) || '',
				timestamp,
				isRead: notif.isRead,
			}
		case 'CREATOR_BONUS':
			return {
				id: notif.id,
				type: 'creator_bonus',
				cookerName: (data.cookerName as string) || 'User',
				cookerUsername: (data.cookerUsername as string) || 'user',
				cookerAvatarUrl:
					(data.cookerAvatarUrl as string) || '/placeholder-avatar.png',
				recipeName: (data.recipeName as string) || 'Recipe',
				xpBonus: (data.xpBonus as number) || 0,
				totalCookRewards: (data.totalCookRewards as number) || 1,
				timestamp,
				isRead: notif.isRead,
			}
		default:
			return null
	}
}

// Helper to format time ago
const formatTimeAgo = (date: Date): string => {
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffMins = Math.floor(diffMs / 60000)
	const diffHours = Math.floor(diffMs / 3600000)
	const diffDays = Math.floor(diffMs / 86400000)

	if (diffMins < 1) return 'Just now'
	if (diffMins < 60) return `${diffMins} min ago`
	if (diffHours < 24) return `${diffHours}h ago`
	if (diffDays === 1) return 'Yesterday'
	return `${diffDays}d ago`
}

// Helper to transform API notification to social notification format
// Uses BE NotificationType enum values (SCREAMING_SNAKE_CASE)
// BE sends: latestActorId, latestActorName, actorInfo (NOT nested in data)
const transformToSocialNotification = (
	notif: APINotification,
	index: number,
): SocialNotification | null => {
	const timestamp = new Date(notif.createdAt)

	const typeMap: Record<string, NotificationType> = {
		NEW_FOLLOWER: 'follow',
		FOLLOW: 'follow',
		POST_LIKE: 'like',
		POST_COMMENT: 'comment',
	}

	const type = typeMap[notif.type]
	if (!type) return null

	// BE sends actor info directly on notification, not in 'data' object
	const userId = notif.latestActorId || notif.actorInfo?.actorId || ''
	const userName = notif.latestActorName || notif.actorInfo?.actorName || 'User'
	const userAvatar =
		notif.latestActorAvatarUrl ||
		notif.actorInfo?.avatarUrl ||
		'/placeholder-avatar.png'

	return {
		id: index,
		notificationId: notif.id,
		type,
		userId,
		user: userName,
		avatar: userAvatar,
		action: notif.content || notif.body || '',
		target: undefined,
		targetEntityId: notif.targetEntityId, // Post ID for likes/comments, userId for follows
		time: formatTimeAgo(timestamp),
		read: notif.isRead,
	}
}

const NotificationBadge = ({ type }: { type: NotificationType }) => {
	const iconMap = {
		like: { icon: Heart, bg: 'bg-destructive' },
		comment: { icon: MessageCircle, bg: 'bg-primary' },
		follow: { icon: UserPlus, bg: 'bg-accent' },
		cook: { icon: ChefHat, bg: 'bg-gold' },
		achievement: { icon: ChefHat, bg: 'bg-gradient-gold' },
	}

	const { icon: Icon, bg } = iconMap[type]

	return (
		<div
			className={cn(
				'absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-card',
				bg,
			)}
		>
			<Icon className='h-3 w-3 text-primary-foreground' />
		</div>
	)
}

export const NotificationsPopup = () => {
	const { isNotificationsPopupOpen, toggleNotificationsPopup } = useUiStore()
	const { user } = useAuth()
	const router = useRouter()
	const [gamifiedNotifications, setGamifiedNotifications] = useState<
		GamifiedNotification[]
	>([])
	const [socialNotifications, setSocialNotifications] = useState<
		SocialNotification[]
	>([])
	const [unreadCount, setUnreadCount] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	// Fetch notifications when popup opens
	useEffect(() => {
		if (!isNotificationsPopupOpen) return

		const fetchNotifications = async () => {
			setIsLoading(true)
			try {
				const response = await getNotifications({ size: 20 })
				if (response.success && response.data) {
					const { notifications, unreadCount: count } = response.data
					setUnreadCount(count)

					// Split notifications into gamified and social
					const gamified: GamifiedNotification[] = []
					const social: SocialNotification[] = []

					notifications.forEach((notif, idx) => {
						const gamifiedNotif = transformToGamifiedNotification(notif)
						if (gamifiedNotif) {
							gamified.push(gamifiedNotif)
						} else {
							const socialNotif = transformToSocialNotification(notif, idx)
							if (socialNotif) {
								social.push(socialNotif)
							}
						}
					})

					setGamifiedNotifications(gamified)
					setSocialNotifications(social)
				}
			} catch (err) {
				console.error('Failed to fetch notifications:', err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchNotifications()
	}, [isNotificationsPopupOpen])

	if (!isNotificationsPopupOpen) return null

	const handleMarkAllRead = async () => {
		try {
			const response = await markAllNotificationsRead()
			if (response.success) {
				setUnreadCount(0)
				setGamifiedNotifications(prev =>
					prev.map(n => ({ ...n, isRead: true })),
				)
				setSocialNotifications(prev => prev.map(n => ({ ...n, read: true })))
			}
		} catch (err) {
			console.error('Failed to mark all as read:', err)
		}
	}

	const handleClose = () => {
		toggleNotificationsPopup()
	}

	return (
		<>
			{/* Backdrop */}
			<div
				className='fixed inset-0 z-popover'
				onClick={handleClose}
				aria-hidden='true'
			/>

			{/* Dropdown */}
			<div className='fixed right-2 top-16 z-popover w-[calc(100vw-16px)] max-w-md animate-slideInDown overflow-hidden rounded-radius border border-border bg-card text-card-foreground shadow-glow md:absolute md:right-6 md:w-96'>
				{/* Header */}
				<div className='flex items-center justify-between border-b border-border p-4'>
					<div className='flex items-center gap-2'>
						<h3 className='text-lg font-bold text-foreground'>Notifications</h3>
						{unreadCount > 0 && (
							<span className='rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground'>
								{unreadCount}
							</span>
						)}
					</div>
					<button
						onClick={handleMarkAllRead}
						className='flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/10'
					>
						<CheckCheck className='h-4 w-4' />
						Mark all read
					</button>
				</div>

				{/* Notification List */}
				<div className='max-h-96 overflow-y-auto'>
					{/* Gamified Notifications (XP, levels, streaks) */}
					{gamifiedNotifications.length > 0 && (
						<>
							<div className='border-b border-border bg-muted/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground'>
								Activity
							</div>
							{gamifiedNotifications.map(notif => {
								// Provide callbacks based on notification type
								const callbacks = {
									onPost:
										notif.type === 'xp_awarded'
											? () => {
													toggleNotificationsPopup()
													router.push('/create')
												}
											: undefined,
									onFindRecipe:
										notif.type === 'streak_warning'
											? () => {
													toggleNotificationsPopup()
													router.push('/explore')
												}
											: undefined,
									onViewPost:
										notif.type === 'creator_bonus'
											? () => {
													toggleNotificationsPopup()
													router.push('/dashboard')
												}
											: undefined,
								}

								return (
									<NotificationItemGamified
										key={notif.id}
										{...notif}
										{...callbacks}
									/>
								)
							})}
						</>
					)}

					{/* Social Notifications */}
					{socialNotifications.length > 0 && (
						<>
							<div className='border-b border-border bg-muted/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground'>
								Social
							</div>
							{socialNotifications.map(notif => {
								// Determine navigation target based on notification type
								const getNavigationPath = () => {
									if (notif.type === 'follow') {
										// For follow notifications, navigate to the follower's profile
										return `/${notif.userId}`
									}
									if (
										(notif.type === 'like' || notif.type === 'comment') &&
										notif.targetEntityId
									) {
										// For likes/comments, navigate to the post
										return `/post/${notif.targetEntityId}`
									}
									return null
								}

								const handleClick = () => {
									const path = getNavigationPath()
									if (path) {
										handleClose()
										router.push(path)
									}
								}

								const handleFollowBack = async (e: React.MouseEvent) => {
									e.stopPropagation() // Prevent triggering the parent onClick
									if (!notif.userId) {
										toast.error('Cannot follow back: user not found')
										return
									}
									try {
										const response = await toggleFollow(notif.userId)
										if (response.success) {
											toast.success(`Following ${notif.user}!`)
											// Mark this notification as read locally
											setSocialNotifications(prev =>
												prev.map(n =>
													n.id === notif.id ? { ...n, read: true } : n,
												),
											)
										} else {
											toast.error(response.message || 'Failed to follow')
										}
									} catch {
										toast.error('Failed to follow. Please try again.')
									}
								}

								return (
									<div
										key={notif.id}
										onClick={handleClick}
										className={cn(
											'relative flex cursor-pointer items-start gap-3 border-b border-border p-4 transition-colors hover:bg-muted/50',
											!notif.read && 'bg-primary/5',
										)}
									>
										{/* Avatar with badge */}
										<UserHoverCard
											userId={notif.userId}
											currentUserId={user?.userId}
										>
											<div className='relative flex-shrink-0'>
												<Avatar size='lg' className='shadow-md'>
													<AvatarImage src={notif.avatar} alt={notif.user} />
													<AvatarFallback>
														{notif.user
															.split(' ')
															.map(n => n[0])
															.join('')
															.toUpperCase()
															.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
												<NotificationBadge type={notif.type} />
											</div>
										</UserHoverCard>
										{/* Content */}
										<div className='min-w-0 flex-1'>
											<p className='text-sm leading-relaxed text-foreground'>
												<UserHoverCard
													userId={notif.userId}
													currentUserId={user?.userId}
												>
													<span className='cursor-pointer font-semibold hover:underline'>
														{notif.user}
													</span>
												</UserHoverCard>{' '}
												{notif.action}
												{notif.target && (
													<>
														{' '}
														<span className='font-medium text-primary'>
															&ldquo;{notif.target}&rdquo;
														</span>
													</>
												)}
											</p>
											<span className='text-xs text-muted-foreground'>
												{notif.time}
											</span>
										</div>
										{/* Unread dot */}
										{!notif.read && (
											<div className='absolute right-4 top-5 h-2 w-2 rounded-full bg-primary shadow-glow' />
										)}{' '}
										{/* Follow back button - functional */}
										{notif.type === 'follow' && !notif.read && (
											<button
												onClick={handleFollowBack}
												className='flex-shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90'
											>
												Follow Back
											</button>
										)}
									</div>
								)
							})}
						</>
					)}
				</div>

				{/* Footer */}
				<div className='border-t border-border p-3 text-center'>
					<Link
						href='/notifications'
						className='text-sm font-semibold text-primary transition-colors hover:text-primary/80'
					>
						View All Notifications
					</Link>
				</div>
			</div>
		</>
	)
}
```

## `chefkix-fe\src\components\layout\index.ts`

```typescript
// Layout components barrel export
export { LeftSidebar } from './LeftSidebar'
export { RightSidebar } from './RightSidebar'
export { Topbar } from './Topbar'
export { MobileBottomNav } from './MobileBottomNav'
export { MessagesDrawer } from './MessagesDrawer'
export { NotificationsPopup } from './NotificationsPopup'
export { PageContainer } from './PageContainer'
export { PageTransition } from './PageTransition'
```

## `chefkix-fe\tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Core design system colors
				border: 'var(--border-color)',
				input: 'var(--border-medium)',
				ring: 'var(--focus)',
				background: 'var(--bg)',
				foreground: 'var(--text)',

				// Brand color system
				brand: {
					DEFAULT: 'var(--color-brand)',
					hover: 'var(--color-brand-hover)',
					subtle: 'var(--color-brand-subtle)',
				},

				// Accent colors - Purple (gaming, XP, achievements)
				'accent-purple': {
					DEFAULT: 'var(--color-accent-purple)',
					hover: 'var(--color-accent-purple-hover)',
					subtle: 'var(--color-accent-purple-subtle)',
				},

				// Accent colors - Teal (discovery, explore)
				'accent-teal': {
					DEFAULT: 'var(--color-accent-teal)',
					hover: 'var(--color-accent-teal-hover)',
					subtle: 'var(--color-accent-teal-subtle)',
				},

				// Semantic colors - with vivid variants
				success: {
					DEFAULT: 'var(--color-success)',
					vivid: 'var(--color-success-vivid)',
				},
				warning: {
					DEFAULT: 'var(--color-warning)',
					vivid: 'var(--color-warning-vivid)',
				},
				error: {
					DEFAULT: 'var(--color-error)',
					vivid: 'var(--color-error-vivid)',
				},
				info: {
					DEFAULT: 'var(--color-info)',
					vivid: 'var(--color-info-vivid)',
				},

				// Gaming colors
				streak: {
					DEFAULT: 'var(--color-streak)',
					urgent: 'var(--color-streak-urgent)',
				},
				xp: {
					DEFAULT: 'var(--color-xp)',
					bonus: 'var(--color-xp-bonus)',
				},
				level: {
					DEFAULT: 'var(--color-level)',
					glow: 'var(--color-level-glow)',
				},
				badge: 'var(--color-badge)',
				rare: 'var(--color-rare)',
				combo: 'var(--color-combo)',
				legendary: 'var(--color-legendary)',

				// Medal colors for leaderboards
				medal: {
					gold: {
						DEFAULT: 'var(--color-medal-gold)',
						glow: 'var(--color-medal-gold-glow)',
					},
					silver: {
						DEFAULT: 'var(--color-medal-silver)',
						glow: 'var(--color-medal-silver-glow)',
					},
					bronze: {
						DEFAULT: 'var(--color-medal-bronze)',
						glow: 'var(--color-medal-bronze-glow)',
					},
				},

				// Background colors
				bg: {
					DEFAULT: 'var(--bg)',
					page: 'var(--bg-page)',
					card: 'var(--bg-card)',
					elevated: 'var(--bg-elevated)',
					hover: 'var(--bg-hover)',
					input: 'var(--bg-input)',
				},

				// Text colors
				text: {
					DEFAULT: 'var(--text)',
					primary: 'var(--text-primary)',
					secondary: 'var(--text-secondary)',
					tertiary: 'var(--text-tertiary)',
					muted: 'var(--text-muted)',
				},

				// Border colors
				'border-subtle': 'var(--border-subtle)',
				'border-medium': 'var(--border-medium)',
				'border-strong': 'var(--border-strong)',

				// Legacy compatibility - mapped to new system
				'panel-bg': 'var(--bg-card)',
				primary: {
					DEFAULT: 'var(--color-brand)',
					dark: 'var(--color-brand-hover)',
					light: 'var(--color-brand)',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: 'var(--bg-elevated)',
					foreground: 'var(--text-primary)',
				},
				destructive: {
					DEFAULT: 'var(--color-error)',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: 'var(--muted)',
					strong: 'var(--muted-strong)',
					foreground: 'var(--text-muted)',
				},
				accent: {
					DEFAULT: 'var(--color-accent-purple)', // Purple for gaming feel!
					strong: 'var(--color-accent-purple-hover)',
					light: 'var(--color-brand-subtle)',
					foreground: 'var(--text)',
				},
				mint: 'var(--color-success)',
				gold: 'var(--color-warning)',
				popover: {
					DEFAULT: 'var(--bg-elevated)',
					foreground: 'var(--text)',
				},
				card: {
					DEFAULT: 'var(--bg-card)',
					foreground: 'var(--text)',
				},
			},
			borderRadius: {
				DEFAULT: 'var(--radius)',
				radius: 'var(--radius)', // Alias for components using 'rounded-radius'
				sm: 'var(--radius-sm)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)', // 20px - large modals, cards with extra rounding
				'2xl': '24px',
				'3xl': '28px',
				full: '9999px',
			},
			fontFamily: {
				// Primary: Plus Jakarta Sans - Modern, friendly, slightly rounded
				// Perfect for body text, buttons, navigation
				sans: [
					'var(--font-sans)',
					'Plus Jakarta Sans',
					'system-ui',
					'-apple-system',
					'Segoe UI',
					'Roboto',
					'sans-serif',
				],
				// Display: Space Grotesk - Bold, geometric, gaming vibes
				// For XP numbers, level badges, stats, headings with punch
				display: [
					'var(--font-display)',
					'Space Grotesk',
					'system-ui',
					'sans-serif',
				],
				// Serif: Playfair Display - Elegant, cookbook aesthetic
				// For recipe titles, quotes, editorial moments
				serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
				// Mono: System mono stack for code/technical
				mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			fontSize: {
				'2xs': 'var(--font-size-2xs)',
				xs: 'var(--font-size-xs)',
				sm: 'var(--font-size-sm)',
				caption: 'var(--font-size-caption)', // 13px - metadata, small captions
				label: 'var(--font-size-label)', // 15px - tab labels, semi-prominent
				base: 'var(--font-size-base)',
				lg: 'var(--font-size-lg)',
				xl: 'var(--font-size-xl)',
				'2xl': 'var(--font-size-2xl)',
				'icon-lg': 'var(--font-size-icon-lg)',
				'icon-xl': 'var(--font-size-icon-xl)',
				'icon-2xl': 'var(--font-size-icon-2xl)',
				'icon-3xl': 'var(--font-size-icon-3xl)',
				'icon-4xl': 'var(--font-size-icon-4xl)',
				'icon-emoji-xl': 'var(--font-size-icon-emoji-xl)',
			},
			fontWeight: {
				normal: 'var(--font-weight-normal)',
				medium: 'var(--font-weight-medium)',
				semibold: 'var(--font-weight-semibold)',
				bold: 'var(--font-weight-bold)',
				extrabold: 'var(--font-weight-extrabold)',
			},
			spacing: {
				// Numeric scale (8px baseline)
				1: 'var(--space-1)',
				2: 'var(--space-2)',
				3: 'var(--space-3)',
				4: 'var(--space-4)',
				5: 'var(--space-5)',
				6: 'var(--space-6)',
				8: 'var(--space-8)',
				10: 'var(--space-10)',
				12: 'var(--space-12)',
				// Semantic aliases (backward compatibility)
				xs: 'var(--space-xs)',
				sm: 'var(--space-sm)',
				md: 'var(--space-md)',
				lg: 'var(--space-lg)',
				xl: 'var(--space-xl)',
				'2xl': 'var(--space-2xl)',
				'3xl': 'var(--space-3xl)',
			},
			lineHeight: {
				tight: 'var(--line-height-tight)',
				normal: 'var(--line-height-normal)',
				relaxed: 'var(--line-height-relaxed)',
			},
			width: {
				// Canonical layout sizes mapped to CSS variables defined in globals.css
				nav: 'var(--nav-w)',
				right: 'var(--right-w)',
				drawer: 'var(--drawer-w)',
				// Icon sizes
				'icon-2xs': 'var(--icon-2xs)',
				'icon-xs': 'var(--icon-xs)',
				'icon-sm': 'var(--icon-sm)',
				'icon-md': 'var(--icon-md)',
				'icon-lg': 'var(--icon-lg)',
				'icon-xl': 'var(--icon-xl)',
				'icon-2xl': 'var(--icon-2xl)',
				'icon-emoji': 'var(--icon-emoji)',
				'icon-emoji-lg': 'var(--icon-emoji-lg)',
				'icon-emoji-xl': 'var(--icon-emoji-xl)',
				// Avatar sizes
				'avatar-xs': 'var(--avatar-xs)',
				'avatar-sm': 'var(--avatar-sm)',
				'avatar-md': 'var(--avatar-md)',
				'avatar-lg': 'var(--avatar-lg)',
				'avatar-xl': 'var(--avatar-xl)',
				// Thumbnail sizes
				'thumbnail-sm': 'var(--thumbnail-sm)',
				'thumbnail-md': 'var(--thumbnail-md)',
				'thumbnail-lg': 'var(--thumbnail-lg)',
				'thumbnail-xl': 'var(--thumbnail-xl)',
				'thumbnail-2xl': 'var(--thumbnail-2xl)',
			},
			height: {
				// Icon sizes (matching width)
				'icon-2xs': 'var(--icon-2xs)',
				'icon-xs': 'var(--icon-xs)',
				'icon-sm': 'var(--icon-sm)',
				'icon-md': 'var(--icon-md)',
				'icon-lg': 'var(--icon-lg)',
				'icon-xl': 'var(--icon-xl)',
				'icon-2xl': 'var(--icon-2xl)',
				'icon-emoji': 'var(--icon-emoji)',
				'icon-emoji-lg': 'var(--icon-emoji-lg)',
				'icon-emoji-xl': 'var(--icon-emoji-xl)',
				// Avatar sizes
				'avatar-xs': 'var(--avatar-xs)',
				'avatar-sm': 'var(--avatar-sm)',
				'avatar-md': 'var(--avatar-md)',
				'avatar-lg': 'var(--avatar-lg)',
				'avatar-xl': 'var(--avatar-xl)',
				// Thumbnail sizes
				'thumbnail-sm': 'var(--thumbnail-sm)',
				'thumbnail-md': 'var(--thumbnail-md)',
				'thumbnail-lg': 'var(--thumbnail-lg)',
				'thumbnail-xl': 'var(--thumbnail-xl)',
				'thumbnail-2xl': 'var(--thumbnail-2xl)',
				// Card image heights
				'card-image': 'var(--card-image-height)',
				// Drawer height
				drawer: 'var(--drawer-h)',
				// Panel heights
				'panel-md': 'var(--h-panel-md)',
				'panel-lg': 'var(--h-panel-lg)',
				'panel-xl': 'var(--h-panel-xl)',
			},
			size: {
				// Combined width/height tokens for square elements
				'icon-2xs': 'var(--icon-2xs)',
				'icon-xs': 'var(--icon-xs)',
				'icon-sm': 'var(--icon-sm)',
				'icon-md': 'var(--icon-md)',
				'icon-lg': 'var(--icon-lg)',
				'icon-xl': 'var(--icon-xl)',
				'icon-2xl': 'var(--icon-2xl)',
				'icon-emoji': 'var(--icon-emoji)',
				'icon-emoji-lg': 'var(--icon-emoji-lg)',
				'icon-emoji-xl': 'var(--icon-emoji-xl)',
				'avatar-xs': 'var(--avatar-xs)',
				'avatar-sm': 'var(--avatar-sm)',
				'avatar-md': 'var(--avatar-md)',
				'avatar-lg': 'var(--avatar-lg)',
				'avatar-xl': 'var(--avatar-xl)',
				'thumbnail-sm': 'var(--thumbnail-sm)',
				'thumbnail-md': 'var(--thumbnail-md)',
				'thumbnail-lg': 'var(--thumbnail-lg)',
				'thumbnail-xl': 'var(--thumbnail-xl)',
				'thumbnail-2xl': 'var(--thumbnail-2xl)',
			},
			maxWidth: {
				// Container widths
				'container-sm': 'var(--container-sm)',
				'container-md': 'var(--container-md)',
				'container-lg': 'var(--container-lg)',
				'container-xl': 'var(--container-xl)',
				'container-form': 'var(--container-form)', // 900px - wide forms
				// Modal widths
				'modal-sm': 'var(--modal-sm)',
				'modal-md': 'var(--modal-md)',
				'modal-lg': 'var(--modal-lg)',
				'modal-xl': 'var(--modal-xl)',
				'modal-2xl': 'var(--modal-2xl)', // Near-fullscreen modals (768px)
				// Chat bubble widths
				'bubble-sm': 'var(--bubble-sm)',
				'bubble-md': 'var(--bubble-md)',
				'bubble-lg': 'var(--bubble-lg)',
				// Cooking player
				'step-dots': 'var(--step-dots-max-w)', // 280px - mobile
				'step-dots-lg': 'var(--step-dots-max-w-lg)', // 400px - desktop
				// Element max-widths
				'thumbnail-sm': 'var(--thumbnail-sm)',
				'thumbnail-md': 'var(--thumbnail-md)',
				'thumbnail-lg': 'var(--thumbnail-lg)',
				'thumbnail-xl': 'var(--thumbnail-xl)',
				'thumbnail-2xl': 'var(--thumbnail-2xl)',
			},
			maxHeight: {
				// Panel heights
				'panel-md': 'var(--h-panel-md)',
				'panel-lg': 'var(--h-panel-lg)',
				'panel-xl': 'var(--h-panel-xl)',
				// Modal/Sheet viewport heights
				modal: 'var(--h-modal-max)', // 90vh - standard modal max
				'sheet-mobile': 'var(--h-sheet-mobile)', // 85vh - mobile sheets
				'sheet-full': 'var(--h-sheet-full)', // 95vh - near fullscreen
				'modal-constrained': 'var(--h-modal-constrained)', // 80vh - with header visible
				'content-max': 'var(--h-content-max)', // 70vh - content areas
			},
			height: {
				// Sheet specific heights
				'sheet-mobile': 'var(--h-sheet-mobile)', // 85vh - mobile sheets
			},
			minWidth: {
				nav: 'var(--nav-w)',
				search: 'var(--input-search-min-w)', // 200px - Search input minimum width
				// Component min-widths
				'thumbnail-sm': 'var(--thumbnail-sm)', // 52px - badges, small elements
				'thumbnail-md': 'var(--thumbnail-md)', // 60px - leaderboard points
				'thumbnail-lg': 'var(--thumbnail-lg)', // 72px - medium elements
				'thumbnail-xl': 'var(--thumbnail-xl)', // 100px - badges showcase
			},
			minHeight: {
				textarea: 'var(--h-textarea-min)',
				'textarea-sm': 'var(--h-textarea-sm)', // 120px - compact textarea
				'textarea-lg': 'var(--h-textarea-lg)', // 200px - large textarea
				content: 'var(--h-content-min)',
				'content-tall': 'var(--h-content-tall)',
				banner: 'var(--banner-min-height)',
				'panel-md': 'var(--h-panel-md)',
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				DEFAULT: 'var(--shadow-md)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				glow: 'var(--shadow-glow)',
				card: 'var(--shadow-card)' /* Subtle lift for cards */,
				warm: 'var(--shadow-warm)' /* Cozy warm shadow */,
			},
			backdropBlur: {
				sm: 'var(--blur-sm)',
				md: 'var(--blur-md)',
				lg: 'var(--blur-lg)',
			},
			backdropSaturate: {
				DEFAULT: 'var(--saturate)',
			},
			inset: {
				'mobile-header': 'var(--h-mobile-header)', // 60px offset for mobile sticky bars
			},
			transitionTimingFunction: {
				ease: 'var(--transition-ease)',
				bounce: 'var(--transition-bounce)',
			},
			zIndex: {
				base: 'var(--z-base)',
				dropdown: 'var(--z-dropdown)',
				sticky: 'var(--z-sticky)',
				popover: 'var(--z-popover)',
				modal: 'var(--z-modal)',
				notification: 'var(--z-notification)',
				tooltip: 'var(--z-tooltip)',
			},
			backgroundImage: {
				// Primary gradients
				'gradient-brand': 'var(--gradient-brand)',
				'gradient-primary': 'var(--gradient-brand)',

				// Semantic gradients
				'gradient-success': 'var(--gradient-success)',
				'gradient-gold': 'var(--gradient-gold)',

				// Gaming gradients
				'gradient-xp': 'var(--gradient-xp)',
				'gradient-streak': 'var(--gradient-streak)',

				// Thematic gradients
				'gradient-warm': 'var(--gradient-warm)',
				'gradient-cool': 'var(--gradient-cool)',
				'gradient-ocean': 'var(--gradient-ocean)',
				'gradient-party': 'var(--gradient-party)',
				'gradient-sunset': 'var(--gradient-warm)',

				// Celebration gradients
				'gradient-celebration': 'var(--gradient-celebration)',
				'gradient-celebration-alt': 'var(--gradient-celebration-alt)',
			},
			borderWidth: {
				DEFAULT: '1px',
				0: '0',
				2: 'var(--border-2)',
				3: 'var(--border-3)',
				4: 'var(--border-4)',
				5: 'var(--border-5)',
			},
			ringWidth: {
				DEFAULT: '3px',
				0: '0',
				1: '1px',
				2: '2px',
				3: 'var(--border-3)',
				4: 'var(--border-4)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				fadeIn: {
					from: { opacity: 0, transform: 'translateY(10px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				slideInUp: {
					'0%': {
						opacity: 0,
						transform: 'translateY(100px) scale(0.9)',
						filter: 'blur(10px)',
					},
					'100%': {
						opacity: 1,
						transform: 'translateY(0) scale(1)',
						filter: 'blur(0)',
					},
				},
				shine: {
					'0%': {
						transform: 'translateX(-100%) translateY(-100%) rotate(45deg)',
					},
					'100%': {
						transform: 'translateX(100%) translateY(100%) rotate(45deg)',
					},
				},
				'avatar-glow': {
					'0%, 100%': { filter: 'blur(8px)', opacity: 0.5 },
					'50%': { filter: 'blur(12px)', opacity: 0.8 },
				},
				'story-pulse': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)' },
					'50%': { boxShadow: '0 0 0 8px rgba(102, 126, 234, 0)' },
				},
				'heart-beat': {
					'0%, 100%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.3)' },
					'50%': { transform: 'scale(1.1)' },
					'75%': { transform: 'scale(1.25)' },
				},
				'like-pop': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.4)' },
					'100%': { transform: 'scale(1)' },
				},
				pulse: {
					'0%, 100%': {
						transform: 'scale(1)',
						boxShadow: '0 0 0 0 rgba(255, 210, 74, 0.7)',
					},
					'50%': {
						transform: 'scale(1.05)',
						boxShadow: '0 0 10px 15px rgba(255, 210, 74, 0)',
					},
				},
				spin: {
					to: { transform: 'rotate(360deg)' },
				},
				'challenge-rotate': {
					'100%': { transform: 'rotate(360deg)' },
				},
				'achievement-in': {
					to: { transform: 'scale(1)' },
				},
				blink: {
					'0%, 100%': { opacity: 0.3 },
					'50%': { opacity: 1 },
				},
				'confetti-pop': {
					'0%': { transform: 'scale(0.5) rotate(-10deg)', opacity: 0 },
					'50%': { transform: 'scale(1.2) rotate(10deg)', opacity: 1 },
					'100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
				},
				ripple: {
					'0%': { transform: 'scale(0)', opacity: 1 },
					'100%': { transform: 'scale(4)', opacity: 0 },
				},
				scaleIn: {
					'0%': { opacity: 0, transform: 'scale(0.8)' },
					'100%': { opacity: 1, transform: 'scale(1)' },
				},
				fadeOut: {
					from: { opacity: 1 },
					to: { opacity: 0 },
				},
				'xp-shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'float-up': {
					from: { opacity: 1, transform: 'translateY(0)' },
					to: { opacity: 0, transform: 'translateY(-30px)' },
				},
				'toast-bounce-in': {
					'0%': {
						opacity: 0,
						transform: 'translateX(-50%) translateY(100px) scale(0.8)',
					},
					'50%': {
						transform: 'translateX(-50%) translateY(-10px) scale(1.05)',
					},
					'100%': {
						opacity: 1,
						transform: 'translateX(-50%) translateY(0) scale(1)',
					},
				},
				'toast-slide-out': {
					to: {
						opacity: 0,
						transform: 'translateX(-50%) translateY(100px) scale(0.8)',
					},
				},
				shimmer: {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				fadeIn: 'fadeIn 0.3s ease-in-out',
				slideInUp: 'slideInUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
				shine: 'shine 2s ease-in-out infinite',
				'avatar-glow': 'avatar-glow 2s ease-in-out infinite',
				'story-pulse': 'story-pulse 1.5s ease-in-out infinite',
				'heart-beat': 'heart-beat 0.5s ease-in-out',
				'like-pop': 'like-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				spin: 'spin 1s linear infinite',
				'spin-slow': 'spin 4s linear infinite',
				'challenge-rotate': 'challenge-rotate 20s linear infinite',
				'achievement-in':
					'achievement-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				blink: 'blink 1.4s infinite',
				'confetti-pop':
					'confetti-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				ripple: 'ripple 0.6s ease-out',
				scaleIn: 'scaleIn 0.3s ease-out',
				fadeOut: 'fadeOut 0.3s ease-out',
				'xp-shimmer': 'xp-shimmer 2s ease-in-out infinite',
				'float-up': 'float-up 1s ease-out forwards',
				'toast-bounce-in':
					'toast-bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'toast-slide-out': 'toast-slide-out 0.3s ease-in forwards',
				shimmer: 'shimmer 2s infinite linear',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
```

## `chefkix-fe\src\app\globals.css`

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

/* ===================================
   DESIGN TOKENS & CSS VARIABLES
   Chefkix: Gamified Social Cooking Platform
   =================================== */

:root {
	/* ============ BRAND COLORS - VIBRANT & PLAYFUL ============ */

	/* Primary Brand - Energetic Coral/Orange-Red */
	--color-brand: #ff5a36; /* More vibrant coral - CTAs, primary actions */
	--color-brand-hover: #e64a2e; /* Darker for hover */
	--color-brand-subtle: #fff0eb; /* Soft background tint */

	/* Secondary Brand - Electric Purple (for variety & gaming feel) */
	--color-accent-purple: #8b5cf6; /* Achievements, XP, special actions */
	--color-accent-purple-hover: #7c3aed;
	--color-accent-purple-subtle: #f3f0ff;

	/* Tertiary - Teal/Cyan (freshness, discovery) */
	--color-accent-teal: #14b8a6; /* Discovery, explore, new content */
	--color-accent-teal-hover: #0d9488;
	--color-accent-teal-subtle: #e6fffa;

	/* Semantic Colors - VIBRANT & Expressive */
	--color-success: #10b981; /* Brighter emerald - completed, achievements */
	--color-success-vivid: #34d399; /* Extra pop for celebrations */
	--color-warning: #f59e0b; /* Richer amber - caution, timers */
	--color-warning-vivid: #fbbf24; /* Urgent warnings */
	--color-error: #ef4444; /* Vibrant red - errors, destructive */
	--color-error-vivid: #f87171; /* Urgent errors */
	--color-info: #3b82f6; /* Brighter blue - tips, info */
	--color-info-vivid: #60a5fa; /* Highlighted info */

	/* Gaming Colors - XP, Streaks, Levels, Rarity */
	--color-streak: #f97316; /* Fire orange - streaks */
	--color-streak-urgent: #dc2626; /* Deep red - about to lose streak */
	--color-xp: #a855f7; /* Purple - XP gains */
	--color-bonus: #c084fc; /* Lighter purple - bonus XP, rewards */
	--color-level: #eab308; /* Gold - level ups */
	--color-level-glow: #fde047; /* Bright gold glow */
	--color-badge: #06b6d4; /* Cyan - badges earned */

	/* Rarity Colors - Gaming RPG style */
	--color-rare: #3b82f6; /* Blue - rare items/achievements */
	--color-combo: #ec4899; /* Pink - combos, multipliers */
	--color-legendary: #f59e0b; /* Amber - legendary, premium */
	--color-gold: #eab308; /* Gold - coins, premium currency */

	/* Medal Colors - Podium/Leaderboard */
	--color-medal-gold: #eab308; /* Rich gold - 1st place */
	--color-medal-gold-glow: #fde047; /* Bright gold highlight */
	--color-medal-gold-deep: #ca8a04; /* Deep gold shadow */
	--color-medal-silver: #94a3b8; /* Warm silver (slate) - 2nd place */
	--color-medal-silver-glow: #e2e8f0; /* Bright silver highlight */
	--color-medal-silver-deep: #64748b; /* Deep silver shadow */
	--color-medal-bronze: #d97706; /* Warm bronze/copper - 3rd place */
	--color-medal-bronze-glow: #fbbf24; /* Bronze highlight */
	--color-medal-bronze-deep: #b45309; /* Deep bronze shadow */

	/* ============ PREMIUM METALLIC PODIUM GRADIENTS ============ */
	/* These gradients create a 3D metallic shimmer effect */

	/* Gold Podium - Shimmering treasure */
	--gradient-medal-gold: linear-gradient(
		165deg,
		#fef3c7 0%,
		/* Bright highlight at top */ #fde047 15%,
		/* Gold glow */ #eab308 40%,
		/* Rich gold */ #ca8a04 70%,
		/* Deep gold */ #a16207 100% /* Shadow at bottom */
	);

	/* Silver Podium - Polished metal */
	--gradient-medal-silver: linear-gradient(
		165deg,
		#f1f5f9 0%,
		/* Bright highlight */ #e2e8f0 15%,
		/* Silver glow */ #94a3b8 40%,
		/* Silver mid */ #64748b 70%,
		/* Slate */ #475569 100% /* Deep shadow */
	);

	/* Bronze Podium - Burnished copper */
	--gradient-medal-bronze: linear-gradient(
		165deg,
		#fef3c7 0%,
		/* Warm highlight */ #fbbf24 15%,
		/* Amber glow */ #d97706 40%,
		/* Bronze */ #b45309 70%,
		/* Deep bronze */ #92400e 100% /* Rich shadow */
	);

	/* ============ LIGHT MODE COLORS ============ */

	/* Backgrounds - Warm parchment/kitchen palette (think: fresh bread, warm wood) */
	--bg: #f8f4ef; /* Warm parchment base - like a recipe book page */
	--bg-page: #f8f4ef;
	--bg-card: #fdfbf8; /* Soft cream cards - NOT stark white */
	--bg-elevated: #f3ede6; /* Warm elevated - like light wood */
	--bg-hover: #ede7df; /* Honey-touched hover */
	--bg-input: #faf8f5; /* Slightly warmer input fields */

	/* Text - Chocolate/Espresso tones (rich, appetizing) */
	--text: #2c2420; /* Espresso - rich warm black */
	--text-primary: #2c2420;
	--text-secondary: #524840; /* Dark chocolate - readable warmth */
	--text-tertiary: #7a6f65; /* Cocoa - medium emphasis */
	--text-muted: #a89f94; /* Latte - soft muted */

	/* Borders - Warm stone/terracotta undertones */
	--border: #e5ddd5; /* Warm sand border */
	--border-color: #e5ddd5;
	--border-subtle: #f0ebe5; /* Barely there cream */
	--border-medium: #d4cac0; /* Warm taupe */
	--border-strong: #a89f94; /* Strong stone */

	/* Legacy semantic tokens (for compatibility) */
	--muted: #f3ede6; /* Warm muted background - matches elevated */
	--muted-foreground: var(--text-muted);
	--muted-strong: #5c534a; /* Warm dark muted - like dark wood */

	/* Backwards compatibility - map old tokens to new system */
	--primary: var(--color-brand);
	--primary-dark: var(--color-brand-hover);
	--primary-light: var(--color-brand);
	--accent: var(--color-accent-purple); /* Purple for accents now! */
	--accent-strong: var(--color-accent-purple-hover);
	--accent-light: var(--color-accent-purple-subtle);
	--mint: var(--color-success);
	--gold: var(--color-level); /* Gaming gold */
	--destructive: var(--color-error);
	--panel-bg: var(--bg-card);

	/* ============ GRADIENTS - EXPRESSIVE & PLAYFUL ============ */

	/* Primary Action Gradient */
	--gradient-brand: linear-gradient(
		135deg,
		#ff5a36 0%,
		#ff7849 50%,
		#e64a2e 100%
	);

	/* Success/Achievement Gradient */
	--gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%);

	/* XP/Gaming Gradient */
	--gradient-xp: linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #8b5cf6 100%);

	/* Level Up / Gold Gradient */
	--gradient-gold: linear-gradient(
		135deg,
		#f59e0b 0%,
		#fbbf24 50%,
		#eab308 100%
	);

	/* Streak Fire Gradient */
	--gradient-streak: linear-gradient(
		135deg,
		#f97316 0%,
		#fb923c 50%,
		#ea580c 100%
	);

	/* Discovery/Explore Gradient */
	--gradient-cool: linear-gradient(
		135deg,
		#14b8a6 0%,
		#2dd4bf 50%,
		#06b6d4 100%
	);

	/* Sunset/Warm Gradient (for cards, banners) */
	--gradient-warm: linear-gradient(
		135deg,
		#ff5a36 0%,
		#f97316 50%,
		#f59e0b 100%
	);

	/* Ocean/Calm Gradient */
	--gradient-ocean: linear-gradient(
		135deg,
		#3b82f6 0%,
		#60a5fa 50%,
		#14b8a6 100%
	);

	/* Party/Celebration Gradient */
	--gradient-party: linear-gradient(
		135deg,
		#ec4899 0%,
		#a855f7 50%,
		#6366f1 100%
	);

	/* ✨ SIGNATURE GRADIENT - Coral to Purple (THE hero gradient) */
	/* Used for: Step badges, CTAs, submit buttons, key actions */
	--gradient-hero: linear-gradient(
		135deg,
		#ff5a36 0%,
		#c084fc 50%,
		#a855f7 100%
	);

	/* Indigo-Purple (challenges, achievements) */
	--gradient-indigo: linear-gradient(
		135deg,
		#6366f1 0%,
		#8b5cf6 50%,
		#a855f7 100%
	);

	/* Legacy aliases */
	--gradient-primary: var(--gradient-brand);
	--gradient-sunset: var(--gradient-warm);

	/* Celebration backgrounds (dark, festive) */
	--gradient-celebration: linear-gradient(
		135deg,
		#1e1b4b 0%,
		#312e81 50%,
		#4c1d95 100%
	);
	--gradient-celebration-alt: linear-gradient(
		135deg,
		#0f172a 0%,
		#1e1b4b 50%,
		#581c87 100%
	);

	/* ============ BORDER WIDTHS ============ */
	/* Emphasis borders for avatars, badges, indicators */
	--border-2: 2px;
	--border-3: 3px;
	--border-4: 4px;
	--border-5: 5px;

	/* ============ LAYOUT ============ */
	--nav-w: 80px;
	--right-w: 280px;
	--radius: 16px;
	--radius-sm: 12px;
	--radius-lg: 24px;
	--radius-xl: 20px; /* Large modals, cards with extra rounding */

	/* Heights */
	--h-topbar: 72px;
	--h-mobile-nav: 72px;
	--h-mobile-header: 60px; /* Mobile sticky header offset */
	--h-textarea-sm: 120px; /* Compact textarea (post content) */
	--h-textarea-min: 100px; /* Minimum height for textareas */
	--h-textarea-lg: 200px; /* Larger textarea for recipe content */
	--h-content-min: 50vh; /* Minimum content height (empty states) */
	--h-content-tall: 60vh; /* Taller content height (error states) */
	--h-content-max: 70vh; /* Max content height (profile not found) */
	--h-panel-md: 400px; /* Medium panel height (recipe cards, error boundaries) */
	--h-panel-lg: 500px; /* Large panel height (comment lists, messages) */
	--h-panel-xl: 600px; /* Extra large panel height (AI assistant) */

	/* Modal/Sheet viewport heights */
	--h-modal-max: 90vh; /* Standard modal max height */
	--h-sheet-mobile: 85vh; /* Mobile sheet height */
	--h-sheet-full: 95vh; /* Near-fullscreen sheet */
	--h-modal-constrained: 80vh; /* Constrained modal (with header visible) */

	/* ============ ICON & ELEMENT SIZES ============ */
	/* Icon sizes - used for lucide icons and inline graphics */
	--icon-2xs: 14px; /* Tiny inline icons */
	--icon-xs: 14px;
	--icon-sm: 18px; /* Most common small icon size */
	--icon-md: 22px; /* Badge indicators, verification icons */
	--icon-lg: 28px; /* Featured icons, emoji displays */
	--icon-xl: 32px; /* Large decorative icons */
	--icon-2xl: 40px; /* Large decorative icons */
	--icon-emoji: 28px; /* Standard emoji display size */
	--icon-emoji-lg: 32px; /* Large emoji size */
	--icon-emoji-xl: 64px; /* Hero emoji size */

	/* Avatar sizes */
	--avatar-xs: 32px;
	--avatar-sm: 42px; /* Action buttons, small profile pics */
	--avatar-md: 72px; /* Standard avatar, thumbnail images */
	--avatar-lg: 100px; /* Featured elements, celebration icons */
	--avatar-xl: 120px; /* Profile header avatars */

	/* Modal & Card widths */
	--modal-sm: 380px;
	--modal-md: 420px;
	--modal-lg: 480px;
	--modal-xl: 600px;
	--modal-2xl: 768px; /* Near-fullscreen modals (CookingPlayer) */

	/* Drawer dimensions */
	--drawer-w: 400px;
	--drawer-h: 500px;
	--drawer-min-w: 300px;
	--drawer-max-w: 800px;
	--drawer-min-h: 300px;
	--drawer-max-h: 800px;

	/* Chat bubble widths */
	--bubble-sm: 200px; /* Reply preview, truncated content */
	--bubble-md: 280px; /* Mobile chat bubbles */
	--bubble-lg: 400px; /* Desktop chat bubbles */

	/* Cooking player dimensions */
	--step-dots-max-w: 280px; /* Mobile step dots container */
	--step-dots-max-w-lg: 400px; /* Desktop step dots container */

	/* Input dimensions */
	--input-search-min-w: 200px; /* Search input minimum width */

	/* Container widths for page layouts */
	--container-sm: 480px;
	--container-md: 600px;
	--container-lg: 800px;
	--container-xl: 1000px;
	--container-form: 900px; /* Recipe/settings form max-width */

	/* Common component dimensions */
	--thumbnail-sm: 52px; /* Challenge icons, small previews */
	--thumbnail-md: 60px; /* Recipe thumbnails */
	--thumbnail-lg: 72px; /* Larger thumbnails, badge displays */
	--thumbnail-xl: 100px; /* Featured images */
	--thumbnail-2xl: 120px; /* Hero images */
	--card-image-height: 200px; /* Standard card image height */
	--banner-min-height: 320px; /* Challenge/promo banners */

	/* Z-index scale - HIERARCHY (lower = behind, higher = in front)
	 * CRITICAL: Modals must use HIGH values (9000+) because CSS properties
	 * like backdrop-blur, transform, filter create new stacking contexts.
	 * Even z-1000 can appear BEHIND content with these properties.
	 *
	 * Content: 1-49 (cards, images, overlays within cards)
	 * Dropdowns: 100 (menus, selects - above content)
	 * Sticky: 200 (headers, nav bars - above dropdowns on scroll)
	 * Popover: 500 (hover cards, context menus)
	 * Modal backdrop + content: 9000 (MUST be high - above ALL stacking contexts)
	 * Notification: 9500 (toasts - above modals)
	 * Tooltip: 9900 (highest - always visible above everything)
	 */
	--z-base: 1;
	--z-dropdown: 100;
	--z-sticky: 200;
	--z-popover: 500;
	--z-modal: 9000;
	--z-notification: 9500;
	--z-tooltip: 9900;

	/* Elevated surface tokens */
	--bg-elev: var(--bg-elevated);
	--surface: var(--bg-card);

	/* ============ SHADOWS - WARM & INVITING ============ */
	/* Shadows with warm brown undertones, not cold gray */
	--shadow-sm:
		0 2px 8px rgba(44, 36, 32, 0.06), 0 1px 2px rgba(44, 36, 32, 0.04);
	--shadow-md:
		0 4px 16px rgba(44, 36, 32, 0.08), 0 2px 4px rgba(44, 36, 32, 0.04);
	--shadow-lg:
		0 8px 32px rgba(44, 36, 32, 0.12), 0 4px 8px rgba(44, 36, 32, 0.06);
	--shadow-glow: 0 0 28px rgba(255, 90, 54, 0.25); /* Brand coral glow */
	--shadow-warm: 0 4px 22px rgba(44, 36, 32, 0.1); /* Cozy card shadow */
	--shadow-card:
		0 2px 12px rgba(44, 36, 32, 0.06), 0 1px 3px rgba(44, 36, 32, 0.03); /* Subtle card lift */

	/* ============ TRANSITIONS - SMOOTH & DELIGHTFUL ============ */
	--transition-ease: cubic-bezier(0.25, 0.8, 0.25, 1);
	--transition-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	--transition-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

	/* ============ EFFECTS ============ */
	--blur-sm: 10px;
	--blur-md: 16px;
	--blur-lg: 24px;
	--saturate: 180%;

	/* ============ SPACING SCALE (8px baseline) ============ */
	/* Numeric scale for precise control */
	--space-1: 4px;
	--space-2: 8px;
	--space-3: 12px;
	--space-4: 16px;
	--space-5: 20px;
	--space-6: 24px;
	--space-8: 32px;
	--space-10: 40px;
	--space-12: 48px;

	/* Semantic aliases (for backward compatibility) */
	--space-xs: 4px;
	--space-sm: 8px;
	--space-md: 12px;
	--space-lg: 16px;
	--space-xl: 24px;
	--space-2xl: 32px;
	--space-3xl: 48px;

	/* ============ TYPOGRAPHY ============ */
	/* Font families are set via Next.js font loader in layout.tsx */
	/* --font-sans: Plus Jakarta Sans (primary - friendly, modern) */
	/* --font-display: Space Grotesk (gaming stats, XP, bold numbers) */
	/* --font-serif: Playfair Display (recipe titles, editorial elegance) */

	--font-size-2xs: 10px; /* Very small labels, badges */
	--font-size-xs: 12px;
	--font-size-sm: 14px;
	--font-size-base: 16px;
	--font-size-lg: 20px;
	--font-size-xl: 26px;
	--font-size-2xl: 34px;
	--font-size-3xl: 42px; /* Hero headings */
	--font-size-4xl: 52px; /* Display headings */
	--font-size-icon-lg: 28px; /* Emoji/icon text size - matches icon-lg */
	--font-size-icon-xl: 32px; /* Large emoji/icon text size - matches icon-xl */
	--font-size-icon-2xl: 40px; /* Achievement emoji size */
	--font-size-icon-3xl: 48px; /* Large achievement emoji size */
	--font-size-icon-4xl: 60px; /* Extra large achievement emoji size */
	--font-size-icon-emoji-xl: 64px; /* Hero emoji size - for empty states */
	--font-size-caption: 13px; /* Small captions, metadata */
	--font-size-label: 15px; /* Tab labels, semi-prominent text */

	--font-weight-normal: 400;
	--font-weight-medium: 500;
	--font-weight-semibold: 600;
	--font-weight-bold: 700;
	--font-weight-extrabold: 800;

	/* Letter Spacing - for that premium feel */
	--tracking-tighter: -0.03em; /* Display headings */
	--tracking-tight: -0.015em; /* Subheadings */
	--tracking-normal: 0;
	--tracking-wide: 0.025em; /* Labels, small caps */
	--tracking-wider: 0.05em; /* XP/stat labels */

	/* Line Heights */
	--line-height-tight: 1.2; /* Tighter for big headings */
	--line-height-snug: 1.35; /* Subheadings */
	--line-height-normal: 1.5;
	--line-height-relaxed: 1.65; /* Body text for readability */

	/* ============ CONTAINER WIDTHS ============ */
	--container-sm: 640px;
	--container-md: 680px;
	--container-lg: 800px; /* Main content feed width - uniform across social pages */
	--container-xl: 1200px;

	/* Accessibility / focus - warm brand glow */
	--focus: rgba(255, 90, 54, 0.15); /* Brand coral focus ring */

	/* Note: Z-index scale is defined earlier in this file. Do not duplicate here. */

	/* Legacy Tailwind variables (kept for compatibility) */
	--background: oklch(1 0 0);
	--foreground: oklch(0.141 0.005 285.823);
	--card: oklch(1 0 0);
	--card-foreground: oklch(0.141 0.005 285.823);
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.141 0.005 285.823);
	--primary-foreground: oklch(0.985 0 0);
	--secondary: oklch(0.967 0.001 286.375);
	--secondary-foreground: oklch(0.21 0.006 285.885);
	--destructive: oklch(0.577 0.245 27.325);
	--ring: oklch(0.705 0.015 286.067);
}

/* ============ DARK MODE ============ */
@media (prefers-color-scheme: dark) {
	:root {
		/* ============ DARK MODE SURFACES - RICH DEPTH ============ */
		--bg: #0f0d0c; /* Warm dark base */
		--bg-page: #0f0d0c;
		--bg-card: #1a1817; /* Warm elevated cards */
		--bg-elevated: #262220; /* Higher elevation */
		--bg-hover: #2e2a27; /* Interactive hover */
		--bg-input: #1a1817;
		--panel-bg: #1a1817;

		/* ============ DARK MODE TEXT - WARM & READABLE ============ */
		--text: #faf8f6;
		--text-primary: #faf8f6;
		--text-secondary: #e7e5e4;
		--text-tertiary: #a8a29e;
		--text-muted: #78716c;

		/* ============ DARK MODE BORDERS ============ */
		--border: #2e2a27;
		--border-color: #2e2a27;
		--border-subtle: #1f1c1a;
		--border-medium: #3d3835;
		--border-strong: #57534e;

		/* Legacy semantic tokens */
		--muted: #262220;
		--muted-foreground: var(--text-muted);
		--muted-strong: #a8a29e;

		/* ============ DARK MODE BRAND - EXTRA VIBRANT ============ */
		--color-brand: #ff6b4a; /* Brighter on dark */
		--color-brand-hover: #ff8566;
		--color-brand-subtle: #2d1810;

		/* Secondary Accent - Purple glows on dark */
		--color-accent-purple: #a78bfa;
		--color-accent-purple-hover: #c4b5fd;
		--color-accent-purple-subtle: #1e1535;

		/* Tertiary - Teal pops on dark */
		--color-accent-teal: #2dd4bf;
		--color-accent-teal-hover: #5eead4;
		--color-accent-teal-subtle: #0d2926;

		/* Semantic colors - VIVID on dark */
		--color-success: #34d399;
		--color-success-vivid: #6ee7b7;
		--color-warning: #fbbf24;
		--color-warning-vivid: #fcd34d;
		--color-error: #f87171;
		--color-error-vivid: #fca5a5;
		--color-info: #60a5fa;
		--color-info-vivid: #93c5fd;

		/* Gaming colors - GLOW on dark */
		--color-streak: #fb923c;
		--color-streak-urgent: #ef4444;
		--color-xp: #c084fc;
		--color-bonus: #d8b4fe;
		--color-level: #fbbf24;
		--color-level-glow: #fef08a;
		--color-badge: #22d3ee;

		/* Rarity Colors - Glow on dark */
		--color-rare: #60a5fa; /* Brighter blue */
		--color-combo: #f472b6; /* Brighter pink */
		--color-legendary: #fbbf24; /* Brighter amber */
		--color-gold: #fde047; /* Brighter gold */

		/* ============ DARK MODE SHADOWS - GLOWY ============ */
		--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.5);
		--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.6);
		--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.7);
		--shadow-glow: 0 0 32px rgba(255, 107, 74, 0.5); /* Brand glow */
		--shadow-warm: 0 4px 24px rgba(255, 107, 74, 0.3);
		--shadow-card:
			0 2px 16px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 107, 74, 0.1); /* Subtle warm edge */
		--shadow-xp: 0 0 24px rgba(168, 85, 247, 0.4); /* Purple glow */
		--shadow-success: 0 0 20px rgba(52, 211, 153, 0.4); /* Green glow */

		/* ============ DARK MODE GRADIENTS - RICH ============ */
		--gradient-brand: linear-gradient(
			135deg,
			#ff6b4a 0%,
			#ff8566 50%,
			#ff5a36 100%
		);
		--gradient-xp: linear-gradient(
			135deg,
			#a78bfa 0%,
			#c4b5fd 50%,
			#8b5cf6 100%
		);
		--gradient-gold: linear-gradient(
			135deg,
			#fbbf24 0%,
			#fcd34d 50%,
			#f59e0b 100%
		);
		--gradient-streak: linear-gradient(
			135deg,
			#fb923c 0%,
			#fdba74 50%,
			#f97316 100%
		);
		--gradient-success: linear-gradient(135deg, #34d399 0%, #6ee7b7 100%);
		--gradient-cool: linear-gradient(
			135deg,
			#2dd4bf 0%,
			#5eead4 50%,
			#22d3ee 100%
		);
		--gradient-warm: linear-gradient(
			135deg,
			#ff6b4a 0%,
			#fb923c 50%,
			#fbbf24 100%
		);
		--gradient-party: linear-gradient(
			135deg,
			#f472b6 0%,
			#c084fc 50%,
			#818cf8 100%
		);
		--gradient-primary: var(--gradient-brand);
		--gradient-sunset: var(--gradient-warm);

		/* Celebration - Deep & Festive */
		--gradient-celebration: linear-gradient(
			135deg,
			#1e1b4b 0%,
			#4c1d95 50%,
			#7c3aed 100%
		);
		--gradient-celebration-alt: linear-gradient(
			135deg,
			#0f172a 0%,
			#581c87 50%,
			#a855f7 100%
		);
	}

	/* Dark Mode Image Filtering - Enhance vibrancy */
	img:not([class*='avatar']):not([class*='profile']),
	video {
		filter: brightness(0.98) contrast(1.08) saturate(1.1);
	}
}

@theme inline {
	/* ============ BRAND COLORS ============ */
	--color-brand: var(--color-brand);
	--color-brand-hover: var(--color-brand-hover);
	--color-brand-subtle: var(--color-brand-subtle);

	/* ============ SEMANTIC COLORS ============ */
	--color-success: var(--color-success);
	--color-warning: var(--color-warning);
	--color-error: var(--color-error);
	--color-info: var(--color-info);
	--color-streak: var(--color-streak);
	--color-streak-urgent: var(--color-streak-urgent);

	/* ============ BACKGROUND COLORS ============ */
	--color-bg: var(--bg);
	--color-bg-page: var(--bg-page);
	--color-bg-card: var(--bg-card);
	--color-bg-elevated: var(--bg-elevated);
	--color-bg-hover: var(--bg-hover);
	--color-bg-input: var(--bg-input);

	/* ============ TEXT COLORS ============ */
	--color-text: var(--text);
	--color-text-primary: var(--text-primary);
	--color-text-secondary: var(--text-secondary);
	--color-text-tertiary: var(--text-tertiary);
	--color-text-muted: var(--text-muted);

	/* ============ BORDER COLORS ============ */
	--color-border: var(--border-color);
	--color-border-subtle: var(--border-subtle);
	--color-border-medium: var(--border-medium);
	--color-border-strong: var(--border-strong);

	/* ============ LEGACY COMPATIBILITY ============ */
	--color-background: var(--bg);
	--color-foreground: var(--text);
	--color-ring: var(--focus);
	--color-panel-bg: var(--panel-bg);
	--color-muted: var(--muted);
	--color-muted-strong: var(--muted-strong);
	--color-muted-foreground: var(--muted-foreground);

	/* Brand colors (legacy) */
	--color-primary: var(--color-brand);
	--color-primary-dark: var(--color-brand-hover);
	--color-primary-light: var(--color-brand);
	--color-primary-foreground: #ffffff;

	--color-accent: var(--color-brand);
	--color-accent-light: var(--color-brand-subtle);
	--color-accent-strong: var(--color-brand-hover);
	--color-accent-foreground: var(--text);

	--color-mint: var(--color-success);
	--color-gold: var(--color-warning);

	/* Surface colors */
	--color-card: var(--bg-card);
	--color-card-foreground: var(--text);
	--color-popover: var(--bg-elevated);
	--color-popover-foreground: var(--text);

	/* Semantic colors (legacy) */
	--color-destructive: var(--color-error);
	--color-destructive-foreground: #ffffff;
	--color-secondary: var(--bg-elevated);
	--color-secondary-foreground: var(--text-primary);

	/* Effects */
	--blur-sm: var(--blur-sm);
	--blur-md: var(--blur-md);
	--blur-lg: var(--blur-lg);
	--saturate: var(--saturate);

	/* Typography */
	--font-sans: var(--font-family);
	--font-mono: var(--font-geist-mono);
	--font-display: var(--font-display);

	/* Border radius */
	--radius: var(--radius);
	--radius-sm: var(--radius-sm);
	--radius-md: var(--radius);
	--radius-lg: var(--radius-lg);
	--radius-xl: calc(var(--radius-lg) + 4px);

	/* Font sizes - Map to text-* utilities */
	--font-size-xs: var(--font-size-xs);
	--font-size-sm: var(--font-size-sm);
	--font-size-base: var(--font-size-base);
	--font-size-lg: var(--font-size-lg);
	--font-size-xl: var(--font-size-xl);
	--font-size-2xl: var(--font-size-2xl);

	/* Shadows - Map to shadow-* utilities */
	--shadow-sm: var(--shadow-sm);
	--shadow-md: var(--shadow-md);
	--shadow-lg: var(--shadow-lg);
	--shadow-glow: var(--shadow-glow);

	/* Drop shadows for filters */
	--drop-shadow-glow: drop-shadow(0 0 8px rgba(102, 126, 234, 0.5));

	/* Spacing Scale - Based on 4px base (Tailwind default: 0.25rem) */
	/* Maps to: p-*, m-*, gap-*, space-*, w-*, h-*, max-w-*, max-h-*, min-w-*, min-h-* */
	--spacing-0: 0px;
	--spacing-px: 1px;
	--spacing-0_5: 0.125rem; /* 2px */
	--spacing-1: 0.25rem; /* 4px */
	--spacing-1_5: 0.375rem; /* 6px */
	--spacing-2: 0.5rem; /* 8px */
	--spacing-2_5: 0.625rem; /* 10px */
	--spacing-3: 0.75rem; /* 12px */
	--spacing-3_5: 0.875rem; /* 14px */
	--spacing-4: 1rem; /* 16px */
	--spacing-5: 1.25rem; /* 20px */
	--spacing-6: 1.5rem; /* 24px */
	--spacing-7: 1.75rem; /* 28px */
	--spacing-8: 2rem; /* 32px */
	--spacing-9: 2.25rem; /* 36px */
	--spacing-10: 2.5rem; /* 40px */
	--spacing-11: 2.75rem; /* 44px */
	--spacing-12: 3rem; /* 48px */
	--spacing-14: 3.5rem; /* 56px */
	--spacing-16: 4rem; /* 64px */
	--spacing-18: 4.5rem; /* 72px */
	--spacing-20: 5rem; /* 80px */
	--spacing-24: 6rem; /* 96px */
	--spacing-28: 7rem; /* 112px */
	--spacing-32: 8rem; /* 128px */
	--spacing-36: 9rem; /* 144px */
	--spacing-40: 10rem; /* 160px */
	--spacing-44: 11rem; /* 176px */
	--spacing-48: 12rem; /* 192px */
	--spacing-52: 13rem; /* 208px */
	--spacing-56: 14rem; /* 224px */
	--spacing-60: 15rem; /* 240px */
	--spacing-64: 16rem; /* 256px */
	--spacing-72: 18rem; /* 288px */
	--spacing-80: 20rem; /* 320px */
	--spacing-96: 24rem; /* 384px */

	/* Container sizes - For max-w-* utilities */
	--container-sm: 24rem; /* 384px */
	--container-md: 28rem; /* 448px */
	--container-lg: 50rem; /* 800px - Main feed width */
	--container-xl: 36rem; /* 576px */
	--container-2xl: 42rem; /* 672px */
	--container-3xl: 48rem; /* 768px */
	--container-4xl: 56rem; /* 896px */
	--container-5xl: 64rem; /* 1024px */
	--container-6xl: 72rem; /* 1152px */
	--container-7xl: 80rem; /* 1280px */
}

/* Note: Gradient utilities are defined via @utility directives at the end of this file */
/* This ensures proper Tailwind v4 CSS-first compilation */

/* ===================================
   GLOBAL RESETS & BASE STYLES
   =================================== */

/* ============ MINIMAL GLOBAL RESETS (Don't override component styles!) ============ */
* {
	box-sizing: border-box;
}

html,
body {
	height: 100%;
	scroll-behavior: smooth;
}

body {
	margin: 0;
	padding: 0;
	font-family: var(--font-family);
	background: var(--bg-page);
	/* Removed warm beige gradient overlay - clean white/dark background */
	color: var(--text);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	line-height: 1.5;
}

html {
	font-size: 16px;
}

/* Typography utilities (use these explicitly, don't force globally) */
.heading-1 {
	font-size: var(--font-size-2xl);
	font-weight: var(--font-weight-bold);
	line-height: 1.2;
}

.heading-2 {
	font-size: var(--font-size-xl);
	font-weight: var(--font-weight-bold);
	line-height: 1.2;
}

.heading-3 {
	font-size: var(--font-size-lg);
	font-weight: var(--font-weight-bold);
	line-height: 1.2;
}

/* Focus styles - Clean and minimal */
:focus-visible {
	outline: none;
}

/* Remove autofill background colors */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
	-webkit-box-shadow: 0 0 0 30px var(--bg-card) inset !important;
	-webkit-text-fill-color: var(--text-primary) !important;
}

/* Remove all default input styling */
input[type='text'],
input[type='search'],
input[type='email'],
input[type='password'],
textarea {
	border: none !important;
	box-shadow: none !important;
}

input[type='text']:focus,
input[type='search']:focus,
input[type='email']:focus,
input[type='password']:focus,
textarea:focus {
	border: none !important;
	box-shadow: none !important;
	outline: none !important;
}

a {
	color: inherit;
	text-decoration: none;
}

img {
	max-width: 100%;
	display: block;
}

/* Fallback for broken images */
img[alt]:after {
	content: '🍳 ' attr(alt);
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-elevated);
	color: var(--text-muted);
	font-size: 0.75rem;
	text-align: center;
	padding: 1rem;
}

/* ============ CUSTOM SCROLLBAR - BRAND ACCENT ============ */
::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

::-webkit-scrollbar-track {
	background: var(--bg);
	border-radius: 8px;
}

::-webkit-scrollbar-thumb {
	background: linear-gradient(
		135deg,
		var(--color-brand) 0%,
		var(--color-brand-hover) 100%
	);
	border-radius: 8px;
	border: 2px solid var(--bg);
}

::-webkit-scrollbar-thumb:hover {
	background: var(--color-brand-hover);
	transform: scale(1.05);
}

/* ============ UTILITY CLASSES ============ */
.muted {
	color: var(--muted);
}

.text-center {
	text-align: center;
}

.font-bold {
	font-weight: var(--font-weight-bold);
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

/* ============ MICRO-INTERACTIONS & POLISH ============ */
@keyframes shimmer {
	0% {
		background-position: -1000px 0;
	}
	100% {
		background-position: 1000px 0;
	}
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-10px);
	}
}

@keyframes glow-pulse {
	0%,
	100% {
		box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
	}
	50% {
		box-shadow: 0 0 35px rgba(255, 107, 53, 0.5);
	}
}

.animate-shimmer {
	animation: shimmer 3s infinite linear;
}

.animate-float {
	animation: float 3s ease-in-out infinite;
}

.animate-glow-pulse {
	animation: glow-pulse 2s ease-in-out infinite;
}

/* Smooth transitions for all interactive elements */
button,
a,
input,
textarea,
select {
	transition: all 0.2s var(--transition-ease);
}

/* Elegant hover lift for cards */
.card-hover {
	transition:
		transform 0.3s var(--transition-ease),
		box-shadow 0.3s var(--transition-ease);
}

.card-hover:hover {
	transform: translateY(-4px);
	box-shadow: var(--shadow-warm);
}

/* ============ REDUCED MOTION ============ */
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}

	/* Exception: Loading spinners should still animate for UX clarity */
	.animate-spin {
		animation-duration: 1s !important;
		animation-iteration-count: infinite !important;
	}
}

/* ============ LAYOUT UTILITIES ============ */
/* Force correct container width (browser cache buster) */
.max-w-container-lg {
	max-width: 850px !important;
	max-width: 53.125rem !important;
}

/* Scrollbar styling for main content area */
.scroll-smooth {
	scroll-behavior: smooth;
}

/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
	width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: var(--border-subtle);
	border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: var(--border-medium);
}

/* Firefox scrollbar */
.overflow-y-auto {
	scrollbar-width: thin;
	scrollbar-color: var(--border-subtle) transparent;
}

/* Hide scrollbar for webkit browsers but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

/* Removed @layer base - it was overriding component styles globally */
/* Let components handle their own borders and outlines */

/* ============================================
   CUSTOM GRADIENT UTILITIES
   Direct CSS utilities for Tailwind v4
   ============================================ */

@utility bg-gradient-brand {
	background-image: linear-gradient(
		135deg,
		#ff5a36 0%,
		#ff7849 50%,
		#e64a2e 100%
	);
}

/* Alias for bg-gradient-brand - widely used as primary action gradient */
@utility bg-gradient-primary {
	background-image: linear-gradient(
		135deg,
		#ff5a36 0%,
		#ff7849 50%,
		#e64a2e 100%
	);
}

@utility bg-gradient-hero {
	background-image: linear-gradient(
		135deg,
		#ff5a36 0%,
		#c084fc 50%,
		#a855f7 100%
	);
}

@utility bg-gradient-indigo {
	background-image: linear-gradient(
		135deg,
		#6366f1 0%,
		#8b5cf6 50%,
		#a855f7 100%
	);
}

@utility bg-gradient-xp {
	background-image: linear-gradient(
		135deg,
		#a855f7 0%,
		#c084fc 50%,
		#8b5cf6 100%
	);
}

/* Social/Community gradient - vibrant purple-to-pink for high visibility */
@utility bg-gradient-social {
	background-image: linear-gradient(
		135deg,
		#8b5cf6 0%,
		#a855f7 50%,
		#d946ef 100%
	);
}

@utility bg-gradient-streak {
	background-image: linear-gradient(
		135deg,
		#f97316 0%,
		#fb923c 50%,
		#ea580c 100%
	);
}

@utility bg-gradient-gold {
	background-image: linear-gradient(
		135deg,
		#f59e0b 0%,
		#fbbf24 50%,
		#eab308 100%
	);
}

@utility bg-gradient-success {
	background-image: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

@utility bg-gradient-warm {
	background-image: linear-gradient(
		135deg,
		#ff5a36 0%,
		#f97316 50%,
		#f59e0b 100%
	);
}

@utility bg-gradient-cool {
	background-image: linear-gradient(
		135deg,
		#14b8a6 0%,
		#2dd4bf 50%,
		#06b6d4 100%
	);
}

@utility bg-gradient-ocean {
	background-image: linear-gradient(
		135deg,
		#3b82f6 0%,
		#60a5fa 50%,
		#14b8a6 100%
	);
}

@utility bg-gradient-party {
	background-image: linear-gradient(
		135deg,
		#ec4899 0%,
		#a855f7 50%,
		#6366f1 100%
	);
}

@utility bg-gradient-celebration {
	background-image: linear-gradient(
		135deg,
		#1e1b4b 0%,
		#312e81 50%,
		#4c1d95 100%
	);
}

@utility bg-gradient-celebration-alt {
	background-image: linear-gradient(
		135deg,
		#0f172a 0%,
		#1e1b4b 50%,
		#581c87 100%
	);
}
```


---

# 5TPROMART-FE

## `5TProMart-fe\src\App.tsx`

```tsx
import "./App.css";
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { ROUTES } from "./constants";
import StaffPage from "./pages/StaffPage";
import SchedulePage from "./pages/SchedulePage";
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import PurchasePage from "./pages/PurchasePage";
import PromotionPage from "./pages/PromotionPage";
import { ReportsPage } from "./pages/ReportsPage";
import CustomersPage from "./pages/CustomersPage";
import SupplierPage from "./pages/SupplierPage";
import ExpensesPage from "./pages/ExpensesPage";
import CategoryPage from "./pages/CategoryPage";
import { AuthProvider } from "./contexts/AuthContext";
import { TokenRefreshProvider } from "./components/providers/TokenRefreshProvider";
import { ErrorBoundary } from "./components/common";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
	return (
		<Router>
			<ErrorBoundary>
				<AuthProvider>
					<TokenRefreshProvider>
						<Routes>
							<Route
								path={ROUTES.LOGIN}
								element={<LoginPage />}
							/>
							<Route
								path={ROUTES.HOME}
								element={
									<ProtectedRoute>
										<HomePage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.DASHBOARD}
								element={
									<ProtectedRoute module="dashboard">
										<DashboardPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.STAFF}
								element={
									<ProtectedRoute module="staff">
										<StaffPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.SCHEDULE}
								element={
									<ProtectedRoute module="schedule">
										<SchedulePage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.SALES}
								element={
									<ProtectedRoute module="sales">
										<SalesPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.INVENTORY}
								element={
									<ProtectedRoute module="inventory">
										<InventoryPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.CATEGORIES}
								element={
									<ProtectedRoute module="categories">
										<CategoryPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.PURCHASE}
								element={
									<ProtectedRoute module="purchase">
										<PurchasePage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.PROMOTIONS}
								element={
									<ProtectedRoute module="promotions">
										<PromotionPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.REPORTS}
								element={
									<ProtectedRoute module="reports">
										<ReportsPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.CUSTOMERS}
								element={
									<ProtectedRoute module="customers">
										<CustomersPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.SUPPLIERS}
								element={
									<ProtectedRoute module="suppliers">
										<SupplierPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path={ROUTES.EXPENSES}
								element={
									<ProtectedRoute module="expenses">
										<ExpensesPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="*"
								element={
									<Navigate
										to={ROUTES.HOME}
										replace
									/>
								}
							/>
						</Routes>
					</TokenRefreshProvider>
				</AuthProvider>
			</ErrorBoundary>
		</Router>
	);
}

export default App;
```

## `5TProMart-fe\src\components\layout\MainLayout.tsx`

```tsx
import { useThemeGradients } from "@/styles/themeUtils";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

const MainLayout = ({ children, showSidebar = true }: any) => {
	const { mainBgGradient: bgGradient } = useThemeGradients();
	return (
		<SidebarProvider>
			<Flex
				w="100%"
				h="100vh"
				overflow="hidden"
				bgGradient={bgGradient}>
				{showSidebar && <Sidebar />}
				<Flex
					direction="column"
					flex="1"
					overflow="hidden">
					<Box
						as="main"
						flex="1"
						overflowY="auto"
						px={6}
						py={0}>
						{children}
					</Box>
				</Flex>
			</Flex>
		</SidebarProvider>
	);
};

export default MainLayout;
```

## `5TProMart-fe\src\components\layout\Sidebar.tsx`

```tsx
import { useMemo } from "react";
import { Flex, VStack, IconButton, Tooltip } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarItem } from "./SidebarItem";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { UpcomingShifts } from "./UpcomingShifts";
import { navItems } from "./sidebarConfig";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useInventoryAlerts } from "@/hooks";
import {
	useSidebar,
	SIDEBAR_WIDTH_EXPANDED,
	SIDEBAR_WIDTH_COLLAPSED,
} from "@/contexts/SidebarContext";
import type { NavItem } from "@/types/layout";

function Sidebar() {
	const location = useLocation();
	const { user, logout } = useAuth();
	const { hasAccess } = usePermissions();
	const { criticalCount, warningCount } = useInventoryAlerts();
	const { isCollapsed, toggleSidebar } = useSidebar();

	const isActivePath = (path: string) => location.pathname === path;

	// Filter nav items based on permissions and inject dynamic badges
	const navItemsWithBadges: NavItem[] = useMemo(() => {
		return (
			navItems
				.filter((item) => {
					// If item has a module requirement, check permission
					if (item.module) {
						return hasAccess(item.module);
					}
					// Items without module requirement are always visible
					return true;
				})
				.map((item) => {
					// Add badge to inventory page for critical/warning alerts
					if (item.path === "/inventory") {
						const totalAlerts = criticalCount + warningCount;
						if (totalAlerts > 0) {
							return {
								...item,
								badge: {
									count: totalAlerts,
									// Red for critical, orange if only warnings
									colorScheme:
										criticalCount > 0 ? "red" : "orange",
								},
							};
						}
					}
					return item;
				})
		);
	}, [criticalCount, warningCount, hasAccess]);

	return (
		<Flex
			direction="column"
			w={
				isCollapsed
					? `${SIDEBAR_WIDTH_COLLAPSED}px`
					: `${SIDEBAR_WIDTH_EXPANDED}px`
			}
			h="100vh"
			bg="brand.500"
			position="relative"
			top={0}
			overflow="hidden"
			transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
			shadow="xl"
			borderRight="1px solid"
			borderColor="rgba(187, 214, 255, 0.1)">
			{/* Logo Section */}
			<SidebarLogo isCollapsed={isCollapsed} />

			{/* User Profile */}
			{user && (
				<SidebarUserProfile
					user={user}
					isCollapsed={isCollapsed}
				/>
			)}

			{/* Header Icons */}
			<SidebarHeader
				onLogout={logout}
				isCollapsed={isCollapsed}
			/>

			{/* Toggle Button - Below Header */}
			<Flex
				justify={isCollapsed ? "center" : "flex-end"}
				px={isCollapsed ? 2 : 4}
				py={1}
				borderColor="rgba(187, 214, 255, 0.1)">
				<Tooltip
					label={isCollapsed ? "Mở rộng" : "Thu gọn"}
					placement="right"
					hasArrow>
					<IconButton
						aria-label="Toggle sidebar"
						icon={
							isCollapsed ? (
								<ChevronRightIcon boxSize={5} />
							) : (
								<ChevronLeftIcon boxSize={5} />
							)
						}
						size="sm"
						variant="ghost"
						color="whiteAlpha.700"
						bg="rgba(255, 255, 255, 0.08)"
						borderRadius="md"
						_hover={{
							color: "white",
							bg: "rgba(255, 255, 255, 0.15)",
							transform: "scale(1.05)",
						}}
						_active={{
							bg: "rgba(255, 255, 255, 0.2)",
						}}
						transition="all 0.2s ease"
						onClick={toggleSidebar}
					/>
				</Tooltip>
			</Flex>

			{/* Navigation Sections */}
			<VStack
				flex={1}
				spacing={1}
				px={isCollapsed ? 2 : 4}
				py={3}
				align="stretch"
				overflowY="auto"
				css={{
					"&::-webkit-scrollbar": {
						width: "4px",
					},
					"&::-webkit-scrollbar-track": {
						background: "transparent",
					},
					"&::-webkit-scrollbar-thumb": {
						background: "rgba(187, 214, 255, 0.3)",
						borderRadius: "20px",
					},
				}}>
				{/* Navigation Items */}
				{navItemsWithBadges.map((item) => (
					<SidebarItem
						key={item.path}
						item={item}
						isActive={isActivePath(item.path)}
						isCollapsed={isCollapsed}
					/>
				))}
			</VStack>

			{/* Upcoming Shifts Section */}
			<UpcomingShifts isCollapsed={isCollapsed} />
		</Flex>
	);
}

export default Sidebar;
```

## `5TProMart-fe\src\components\layout\SidebarItem.tsx`

```tsx
import { Box, Flex, Text, Icon, Tooltip, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { NavItem } from "@/types/layout";

interface SidebarItemProps {
	item: NavItem;
	isActive: boolean;
	isCollapsed: boolean;
}

export function SidebarItem({ item, isActive, isCollapsed }: SidebarItemProps) {
	const hasBadge = item.badge && item.badge.count > 0;

	const content = (
		<Box
			as={Link}
			to={item.path}
			position="relative"
			py={isCollapsed ? 2 : 3}
			px={isCollapsed ? 2 : 3}
			borderRadius="lg"
			bg={isActive ? "rgba(255, 255, 255, 0.15)" : "transparent"}
			_hover={{
				textDecoration: "none",
				bg: isActive
					? "rgba(255, 255, 255, 0.2)"
					: "rgba(255, 255, 255, 0.1)",
				transform: "translateX(4px)",
			}}
			transition="all 0.2s"
			cursor="pointer">
			<Flex
				align="center"
				gap={3}
				justify={isCollapsed ? "center" : "flex-start"}
				position="relative">
				{/* Icon with badge overlay for collapsed state */}
				<Box position="relative">
					{item.icon && (
						<Icon
							as={item.icon}
							boxSize={isCollapsed ? 6 : 5}
							color={isActive ? "brand.100" : "white"}
							transition="all 0.2s"
						/>
					)}
					{/* Badge on icon when collapsed */}
					{hasBadge && isCollapsed && (
						<Badge
							position="absolute"
							top="-6px"
							right="-8px"
							colorScheme={item.badge?.colorScheme || "red"}
							borderRadius="full"
							minW="18px"
							h="18px"
							display="flex"
							alignItems="center"
							justifyContent="center"
							fontSize="10px"
							fontWeight="bold"
							border="2px solid"
							borderColor="brand.500">
							{item.badge!.count > 99 ? "99+" : item.badge!.count}
						</Badge>
					)}
				</Box>

				{/* Label */}
				{!isCollapsed && (
					<Text
						color={isActive ? "white" : "whiteAlpha.900"}
						fontSize="18px"
						fontWeight={isActive ? "700" : "500"}
						lineHeight="1.21"
						transition="all 0.2s"
						whiteSpace="nowrap"
						flex={1}>
						{item.label}
					</Text>
				)}

				{/* Badge when expanded - positioned at end */}
				{hasBadge && !isCollapsed && (
					<Badge
						colorScheme={item.badge?.colorScheme || "red"}
						borderRadius="full"
						minW="22px"
						h="22px"
						display="flex"
						alignItems="center"
						justifyContent="center"
						fontSize="11px"
						fontWeight="bold"
						ml="auto">
						{item.badge!.count > 99 ? "99+" : item.badge!.count}
					</Badge>
				)}
			</Flex>

			{/* Active Indicator - Left Border */}
			{isActive && !isCollapsed && (
				<Box
					position="absolute"
					left={0}
					top="50%"
					transform="translateY(-50%)"
					width="4px"
					height="60%"
					bg="brand.100"
					borderRadius="0 4px 4px 0"
					transition="all 0.3s"
				/>
			)}

			{/* Active Indicator Dot for Collapsed */}
			{isActive && isCollapsed && (
				<Box
					position="absolute"
					bottom="2px"
					left="50%"
					transform="translateX(-50%)"
					width="4px"
					height="4px"
					bg="brand.100"
					borderRadius="full"
					transition="all 0.3s"
				/>
			)}
		</Box>
	);

	if (isCollapsed) {
		return (
			<Tooltip
				label={item.label}
				placement="right"
				hasArrow>
				{content}
			</Tooltip>
		);
	}

	return content;
}
```

## `5TProMart-fe\src\components\layout\SidebarHeader.tsx`

```tsx
import { Flex, IconButton, Tooltip, Text } from "@chakra-ui/react";
import { IoMdExit } from "react-icons/io";

interface SidebarHeaderProps {
	onLogout: () => void;
	isCollapsed: boolean;
}

export function SidebarHeader({ onLogout, isCollapsed }: SidebarHeaderProps) {
	if (isCollapsed) {
		return (
			<Flex
				justify="center"
				align="center"
				px={2}
				py={3}
				borderColor="rgba(187, 214, 255, 0.2)">
				<Tooltip
					label="Đăng xuất"
					placement="right"
					hasArrow>
					<IconButton
						aria-label="Logout"
						icon={<IoMdExit size={20} />}
						size="md"
						variant="solid"
						bg="rgba(255, 99, 71, 0.2)"
						color="white"
						borderRadius="lg"
						border="1px solid"
						borderColor="rgba(255, 99, 71, 0.4)"
						_hover={{
							bg: "rgba(255, 99, 71, 0.4)",
							borderColor: "rgba(255, 99, 71, 0.6)",
							transform: "scale(1.1)",
							shadow: "0 0 15px rgba(255, 99, 71, 0.5)",
						}}
						_active={{
							transform: "scale(0.95)",
							bg: "rgba(255, 99, 71, 0.5)",
						}}
						transition="all 0.2s"
						onClick={onLogout}
					/>
				</Tooltip>
			</Flex>
		);
	}

	return (
		<Flex
			direction="column"
			gap={2}
			px={4}
			py={3}
			borderColor="rgba(187, 214, 255, 0.2)">
			<Tooltip
				label="Đăng xuất khỏi hệ thống"
				placement="right"
				hasArrow>
				<Flex
					as="button"
					align="center"
					justify="center"
					gap={2}
					w="full"
					py={2}
					px={3}
					bg="rgba(255, 99, 71, 0.2)"
					color="white"
					borderRadius="lg"
					border="1px solid"
					borderColor="rgba(255, 99, 71, 0.4)"
					cursor="pointer"
					_hover={{
						bg: "rgba(255, 99, 71, 0.4)",
						borderColor: "rgba(255, 99, 71, 0.6)",
						transform: "translateY(-2px)",
						shadow: "0 0 15px rgba(255, 99, 71, 0.5)",
					}}
					_active={{
						transform: "translateY(0)",
						bg: "rgba(255, 99, 71, 0.5)",
					}}
					transition="all 0.2s"
					onClick={onLogout}>
					<IoMdExit size={20} />
					<Text
						fontSize="sm"
						fontWeight="600">
						Đăng xuất
					</Text>
				</Flex>
			</Tooltip>
		</Flex>
	);
}
```

## `5TProMart-fe\src\components\layout\SidebarLogo.tsx`

```tsx
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import logoImg from "@/assets/logo/image.png";

interface SidebarLogoProps {
	isCollapsed: boolean;
}

export function SidebarLogo({ isCollapsed }: SidebarLogoProps) {
	return (
		<Flex
			direction="column"
			align="center"
			pt={4}
			pb={2}
			px={4}
			position="relative">
			{/* Logo Image */}
			<Box
				w={isCollapsed ? "40px" : "64px"}
				h={isCollapsed ? "33px" : "53px"}
				mb={isCollapsed ? 0 : 2}
				position="relative"
				overflow="hidden"
				transition="all 0.3s">
				<Image
					src={logoImg}
					alt="5T Mart Logo"
					w="100%"
					h="100%"
					objectFit="contain"
				/>
			</Box>

			{/* Brand Name */}
			{!isCollapsed && (
				<Text
					color="white"
					fontSize="17px"
					fontWeight="900"
					fontFamily="Kimberley, serif"
					lineHeight="1.21"
					whiteSpace="nowrap"
					opacity={isCollapsed ? 0 : 1}
					transition="opacity 0.2s">
					5TProMart
				</Text>
			)}
		</Flex>
	);
}
```

## `5TProMart-fe\src\components\layout\SidebarUserProfile.tsx`

```tsx
import { Box, Flex, Text, Avatar, Tooltip } from "@chakra-ui/react";

interface SidebarUserProfileProps {
	user: {
		fullName?: string;
		email?: string;
		accountType?: string;
	};
	isCollapsed: boolean;
}

export function SidebarUserProfile({
	user,
	isCollapsed,
}: SidebarUserProfileProps) {
	if (isCollapsed) {
		return (
			<Tooltip
				label={`${user.fullName} - ${user.accountType}`}
				placement="right"
				hasArrow>
				<Flex
					justify="center"
					px={4}
					py={3}>
					<Avatar
						size="sm"
						name={user.fullName || "User"}
						bg="brand.100"
						color="brand.500"
						w="40px"
						h="40px"
						cursor="pointer"
						transition="all 0.2s"
						_hover={{
							transform: "scale(1.1)",
							shadow: "md",
						}}
					/>
				</Flex>
			</Tooltip>
		);
	}

	return (
		<Flex
			align="center"
			px={4}
			py={3}
			gap={3}
			bg="rgba(255, 255, 255, 0.05)"
			borderRadius="md"
			mx={2}
			transition="all 0.2s"
			_hover={{
				bg: "rgba(255, 255, 255, 0.1)",
			}}>
			{/* Avatar */}
			<Avatar
				size="md"
				name={user.fullName || "User"}
				bg="brand.100"
				color="brand.500"
				w="45px"
				h="45px"
			/>

			{/* User Info */}
			<Box flex="1">
				<Text
					color="whiteAlpha.800"
					fontSize="14px"
					fontWeight="400"
					lineHeight="1.21">
					Xin chào,
				</Text>
				<Text
					color="white"
					fontSize="18px"
					fontWeight="600"
					lineHeight="1.21"
					noOfLines={1}>
					{user.fullName || "Người dùng"}
				</Text>
				{/* Role với underline màu xanh */}
				{user.accountType && (
					<Box mt={1}>
						<Text
							color="brand.100"
							fontSize="14px"
							fontWeight="700"
							lineHeight="1.21"
							noOfLines={1}>
							{user.accountType}
						</Text>
					</Box>
				)}
			</Box>
		</Flex>
	);
}
```

## `5TProMart-fe\src\components\layout\sidebarConfig.ts`

```typescript
import type { NavItem } from "@/types/layout";
import {
	FiActivity,
	FiUsers,
	FiCalendar,
	FiShoppingCart,
	FiPackage,
	FiTruck,
	FiBarChart2,
	FiUserCheck,
	FiGift,
	FiBox,
	FiAlertCircle,
	FiGrid,
} from "react-icons/fi";

export const navItems: NavItem[] = [
	{
		label: "Tổng quan",
		path: "/dashboard",
		icon: FiActivity,
		module: "dashboard",
	},
	{
		label: "Bán hàng",
		path: "/sales",
		icon: FiShoppingCart,
		module: "sales",
	},
	{
		label: "Hàng hóa",
		path: "/inventory",
		icon: FiPackage,
		module: "inventory",
	},
	{
		label: "Danh mục",
		path: "/categories",
		icon: FiGrid,
		module: "categories",
	},
	{
		label: "Nhập hàng",
		path: "/purchase",
		icon: FiTruck,
		module: "purchase",
	},
	{
		label: "Nhà cung cấp",
		path: "/suppliers",
		icon: FiBox,
		module: "suppliers",
	},
	{
		label: "Khuyến mãi",
		path: "/promotions",
		icon: FiGift,
		module: "promotions",
	},
	{
		label: "Nhân sự",
		path: "/staff",
		icon: FiUsers,
		module: "staff",
	},
	{
		label: "Ca làm",
		path: "/schedule",
		icon: FiCalendar,
		module: "schedule",
	},
	{
		label: "Báo cáo",
		path: "/reports",
		icon: FiBarChart2,
		module: "reports",
	},
	{
		label: "Chi phí",
		path: "/expenses",
		icon: FiAlertCircle,
		module: "expenses",
	},
	{
		label: "Khách hàng",
		path: "/customers",
		icon: FiUserCheck,
		module: "customers",
	},
];
```

## `5TProMart-fe\src\components\layout\UpcomingShifts.tsx`

```tsx
import { useState, useEffect } from "react";
import {
	Box,
	VStack,
	Text,
	HStack,
	Badge,
	Icon,
	Collapse,
	Tooltip,
	Spinner,
} from "@chakra-ui/react";
import { LockIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { MdCalendarToday } from "react-icons/md";
import { scheduleService } from "@/services/scheduleService";
import { useAuthStore } from "@/store/authStore";

interface UpcomingShift {
	id: string;
	date: string;
	dayOfWeek: string;
	shiftName: string;
	startTime: string;
	endTime: string;
	status: "upcoming" | "today";
}

interface UpcomingShiftsProps {
	isCollapsed: boolean;
}

export function UpcomingShifts({ isCollapsed }: UpcomingShiftsProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [shifts, setShifts] = useState<UpcomingShift[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const user = useAuthStore((state) => state.user);

	// Helper: Format date to dd-MM-yyyy
	const formatDateForAPI = (date: Date): string => {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	// Helper: Format date to display format (dd/MM)
	const formatDateForDisplay = (dateStr: string): string => {
		const date = new Date(dateStr);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		return `${day}/${month}`;
	};

	// Helper: Get day of week in Vietnamese
	const getDayOfWeek = (dateStr: string): string => {
		const date = new Date(dateStr);
		const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
		return days[date.getDay()];
	};

	// Helper: Parse dd-MM-yyyy to yyyy-MM-dd
	const parseDateFromAPI = (dateStr: string): string => {
		// Check if already in ISO format (yyyy-MM-dd)
		if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
			return dateStr;
		}

		// Parse dd-MM-yyyy format
		const parts = dateStr.split("-");
		if (parts.length === 3) {
			const [day, month, year] = parts;
			return `${year}-${month}-${day}`;
		}

		// Fallback: return as is
		return dateStr;
	};

	useEffect(() => {
		const fetchShifts = async () => {
			// Only fetch if user is logged in
			if (!user?.profileId) {
				setIsLoading(false);
				setShifts([]);
				return;
			}

			setIsLoading(true);
			try {
				const today = new Date();
				const endDate = new Date();
				endDate.setDate(today.getDate() + 7); // Get next 7 days
				console.log(formatDateForAPI(today));
				console.log(formatDateForAPI(endDate));

				const result = await scheduleService.getWorkSchedules({
					profileId: "8945d55b-b1f3-4794-bb76-5e9182235711",
					startDate: formatDateForAPI(today),
					endDate: formatDateForAPI(endDate),
				});

				console.log(result);

				if (result.success && result.data) {
					// Transform WorkScheduleResponse[] to UpcomingShift[]
					const todayStr = today.toISOString().split("T")[0];

					const upcomingShifts: UpcomingShift[] = result.data
						.map((schedule: any) => {
							const workDate = parseDateFromAPI(
								schedule.workDate,
							);
							const isToday = workDate === todayStr;

							return {
								id: schedule.id,
								date: formatDateForDisplay(workDate),
								dayOfWeek: getDayOfWeek(workDate),
								shiftName: schedule.shiftName,
								startTime: schedule.startTime,
								endTime: schedule.endTime,
								status: isToday
									? ("today" as const)
									: ("upcoming" as const),
								_sortDate: workDate, // For sorting
							};
						})
						.sort((a: any, b: any) =>
							a._sortDate.localeCompare(b._sortDate),
						)
						.map(({ _sortDate, ...shift }: any) => shift); // Remove sort field

					setShifts(upcomingShifts);
				} else {
					// API call failed - show empty state
					setShifts([]);
				}
			} catch (error) {
				console.error("Error fetching upcoming shifts:", error);
				// API not yet available - show empty state
				setShifts([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchShifts();
	}, [user?.profileId]);

	const nearestShift = shifts[0];

	// Loading state
	if (isLoading) {
		return (
			<Box
				px={3}
				py={3}
				borderTop="1px solid"
				borderColor="rgba(187, 214, 255, 0.1)">
				{isCollapsed ? (
					<Spinner
						size="xs"
						color="whiteAlpha.500"
						mx="auto"
						display="block"
					/>
				) : (
					<HStack spacing={2}>
						<Spinner
							size="xs"
							color="whiteAlpha.500"
						/>
						<Text
							fontSize="xs"
							color="whiteAlpha.500">
							Đang tải...
						</Text>
					</HStack>
				)}
			</Box>
		);
	}

	// Empty state - no shifts available or API not implemented
	if (shifts.length === 0) {
		return (
			<Box
				px={3}
				py={3}
				borderTop="1px solid"
				borderColor="rgba(187, 214, 255, 0.1)">
				{isCollapsed ? (
					<Tooltip
						label="Không có ca làm sắp tới"
						placement="right"
						hasArrow>
						<Box>
							<Icon
								as={MdCalendarToday}
								boxSize={5}
								color="whiteAlpha.400"
								mx="auto"
								display="block"
							/>
						</Box>
					</Tooltip>
				) : (
					<HStack spacing={2}>
						<Icon
							as={MdCalendarToday}
							boxSize={4}
							color="whiteAlpha.400"
						/>
						<Text
							fontSize="xs"
							color="whiteAlpha.500">
							Không có ca làm sắp tới
						</Text>
					</HStack>
				)}
			</Box>
		);
	}

	// When sidebar is collapsed - show only icon
	if (isCollapsed) {
		return (
			<Tooltip
				label={`${nearestShift.shiftName}: ${nearestShift.startTime}-${nearestShift.endTime}`}
				placement="right"
				hasArrow>
				<Box
					px={2}
					py={3}
					borderTop="1px solid"
					borderColor="rgba(187, 214, 255, 0.1)"
					cursor="pointer"
					_hover={{ bg: "rgba(255, 255, 255, 0.08)" }}
					transition="all 0.2s">
					<Icon
						as={MdCalendarToday}
						boxSize={5}
						color={
							nearestShift.status === "today"
								? "green.300"
								: "blue.300"
						}
						mx="auto"
						display="block"
					/>
				</Box>
			</Tooltip>
		);
	}

	// When sidebar is expanded - collapsible notification style
	return (
		<Box
			borderTop="1px solid"
			borderColor="rgba(187, 214, 255, 0.1)">
			{/* Header - Click to toggle */}
			<HStack
				px={3}
				py={2}
				spacing={2}
				cursor="pointer"
				onClick={() => setIsExpanded(!isExpanded)}
				_hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
				transition="all 0.2s">
				<Icon
					as={MdCalendarToday}
					boxSize={4}
					color="whiteAlpha.700"
				/>
				<Text
					fontSize="xs"
					fontWeight="600"
					color="whiteAlpha.800"
					flex={1}>
					Ca làm sắp tới
				</Text>
				<Badge
					colorScheme={
						nearestShift.status === "today" ? "green" : "blue"
					}
					fontSize="9px"
					px={1.5}
					py={0.5}
					borderRadius="full">
					{shifts.length}
				</Badge>
				<Icon
					as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
					boxSize={4}
					color="whiteAlpha.600"
				/>
			</HStack>

			{/* Collapsible content */}
			<Collapse
				in={isExpanded}
				animateOpacity>
				<VStack
					spacing={1.5}
					px={3}
					pb={2}
					align="stretch">
					{shifts.map((shift) => (
						<Box
							key={shift.id}
							p={2}
							bg={
								shift.status === "today"
									? "rgba(72, 187, 120, 0.12)"
									: "rgba(255, 255, 255, 0.06)"
							}
							borderRadius="md"
							borderLeft="2px solid"
							borderColor={
								shift.status === "today"
									? "green.400"
									: "blue.300"
							}
							transition="all 0.2s"
							_hover={{
								bg:
									shift.status === "today"
										? "rgba(72, 187, 120, 0.18)"
										: "rgba(255, 255, 255, 0.1)",
							}}>
							<HStack
								justify="space-between"
								mb={1}>
								<HStack spacing={2}>
									<Text
										fontSize="xs"
										fontWeight="600"
										color="whiteAlpha.900">
										{shift.dayOfWeek}
									</Text>
									{shift.status === "today" && (
										<Badge
											colorScheme="green"
											fontSize="8px"
											px={1.5}
											py={0.5}
											borderRadius="full">
											Hôm nay
										</Badge>
									)}
								</HStack>
								<Text
									fontSize="9px"
									color="whiteAlpha.600">
									{shift.date}
								</Text>
							</HStack>

							<HStack
								spacing={2}
								fontSize="xs"
								color="whiteAlpha.700">
								<Text
									fontWeight="500"
									color="whiteAlpha.900">
									{shift.shiftName}
								</Text>
								<Text>•</Text>
								<HStack spacing={1}>
									<LockIcon boxSize={2.5} />
									<Text>
										{shift.startTime}-{shift.endTime}
									</Text>
								</HStack>
							</HStack>
						</Box>
					))}
				</VStack>
			</Collapse>
		</Box>
	);
}
```

## `5TProMart-fe\src\components\layout\index.ts`

```typescript
export { default as Sidebar } from "./Sidebar";
export { SidebarLogo } from "./SidebarLogo";
export { SidebarItem } from "./SidebarItem";
export { SidebarHeader } from "./SidebarHeader";
export { SidebarUserProfile } from "./SidebarUserProfile";
export { navItems } from "./sidebarConfig";
```

## `5TProMart-fe\src\pages\LoginPage.tsx`

```tsx
import { useState } from "react";
import type { FormEvent } from "react";
import {
	Box,
	Container,
	VStack,
	Heading,
	Text,
	Link,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common";
import { PersonIcon, LockIcon } from "../components/icons/AuthIcons";
import { ForgotPasswordModal, TestAccountsHelper } from "../components/auth";
import { ROUTES } from "../constants";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { login, getUserDetail } = useAuth();
	const toast = useToast();

	const handleTestAccountSelect = (testUsername: string, testPassword: string) => {
		setUsername(testUsername);
		setPassword(testPassword);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Call authentication service
			await login({ username, password });

			// Get user details after login
			const userData = await getUserDetail();

			// Show success message
			toast({
				title: "Đăng nhập thành công",
				description: "Chào mừng bạn quay trở lại!",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});

			// Navigate based on user role
			const accountType = userData?.accountType;
			if (accountType === "WarehouseStaff") {
				navigate(ROUTES.INVENTORY);
			} else if (accountType === "SalesStaff") {
				navigate(ROUTES.SALES);
			} else {
				// Admin or default
				navigate(ROUTES.SALES);
			}
		} catch (error: any) {
			// Show error message
			toast({
				title: "Đăng nhập thất bại",
				description:
					error?.message || "Tên đăng nhập hoặc mật khẩu không đúng",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-right",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Hiển thị LoadingSpinner khi đang loading
	if (isLoading) {
		return (
			<LoadingSpinner
				size="xl"
				message="Đang đăng nhập..."
				minHeight="100vh"
				variant="primary"
			/>
		);
	}

	return (
		<Box
			h="100vh"
			w="100vw"
			display="flex"
			alignItems="center"
			justifyContent="center"
			bgGradient="linear(135deg, #E8F0FE 0%, #F8FBFF 50%, #FFF5F5 100%)"
			position="fixed"
			top={0}
			left={0}
			overflow="hidden"
			px={4}>
			<Container
				maxW={{ base: "100%", md: "480px", lg: "520px" }}
				py={{ base: 2, md: 3 }}
				maxH="100vh"
				overflow="hidden">
				<Box
					bg="rgba(255, 255, 255, 0.85)"
					backdropFilter="blur(20px)"
					borderRadius={{ base: "24px", md: "32px" }}
					boxShadow="0 8px 32px rgba(22, 31, 112, 0.08), 0 2px 8px rgba(22, 31, 112, 0.04)"
					p={{ base: 6, sm: 8, md: 10 }}
					border="1px solid"
					borderColor="rgba(255, 255, 255, 0.6)"
					transition="all 0.3s ease"
					_hover={{
						boxShadow:
							"0 12px 48px rgba(22, 31, 112, 0.12), 0 4px 12px rgba(22, 31, 112, 0.06)",
					}}>
					<VStack
						spacing={{ base: 4, sm: 5, md: 6 }}
						align="stretch">
						{/* Logo Section */}
						<VStack spacing={{ base: 2, md: 3 }}>
							<Box
								w={{ base: "80px", sm: "90px", md: "100px" }}
								h={{ base: "66px", sm: "75px", md: "83px" }}
								bgGradient="linear(135deg, brand.50 0%, #FFFFFF 100%)"
								borderRadius="xl"
								display="flex"
								alignItems="center"
								justifyContent="center"
								mx="auto"
								boxShadow="0 4px 16px rgba(22, 31, 112, 0.1)"
								border="2px solid"
								borderColor="rgba(22, 31, 112, 0.08)"
								transition="all 0.3s ease"
								_hover={{
									transform: "translateY(-2px)",
									boxShadow:
										"0 6px 24px rgba(22, 31, 112, 0.15)",
								}}>
								{/* Placeholder for logo image */}
								<Text
									fontSize={{
										base: "24px",
										sm: "28px",
										md: "32px",
									}}
									fontWeight="900"
									bgGradient="linear(135deg, brand.500 0%, brand.400 100%)"
									bgClip="text"
									lineHeight="1">
									5T
								</Text>
							</Box>
							<Text
								fontSize={{
									base: "22px",
									sm: "26px",
									md: "30px",
								}}
								fontWeight="800"
								bgGradient="linear(135deg, brand.500 0%, brand.400 100%)"
								bgClip="text"
								fontFamily="'Kimberley', 'Inter', sans-serif"
								textAlign="center"
								lineHeight="1.2"
								letterSpacing="tight">
								5T Mart
							</Text>
						</VStack>

						{/* Title */}
						<Heading
							fontSize={{
								base: "26px",
								sm: "30px",
								md: "34px",
								lg: "38px",
							}}
							fontWeight="700"
							color="brand.500"
							textAlign="center"
							lineHeight="1.2"
							mt={{ base: 1, md: 2 }}
							mb={{ base: 1, md: 2 }}>
							Đăng nhập
						</Heading>

						{/* Login Form */}
						<form onSubmit={handleSubmit}>
							<VStack
								spacing={{ base: 4, md: 5 }}
								align="stretch">
{/* Username Input */}
							<Input
								label="Tên đăng nhập"
								type="text"
								placeholder="admin"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
									leftIcon={<PersonIcon />}
									required
								/>

								{/* Password Input */}
								<Box position="relative">
									<Input
										label="Mật khẩu"
										type="password"
										placeholder="••••••"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										leftIcon={<LockIcon />}
										showPasswordToggle
										required
									/>
								</Box>

								{/* Login Button */}
								<Button
									type="submit"
									variant="primary"
									size="xl"
									fullWidth
									style={{ marginTop: "12px" }}>
									Đăng nhập
								</Button>

								{/* Forgot Password Link */}
								<Link
									href="#"
									color="brand.400"
									fontSize={{ base: "14px", md: "15px" }}
									fontWeight="500"
									textAlign="center"
									_hover={{
										color: "brand.500",
										textDecoration: "underline",
									}}
									transition="all 0.2s ease"
									onClick={(e) => {
										e.preventDefault();
										onOpen();
									}}>
									Quên mật khẩu?
								</Link>
							</VStack>
						</form>
					</VStack>
				</Box>
			</Container>

			{/* Test Accounts Helper (Dev Mode Only) */}
			<TestAccountsHelper onSelectAccount={handleTestAccountSelect} />

			{/* Forgot Password Modal */}
			<ForgotPasswordModal
				isOpen={isOpen}
				onClose={onClose}
			/>
		</Box>
	);
}
```

## `5TProMart-fe\src\pages\DashboardPage.tsx`

```tsx
import { Box, Heading, Text, Container, VStack, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Icon, HStack, Spinner, Center, Divider } from "@chakra-ui/react";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { inventoryService } from "@/services/inventoryService";
import { MdInventory, MdWarning, MdAccessTime, MdCheckCircle } from "react-icons/md";
import { AnalyticsSection } from "@/components/analytics";

const DashboardPage = () => {
	const [stats, setStats] = useState<{
		totalProducts: number;
		lowStockCount: number;
		expiringCount: number;
		inStockCount: number;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			setIsLoading(true);
			try {
				const data = await inventoryService.getStats();
				setStats(data as any);
			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
				setStats(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	return (
		<MainLayout>
			<Container
				maxW="7xl"
				py={8}>
				<VStack
					spacing={6}
					align="stretch">
					<Heading
						size="xl"
						color="brand.500">
						Quản lí
					</Heading>
					<Text
						fontSize="lg"
						color="gray.600">
						Chào mừng đến với hệ thống quản lý 5T Mart
					</Text>

					{isLoading ? (
						<Center py={12}>
							<Spinner size="xl" color="brand.500" thickness="4px" />
						</Center>
					) : stats ? (
						<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
							<Stat
								bg="white"
								p={6}
								borderRadius="xl"
								boxShadow="sm"
								borderLeft="4px solid"
								borderLeftColor="brand.500">
								<HStack spacing={3} mb={2}>
									<Icon as={MdInventory} boxSize={6} color="brand.500" />
									<StatLabel fontSize="sm" color="gray.600">Tổng sản phẩm</StatLabel>
								</HStack>
								<StatNumber fontSize="3xl" color="brand.600">{stats.totalProducts}</StatNumber>
								<StatHelpText color="gray.500">Trong kho</StatHelpText>
							</Stat>

							<Stat
								bg="white"
								p={6}
								borderRadius="xl"
								boxShadow="sm"
								borderLeft="4px solid"
								borderLeftColor="green.500">
								<HStack spacing={3} mb={2}>
									<Icon as={MdCheckCircle} boxSize={6} color="green.500" />
									<StatLabel fontSize="sm" color="gray.600">Còn hàng</StatLabel>
								</HStack>
								<StatNumber fontSize="3xl" color="green.600">{stats.inStockCount}</StatNumber>
								<StatHelpText color="gray.500">Sản phẩm</StatHelpText>
							</Stat>

							<Stat
								bg="white"
								p={6}
								borderRadius="xl"
								boxShadow="sm"
								borderLeft="4px solid"
								borderLeftColor="orange.500">
								<HStack spacing={3} mb={2}>
									<Icon as={MdWarning} boxSize={6} color="orange.500" />
									<StatLabel fontSize="sm" color="gray.600">Sắp hết hàng</StatLabel>
								</HStack>
								<StatNumber fontSize="3xl" color="orange.600">{stats.lowStockCount}</StatNumber>
								<StatHelpText color="gray.500">Cần nhập thêm</StatHelpText>
							</Stat>

							<Stat
								bg="white"
								p={6}
								borderRadius="xl"
								boxShadow="sm"
								borderLeft="4px solid"
								borderLeftColor="red.500">
								<HStack spacing={3} mb={2}>
									<Icon as={MdAccessTime} boxSize={6} color="red.500" />
									<StatLabel fontSize="sm" color="gray.600">Sắp hết hạn</StatLabel>
								</HStack>
								<StatNumber fontSize="3xl" color="red.600">{stats.expiringCount}</StatNumber>
								<StatHelpText color="gray.500">Cần xử lý</StatHelpText>
							</Stat>
						</SimpleGrid>
					) : (
						<Box
							bg="white"
							p={8}
							borderRadius="xl"
							boxShadow="md"
							textAlign="center">
							<Text color="gray.500">
								Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.
							</Text>
						</Box>
					)}

					{/* AI Analytics Section */}
					<Divider my={4} />
					
					<AnalyticsSection />
				</VStack>
			</Container>
		</MainLayout>
	);
};

export default DashboardPage;
```

## `5TProMart-fe\src\pages\HomePage.tsx`

```tsx
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	Button as ChakraButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";

const HomePage = () => {
	const navigate = useNavigate();

	return (
		<Box
			minH="100vh"
			bgGradient="linear(135deg, #E8F0FE 0%, #F8FBFF 50%, #FFF5F5 100%)"
			display="flex"
			alignItems="center"
			justifyContent="center"
			px={4}>
			<Container maxW="container.md">
				<Box
					bg="rgba(255, 255, 255, 0.85)"
					backdropFilter="blur(20px)"
					borderRadius="32px"
					boxShadow="0 8px 32px rgba(22, 31, 112, 0.08), 0 2px 8px rgba(22, 31, 112, 0.04)"
					p={{ base: 8, md: 12 }}
					border="1px solid"
					borderColor="rgba(255, 255, 255, 0.6)"
					textAlign="center">
					<VStack spacing={6}>
						<Heading
							fontSize={{ base: "32px", md: "42px" }}
							fontWeight="700"
							bgGradient="linear(135deg, brand.500 0%, brand.400 100%)"
							bgClip="text"
							letterSpacing="tight">
							Chào mừng đến với 5T Mart! 🎉
						</Heading>
						<Text
							fontSize={{ base: "16px", md: "18px" }}
							color="gray.600"
							fontWeight="500">
							Bạn đã đăng nhập thành công!
						</Text>
						<ChakraButton
							colorScheme="brand"
							size="lg"
							borderRadius="18px"
							mt={4}
							fontWeight="600"
							boxShadow="0 4px 14px rgba(22, 31, 112, 0.25)"
							_hover={{
								transform: "translateY(-2px)",
								boxShadow: "0 6px 20px rgba(22, 31, 112, 0.35)",
							}}
							transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
							onClick={() => navigate(ROUTES.LOGIN)}>
							Quay lại trang đăng nhập
						</ChakraButton>
					</VStack>
				</Box>
			</Container>
		</Box>
	);
};

export default HomePage;
```

## `5TProMart-fe\src\styles\theme.ts`

```typescript
import {extendTheme} from "@chakra-ui/react";

// Custom color palette - Based on Figma design
const colors = {
    brand: {
        50: "#D3E5FF",  // Lightest blue
        100: "#BBD6FF", // Light blue
        200: "#6890FF", // Medium light blue
        300: "#1728BC", // Medium blue
        400: "#1C2A93", // Medium dark blue
        500: "#161F70", // Primary brand color (dark blue)
        600: "#121959", // Darker
        700: "#0E1343", // Even darker
        800: "#0A0D2D", // Very dark
        900: "#050617", // Darkest
    },
    gray: {
        50: "#f7fafc",
        100: "#edf2f7",
        200: "#e2e8f0",
        300: "#C8C8C8", // From Figma
        400: "#a0aec0",
        500: "#718096",
        600: "#4a5568",
        700: "#2d3748",
        800: "#1a202c",
        900: "#171923",
    },
    success: {
        500: "#009781", // Green accent from Figma
    },
    error: {
        500: "#C90003", // Red accent from Figma
    },
};

// Custom fonts
const fonts = {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
    mono: `SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`,
};

// Custom component styles
const components = {
    Button: {
        baseStyle: {
            fontWeight: "semibold",
            borderRadius: "lg",
            _focus: {
                boxShadow: "outline",
            },
        },
        variants: {
            solid: {
                bg: "brand.500",
                color: "white",
                _hover: {
                    bg: "brand.600",
                    transform: "translateY(-1px)",
                    boxShadow: "lg",
                },
                _active: {
                    bg: "brand.700",
                    transform: "translateY(0)",
                },
            },
            outline: {
                borderColor: "brand.500",
                color: "brand.500",
                _hover: {
                    bg: "brand.50",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                },
            },
        },
        defaultProps: {
            colorScheme: "brand",
        },
    },
    Card: {
        baseStyle: {
            container: {
                borderRadius: "xl",
                boxShadow: "md",
                _hover: {
                    boxShadow: "lg",
                    transform: "translateY(-2px)",
                },
                transition: "all 0.2s",
            },
        },
    },
    Input: {
        variants: {
            filled: {
                field: {
                    bg: "gray.50",
                    borderRadius: "lg",
                    _hover: {
                        bg: "gray.100",
                    },
                    _focus: {
                        bg: "white",
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    },
                },
            },
        },
        defaultProps: {
            variant: "filled",
        },
    },
    FormLabel: {
        baseStyle: {
            fontWeight: "semibold",
            color: "gray.700",
        },
    },
};

// Global styles
const styles = {
    global: {
        body: {
            bg: "gray.50",
            color: "gray.800",
        },
        "*::placeholder": {
            color: "gray.400",
        },
        "*, *::before, *::after": {
            borderColor: "gray.200",
        },
    },
};

// Custom breakpoints
const breakpoints = {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
};

// Animation config
const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

// Custom spacing
const space = {
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
};

// Create and export the theme
const theme = extendTheme({
    colors,
    fonts,
    components,
    styles,
    breakpoints,
    config,
    space,
});

export default theme;
```

## `5TProMart-fe\src\styles\themeUtils.ts`

```typescript
import {useColorModeValue} from "@chakra-ui/react";

/**
 * Theme utility functions to prevent duplication of color mode values
 *
 * This module provides reusable theme utilities that abstract common
 * color mode values used throughout the application. Instead of duplicating
 * useColorModeValue calls in every component, use these utilities:
 *
 * - useThemeGradients() - for background gradients
 * - useThemeCards() - for card styling
 * - useThemeText() - for text colors
 * - useThemeValues() - combined utility with all values
 *
 * Example usage:
 * ```
 * import { useThemeValues } from '../styles';
 *
 * const MyComponent = () => {
 *   const { mainBgGradient, cardBg, cardShadow } = useThemeValues();
 *   // ...
 * }
 * ```
 */

// Common background gradients
export const useThemeGradients = () => {
    const mainBgGradient = useColorModeValue(
        "linear(to-br, blue.50, purple.50, pink.50)",
        "linear(to-br, gray.900, blue.900, purple.900)"
    );

    const subtleBgGradient = useColorModeValue(
        "linear(to-br, blue.50, purple.50)",
        "linear(to-br, gray.900, blue.900)"
    );

    return {
        mainBgGradient,
        subtleBgGradient,
    };
};

// Common card styling
export const useThemeCards = () => {
    const cardBg = useColorModeValue("white", "gray.800");
    const cardShadow = useColorModeValue("xl", "dark-lg");
    const cardBorder = useColorModeValue("gray.200", "gray.600");

    return {
        cardBg,
        cardShadow,
        cardBorder,
    };
};

// Common text colors
export const useThemeText = () => {
    const primaryText = useColorModeValue("gray.800", "white");
    const secondaryText = useColorModeValue("gray.600", "gray.300");
    const mutedText = useColorModeValue("gray.500", "gray.400");

    return {
        primaryText,
        secondaryText,
        mutedText,
    };
};

// Combined theme values for convenience
export const useThemeValues = () => {
    const gradients = useThemeGradients();
    const cards = useThemeCards();
    const text = useThemeText();

    return {
        ...gradients,
        ...cards,
        ...text,
    };
};
```

