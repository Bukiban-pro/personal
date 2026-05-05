/**
 * ConfettiEffect
 * Two exports:
 *   - <Confetti /> — canvas-based confetti renderer with imperative ref API
 *   - <ConfettiButton /> — button that fires confetti from its own position
 *
 * Deps: canvas-confetti, @types/canvas-confetti
 * Usage:
 *   // Imperative ref
 *   const ref = useRef<ConfettiRef>(null)
 *   <Confetti ref={ref} manualstart />
 *   <button onClick={() => ref.current?.fire({ particleCount: 100 })}>🎉</button>
 *
 *   // Auto-fire on mount
 *   <Confetti options={{ particleCount: 150, spread: 80 }} />
 *
 *   // Button variant
 *   <ConfettiButton options={{ particleCount: 100, spread: 60 }}>
 *     Celebrate!
 *   </ConfettiButton>
 */
"use client"

import type { ReactNode } from "react"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti"
import confetti from "canvas-confetti"

type Api = {
  fire: (options?: ConfettiOptions) => void
}

type ConfettiProps = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions
  globalOptions?: ConfettiGlobalOptions
  manualstart?: boolean
  children?: ReactNode
}

export type ConfettiRef = Api | null

const ConfettiContext = createContext<Api>({} as Api)

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>((props, ref) => {
  const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, children, ...rest } = props
  const instanceRef = useRef<ConfettiInstance | null>(null)

  const canvasRef = useCallback(
    (node: HTMLCanvasElement) => {
      if (node !== null) {
        if (instanceRef.current) return
        instanceRef.current = confetti.create(node, { ...globalOptions, resize: true })
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset()
          instanceRef.current = null
        }
      }
    },
    [globalOptions]
  )

  const fire = useCallback(
    async (opts = {}) => {
      try {
        await instanceRef.current?.({ ...options, ...opts })
      } catch (error) {
        console.error("Confetti error:", error)
      }
    },
    [options]
  )

  const api = useMemo(() => ({ fire }), [fire])

  useImperativeHandle(ref, () => api, [api])

  useEffect(() => {
    if (!manualstart) {
      ;(async () => {
        try {
          await fire()
        } catch (error) {
          console.error("Confetti auto-fire error:", error)
        }
      })()
    }
  }, [manualstart, fire])

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  )
})

Confetti.displayName = "Confetti"

interface ConfettiButtonProps extends React.ComponentProps<"button"> {
  options?: ConfettiOptions & ConfettiGlobalOptions & { canvas?: HTMLCanvasElement }
}

export function ConfettiButton({ options, children, ...props }: ConfettiButtonProps) {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      await confetti({
        ...options,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      })
    } catch (error) {
      console.error("Confetti button error:", error)
    }
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}
