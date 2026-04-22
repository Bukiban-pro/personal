import type { CSSProperties, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface GenericLogoProps {
  imageSrc: string
  imageAlt?: string
  text?: string
  href?: string
  withText?: boolean
  textClassName?: string
  imageClassName?: string
  className?: string
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>
  style?: CSSProperties
}

export function GenericLogo({
  imageSrc,
  imageAlt = 'Logo',
  text = 'Your Brand',
  href,
  withText = true,
  textClassName,
  imageClassName,
  className,
  imageProps,
  style,
}: GenericLogoProps) {
  const content = (
    <>
      <img
        src={imageSrc}
        alt={imageAlt}
        className={cn('h-10 w-auto object-contain', imageClassName)}
        {...imageProps}
      />
      {withText ? (
        <span className={cn('ml-2 text-2xl font-bold tracking-tight text-foreground', textClassName)}>
          {text}
        </span>
      ) : null}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn('inline-flex items-center select-none transition-opacity hover:opacity-80', className)}
        style={style}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={cn('inline-flex items-center select-none', className)} style={style}>
      {content}
    </div>
  )
}
