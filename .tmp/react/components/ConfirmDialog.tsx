'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/hooks/useFocusTrap'

/**
 * ConfirmDialog — A reusable confirmation dialog to replace window.confirm().
 *
 * Dependencies: cn() utility, useFocusTrap hook
 * NOTE: If you use shadcn/ui, swap this for AlertDialog from @/components/ui/alert-dialog
 * for better animation and Radix accessibility. This version is dependency-free.
 *
 * Features:
 * - Controlled open/close state
 * - Default and destructive variants
 * - Custom title, description, button labels
 * - Backdrop click to cancel
 * - Escape key to cancel
 * - Focus trap with auto-focus on cancel button
 * - Unique aria IDs (safe for multiple instances)
 *
 * @example
 * <ConfirmDialog
 *   open={showDelete}
 *   onOpenChange={setShowDelete}
 *   title="Delete item?"
 *   description="This action cannot be undone."
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 */

interface ConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	confirmLabel?: string
	cancelLabel?: string
	variant?: 'default' | 'destructive'
	onConfirm: () => void
	onCancel?: () => void
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	variant = 'default',
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const id = useId()
	const titleId = `${id}-title`
	const descId = `${id}-desc`
	const trapRef = useFocusTrap<HTMLDivElement>(open)

	if (!open) return null

	const handleConfirm = () => {
		onConfirm()
		onOpenChange(false)
	}

	const handleCancel = () => {
		onCancel?.()
		onOpenChange(false)
	}

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
				onClick={handleCancel}
				aria-hidden="true"
			/>

			{/* Dialog */}
			<div
				ref={trapRef}
				role="alertdialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descId}
				className={cn(
					'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
					'rounded-2xl border border-border bg-background p-6 shadow-lg',
					'animate-in fade-in-0 zoom-in-95',
				)}
				onKeyDown={(e) => { if (e.key === 'Escape') handleCancel() }}
			>
				{/* Header */}
				<h2 id={titleId} className="text-lg font-semibold text-foreground">
					{title}
				</h2>
				<p id={descId} className="mt-2 text-sm text-muted-foreground">
					{description}
				</p>

				{/* Actions */}
				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={handleCancel}
						className={cn(
							'rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium',
							'text-foreground transition-colors hover:bg-muted/80',
						)}
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						className={cn(
							'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
							variant === 'destructive'
								? 'text-destructive-foreground'
								: 'text-primary-foreground',
							variant === 'destructive'
								? 'bg-destructive hover:bg-destructive/90'
								: 'bg-primary hover:bg-primary/90',
						)}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</>
	)
}
