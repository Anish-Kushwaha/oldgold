import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

interface ImageCarouselProps {
  images: { image_url: string; display_order: number }[];
  fallbackUrl?: string | null;
  altText: string;
}

const ImageCarousel = ({ images, fallbackUrl, altText }: ImageCarouselProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const sorted = images.sort((a, b) => a.display_order - b.display_order);

  const allUrls = sorted.length > 0
    ? sorted.map((img) => img.image_url)
    : fallbackUrl
      ? [fallbackUrl]
      : [];

  const goNext = useCallback(() => {
    if (allUrls.length <= 1) return;
    setActiveIdx((prev) => (prev + 1) % allUrls.length);
  }, [allUrls.length]);

  const goPrev = useCallback(() => {
    if (allUrls.length <= 1) return;
    setActiveIdx((prev) => (prev - 1 + allUrls.length) % allUrls.length);
  }, [allUrls.length]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (allUrls.length <= 1) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [goNext, allUrls.length]);

  if (allUrls.length === 0) {
    return (
      <div className="h-64 md:h-80 bg-secondary flex items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 md:h-80 bg-secondary flex items-center justify-center overflow-hidden group">
        <img
          src={allUrls[activeIdx]}
          alt={altText}
          className="w-full h-full object-contain transition-opacity duration-300"
        />
        {allUrls.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIdx ? "bg-primary w-4" : "bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {/* Thumbnails */}
      {allUrls.length > 1 && (
        <div className="flex gap-1 p-2 overflow-x-auto">
          {allUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-14 h-14 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                i === activeIdx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
