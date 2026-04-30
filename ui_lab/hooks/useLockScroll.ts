import { useEffect, useRef } from "react"

/**
 * Lock body scroll (e.g. when a modal or drawer is open).
 * Preserves the current scroll position and restores it on unlock.
 *
 * @example
 * useLockScroll(isOpen)
 */
export function useLockScroll(locked: boolean) {
  const scrollY = useRef(0)

  useEffect(() => {
    if (!locked) return

    scrollY.current = window.scrollY
    const originalStyle = document.body.style.cssText

    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY.current}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.cssText = originalStyle
      window.scrollTo(0, scrollY.current)
    }
  }, [locked])
}
