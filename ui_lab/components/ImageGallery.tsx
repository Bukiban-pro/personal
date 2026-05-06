import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * **Image Gallery / Lightbox** — gallery with lightbox modal
 *
 * Supports:
 * - Grid layout
 * - Click to expand fullscreen
 * - Navigation arrows
 * - Keyboard shortcuts
 * - Captions
 * - Multiple columns
 *
 * Use: Photo galleries, portfolio, image collections
 */

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  thumbnail?: string;
}

export interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: GalleryImage[];
  columns?: number;
  onSelect?: (index: number) => void;
}

export const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  (
    {
      images,
      columns = 3,
      onSelect,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

    const handleSelect = (index: number) => {
      setSelectedIndex(index);
      onSelect?.(index);
    };

    const columnMap = {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    };

    return (
      <>
        {/* Grid */}
        <div
          ref={ref}
          className={cn(
            "grid gap-3",
            columnMap[columns as keyof typeof columnMap] || "grid-cols-3",
            className,
          )}
          {...props}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="relative aspect-square overflow-hidden rounded-lg border border-border hover:border-primary group cursor-pointer"
            >
              <img
                src={img.thumbnail || img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <Lightbox
            image={images[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
            onPrev={() =>
              setSelectedIndex((i) => (i! > 0 ? i! - 1 : images.length - 1))
            }
            onNext={() =>
              setSelectedIndex((i) => (i! < images.length - 1 ? i! + 1 : 0))
            }
            hasPrev={selectedIndex > 0 || images.length > 1}
            hasNext={selectedIndex < images.length - 1 || images.length > 1}
          />
        )}
      </>
    );
  },
);

ImageGallery.displayName = "ImageGallery";

interface LightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({
  image,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 text-2xl"
        >
          ✕
        </button>

        {/* Image */}
        <img
          src={image.src}
          alt={image.alt}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />

        {/* Caption */}
        {image.caption && (
          <div className="text-center text-white mt-4 px-4">
            {image.caption}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="text-white hover:text-gray-300 disabled:opacity-30 text-2xl"
          >
            ←
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="text-white hover:text-gray-300 disabled:opacity-30 text-2xl"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
