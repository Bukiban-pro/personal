/**
 * Loading Button — Button extension with built-in loading state.
 *
 * Stolen from: ChefKix loading-button.tsx — extends Button with loading + loadingText props.
 *
 * Dependencies: @/components/ui/button (the stash Button), lucide-react (Loader2), @/lib/utils (cn)
 *
 * @example
 * <LoadingButton loading={isPending} loadingText="Saving...">
 *   Save Changes
 * </LoadingButton>
 */

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface LoadingButtonProps extends ButtonProps {
  /** Show loading spinner and disable the button. */
  loading?: boolean
  /** Text to show while loading (defaults to children). */
  loadingText?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText, children, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(loading && 'cursor-not-allowed', className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {loading && loadingText ? loadingText : children}
      </Button>
    )
  },
)
LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
