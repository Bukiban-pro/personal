// Mock next/link for Vite gallery
import React from 'react'

const Link = ({ href, children, className, target, rel, ...props }: any) => {
  return (
    <a href={href} className={className} target={target} rel={rel} {...props}>
      {children}
    </a>
  )
}

export default Link
