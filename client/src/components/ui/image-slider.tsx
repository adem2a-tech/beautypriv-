import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  interval?: number;
  onExpandClick?: (currentIndex: number) => void;
}

const SWIPE_THRESHOLD = 50;

const ImageSlider = React.forwardRef<HTMLDivElement, ImageSliderProps>(
  ({ images, interval = 5000, className, onExpandClick, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const touchStartX = React.useRef(0);
    const touchEndX = React.useRef(0);

    React.useEffect(() => {
      if (images.length <= 1) return;
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);
      return () => clearInterval(timer);
    }, [images.length, interval]);

    const goPrev = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const goNext = () => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };
    const handleTouchMove = (e: React.TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    if (images.length === 0) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-full flex flex-col overflow-hidden bg-card/95 border border-primary/30 rounded-none shadow-[0_18px_60px_rgba(0,0,0,0.06)] neon-rose-led transition-all duration-300 hover:border-primary/50 hover:neon-rose-led-strong touch-manipulation",
          className
        )}
        onTouchStart={images.length > 1 ? handleTouchStart : undefined}
        onTouchMove={images.length > 1 ? handleTouchMove : undefined}
        onTouchEnd={images.length > 1 ? handleTouchEnd : undefined}
        {...props}
      >
        {/* Zone principale avec flèches */}
        <div className="relative flex-1 min-h-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex] ?? images[0] ?? ""}
              alt={`Slide ${currentIndex + 1}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-contain object-center bg-muted/30"
            />
          </AnimatePresence>

          {/* Halo rose sur les côtés */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/18 via-transparent to-primary/18 mix-blend-multiply" />

          {/* Bouton agrandir (SVG inline pour éviter tout souci de bundle) */}
          {onExpandClick && (
            <button
              type="button"
              onClick={() => onExpandClick(currentIndex)}
              className="absolute top-2 right-2 z-10 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/70 text-white flex items-center justify-center transition-colors duration-200 shadow-lg touch-manipulation"
              aria-label="Agrandir l'image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            </button>
          )}

          {/* Flèches gauche / droite — 44px min pour touch mobile */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/70 text-white flex items-center justify-center transition-colors duration-200 shadow-lg touch-manipulation"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/70 text-white flex items-center justify-center transition-colors duration-200 shadow-lg touch-manipulation"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={2} />
              </button>
            </>
          )}

          {/* Points (optionnel, en bas de la grande image) — zone touch 44px */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full touch-manipulation"
                  aria-label={`Aller au slide ${index + 1}`}
                >
                  <span
                    className={cn(
                      "rounded-full transition-all duration-300 block",
                      currentIndex === index ? "bg-white scale-125 w-2.5 h-2.5" : "bg-white/50 w-2 h-2"
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Miniatures (thumbnails) — scroll horizontal fluide + snap sur mobile */}
        {images.length > 1 && (
          <div className="scroll-touch flex gap-2 p-2 overflow-x-auto overflow-y-hidden justify-start md:justify-center shrink-0 border-t border-border/60 bg-muted/30 snap-x snap-mandatory scroll-smooth touch-manipulation">
            {images.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "shrink-0 w-14 h-14 min-w-[56px] min-h-[56px] rounded-none overflow-hidden border-2 border-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 snap-center touch-manipulation",
                  currentIndex === index
                    ? "border-primary/70 neon-rose-led"
                    : "border-primary/20 opacity-80 hover:opacity-100 active:opacity-100 hover:border-primary/50 hover:neon-rose-led"
                )}
                aria-label={`Voir photo ${index + 1}`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-contain object-center bg-muted/20"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImageSlider.displayName = "ImageSlider";

export { ImageSlider };
