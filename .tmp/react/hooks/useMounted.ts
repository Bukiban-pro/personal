import { useState, useEffect } from "react"

/**
 * Returns true only after the component has mounted on the client.
 * Essential for hydration-safe rendering in SSR frameworks.
 *
 * @example
 * const mounted = useMounted()
 * if (!mounted) return <Skeleton />
 * return <ClientOnlyContent />
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
