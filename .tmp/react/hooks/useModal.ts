import { useState, useCallback } from "react"

/**
 * Modal state management hook (from TailAdmin pattern).
 *
 * @example
 * const { isOpen, open, close, toggle } = useModal()
 *
 * <Dialog open={isOpen} onOpenChange={close}>
 *   <DialogTrigger asChild>
 *     <Button onClick={open}>Open</Button>
 *   </DialogTrigger>
 *   ...
 * </Dialog>
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}
