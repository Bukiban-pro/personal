// Mock next/image for Vite gallery
import React from 'react'

const Image = ({ src, alt, width, height, className, fill, style, ...props }: any) => {
  const imgStyle = fill
    ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const, ...style }
    : { width, height, ...style }
  return <img src={src} alt={alt || ''} className={className} style={imgStyle} {...props} />
}

export default Image
