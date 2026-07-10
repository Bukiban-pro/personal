import { useRef, useEffect } from "react"

/**
 * Track the previous value of a variable across renders.
 *
 * @example
 * const prevCount = usePrevious(count)
 * // On first render: undefined
 * // After updates: the previous value of count
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
