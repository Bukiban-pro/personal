'use client'

import type { CSSProperties } from 'react'
import Lottie from 'lottie-react'

interface LottieAnimationProps {
  animationData: object
  loop?: boolean
  autoplay?: boolean
  className?: string
  style?: CSSProperties
  width?: number | string
  height?: number | string
  maxSize?: number
}

export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className,
  style,
  width = '100%',
  height = '100%',
  maxSize,
}: LottieAnimationProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        maxWidth: maxSize,
        maxHeight: maxSize,
        ...style,
      }}
    >
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} />
    </div>
  )
}
