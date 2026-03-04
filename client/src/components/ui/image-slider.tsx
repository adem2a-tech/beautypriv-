import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  interval?: number;
}

const ImageSlider = React.forwardRef<HTMLDivElement, ImageSliderProps>(
  ({ images, interval = 5000, className, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

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

    if (images.length === 0) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-full flex flex-col overflow-hidden bg-card/95 border border-primary/30 rounded-none shadow-[0_18px_60px_rgba(0,0,0,0.06)] neon-rose-led transition-all duration-300 hover:border-primary/50 hover:neon-rose-led-strong",
          className
        )}
        {...props}
      >
        {/* Zone principale avec flèches */}
        <div className="relative flex-1 min-h-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
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

          {/* Flèches gauche / droite */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 shadow-lg"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 shadow-lg"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={2} />
              </button>
            </>
          )}

          {/* Points (optionnel, en bas de la grande image) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Aller au slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Miniatures (thumbnails) */}
        {images.length > 1 && (
          <div className="flex gap-2 p-2 overflow-x-auto justify-center shrink-0 border-t border-border/60 bg-muted/30">
            {images.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "shrink-0 w-14 h-14 rounded-none overflow-hidden border border-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                  currentIndex === index
                    ? "border-primary/70 neon-rose-led"
                    : "border-primary/20 opacity-80 hover:opacity-100 hover:border-primary/50 hover:neon-rose-led"
                )}
                aria-label={`Voir photo ${index + 1}`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-contain object-center bg-muted/20"
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
