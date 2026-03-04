import { Link } from "wouter";
import { FREE_SHIPPING_THRESHOLD_EUR, SECOND_ITEM_DISCOUNT_PERCENT } from "@/lib/promo";

export function PromoBar() {
  return (
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 gap-y-0.5 py-1.5 sm:py-2 px-3 sm:px-5 pb-0 text-center w-full leading-tight">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 font-sans text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.05em] sm:tracking-[0.06em] text-foreground/90 uppercase">
          <span>
            <span className="text-primary font-semibold text-glow-rose">Des {FREE_SHIPPING_THRESHOLD_EUR} EUR</span>
            <span className="text-foreground/75"> d&apos;achat</span>
          </span>
          <span className="hidden sm:inline w-px h-3 bg-primary/25 rounded-full" aria-hidden />
          <span className="text-foreground/90">Livraison offerte</span>
          <span className="hidden sm:inline w-px h-3 bg-primary/25 rounded-full" aria-hidden />
          <span>
            <span className="text-foreground/75">2e article </span>
            <span className="text-primary font-semibold text-glow-rose">-{SECOND_ITEM_DISCOUNT_PERCENT} %</span>
            <span className="text-foreground/75"> (au choix)</span>
          </span>
        </span>
        <Link
          href="/catalog"
          className="shrink-0 font-sans text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.06em] sm:tracking-[0.08em] uppercase text-primary hover:text-primary/80 transition-colors duration-300 border-b border-primary/50 hover:border-primary pb-0.5 text-glow-rose"
        >
          Voir le catalogue
        </Link>
    </div>
  );
}
