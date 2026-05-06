/**
 * AvatarCircles
 * Overlapping circular avatar stack with overflow count badge.
 * Perfect for "X people joined", social proof, team displays.
 *
 * Deps: none
 * Usage:
 *   const avatars = [
 *     { imageUrl: "/avatar1.jpg", profileUrl: "https://github.com/user1" },
 *     { imageUrl: "/avatar2.jpg", profileUrl: "https://github.com/user2" },
 *   ]
 *   <AvatarCircles avatarUrls={avatars} numPeople={1200} />
 */
"use client"

import { cn } from "@/lib/utils"

interface Avatar {
  imageUrl: string
  profileUrl: string
  alt?: string
}

interface AvatarCirclesProps {
  className?: string
  /** Number shown in the overflow badge (e.g. 1200 → "+1200") */
  numPeople?: number
  avatarUrls: Avatar[]
}

export const AvatarCircles = ({ numPeople, className, avatarUrls }: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <a key={index} href={url.profileUrl} target="_blank" rel="noopener noreferrer">
          <img
            className="size-10 rounded-full border-2 border-background"
            src={url.imageUrl}
            width={40}
            height={40}
            alt={url.alt ?? `Avatar ${index + 1}`}
          />
        </a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <div className="flex size-10 items-center justify-center rounded-full border-2 border-background bg-foreground text-center text-xs font-medium text-background">
          +{numPeople}
        </div>
      )}
    </div>
  )
}
