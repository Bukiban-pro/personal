'use client'

import { Typewriter } from 'react-simple-typewriter'

interface AnimatedTextProps {
  messages: string[]
  className?: string
  loop?: number | boolean
  cursor?: boolean
  cursorStyle?: string
  typeSpeed?: number
  deleteSpeed?: number
  delaySpeed?: number
}

export function AnimatedText({
  messages,
  className = 'text-sm text-muted-foreground md:text-base',
  loop = 0,
  cursor = true,
  cursorStyle = '_',
  typeSpeed = 50,
  deleteSpeed = 30,
  delaySpeed = 2000,
}: AnimatedTextProps) {
  return (
    <span className={className}>
      <Typewriter
        words={messages}
        loop={loop}
        cursor={cursor}
        cursorStyle={cursorStyle}
        typeSpeed={typeSpeed}
        deleteSpeed={deleteSpeed}
        delaySpeed={delaySpeed}
      />
    </span>
  )
}
