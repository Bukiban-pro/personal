/**
 * AuthRequiredModal — Action-specific auth gate when unauthenticated user tries a protected action.
 *
 * Stolen from: Bookverse AuthRequiredModal — shows contextual message per action type
 * (favorite, review, purchase, etc.) instead of a generic "Please log in."
 *
 * Dependencies: @/components/ui/button, @/lib/utils (cn), lucide-react
 *
 * @example
 * <AuthRequiredModal
 *   isOpen={showAuthModal}
 *   onClose={() => setShowAuthModal(false)}
 *   action="favorite"
 *   onLogin={() => router.push('/login')}
 *   onSignUp={() => router.push('/signup')}
 * />
 */

'use client'

import { useEffect } from 'react'
import { Heart, MessageSquare, ShoppingCart, Star, Lock, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Action Configurations ──────────────────────────

interface ActionConfig {
  icon: LucideIcon
  title: string
  description: string
}

/** Customize per project — add/remove actions as needed. */
const ACTION_CONFIGS: Record<string, ActionConfig> = {
  favorite: {
    icon: Heart,
    title: 'Save your favorites',
    description: 'Sign in to save items to your wishlist and access them anytime.',
  },
  review: {
    icon: Star,
    title: 'Share your thoughts',
    description: 'Sign in to leave reviews and help others make better decisions.',
  },
  purchase: {
    icon: ShoppingCart,
    title: 'Ready to buy?',
    description: 'Sign in to complete your purchase and track your orders.',
  },
  comment: {
    icon: MessageSquare,
    title: 'Join the conversation',
    description: 'Sign in to post comments and interact with the community.',
  },
  default: {
    icon: Lock,
    title: 'Sign in required',
    description: 'You need to be signed in to perform this action.',
  },
}

// ─── Component ──────────────────────────────────────

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  /** Which action triggered the modal (customizes icon + copy). */
  action?: keyof typeof ACTION_CONFIGS | string
  onLogin: () => void
  onSignUp?: () => void
  className?: string
}

export function AuthRequiredModal({
  isOpen,
  onClose,
  action = 'default',
  onLogin,
  onSignUp,
  className,
}: AuthRequiredModalProps) {
  // Lock body scroll + handle Escape
  useEffect(() => {
    if (!isOpen) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = original
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const config = ACTION_CONFIGS[action] || ACTION_CONFIGS.default
  const Icon = config.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className={cn(
          'relative z-10 mx-4 w-full max-w-sm rounded-xl bg-background p-6 shadow-lg',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Icon className="size-7 text-primary" />
          </div>

          <h2 id="auth-modal-title" className="text-lg font-semibold">
            {config.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {config.description}
          </p>

          <div className="mt-6 flex w-full flex-col gap-2">
            <Button onClick={onLogin} className="w-full">
              Sign In
            </Button>
            {onSignUp && (
              <Button variant="outline" onClick={onSignUp} className="w-full">
                Create Account
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
