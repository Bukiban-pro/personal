/**
 * ImageWithFallback — Image component with error fallback and shimmer loading.
 *
 * Stolen from: ChefKix image-with-fallback.tsx — handles broken images gracefully
 * with a typed fallback system (user avatar, food photo, generic placeholder).
 *
 * Dependencies: next/image (or swap for <img> in non-Next projects), @/lib/utils (cn)
 *
 * @example
 * <ImageWithFallback
 *   src={product.image}
 *   alt={product.name}
 *   width={300}
 *   height={200}
 *   fallbackType="product"
 * />
 */

'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'

import { cn } from '@/lib/utils'

/** Default fallback images per content type. Customize per project. */
const FALLBACK_IMAGES: Record<string, string> = {
  avatar: '/images/default-avatar.svg',
  product: '/images/default-product.svg',
  generic: '/images/default-placeholder.svg',
}

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  /** Which fallback to use on error. */
  fallbackType?: keyof typeof FALLBACK_IMAGES
  /** Custom fallback src (overrides fallbackType). */
  fallbackSrc?: string
  /** Show shimmer placeholder while loading. */
  shimmer?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  fallbackType = 'generic',
  fallbackSrc,
  shimmer = true,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc || FALLBACK_IMAGES[fallbackType] || FALLBACK_IMAGES.generic)
    }
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {shimmer && isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  )
}
