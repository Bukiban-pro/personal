import { useState, useEffect, useCallback } from "react"

/**
 * Countdown timer hook.
 *
 * @param targetSeconds - Total seconds to count down from
 * @param autoStart - Start countdown immediately (default: false)
 *
 * @example
 * const { seconds, isRunning, start, reset } = useCountdown(60)
 */
export function useCountdown(targetSeconds: number, autoStart = false) {
  const [seconds, setSeconds] = useState(targetSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      if (seconds <= 0) setIsRunning(false)
      return
    }

    const id = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning, seconds])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(
    (newTarget?: number) => {
      setSeconds(newTarget ?? targetSeconds)
      setIsRunning(false)
    },
    [targetSeconds],
  )

  const restart = useCallback(
    (newTarget?: number) => {
      setSeconds(newTarget ?? targetSeconds)
      setIsRunning(true)
    },
    [targetSeconds],
  )

  return {
    seconds,
    isRunning,
    isExpired: seconds <= 0,
    start,
    pause,
    reset,
    restart,
    /** Formatted as MM:SS */
    formatted: `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
  }
}
