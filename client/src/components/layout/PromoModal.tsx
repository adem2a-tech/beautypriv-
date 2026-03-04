import { useEffect, useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FREE_SHIPPING_THRESHOLD_EUR, SECOND_ITEM_DISCOUNT_PERCENT } from "@/lib/promo";

const STORAGE_KEY = "beauty-prive-promo-seen";
const COOLDOWN_HOURS = 24;

export function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setOpen(true);
        return;
      }
      const closedAt = Number(raw);
      if (!Number.isFinite(closedAt)) {
        setOpen(true);
        return;
      }
      const elapsedHours = (Date.now() - closedAt) / (1000 * 60 * 60);
      if (elapsedHours >= COOLDOWN_HOURS) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
  };

  if (!open) return null;

  const whatsAppMessage = `Bonjour, je souhaite profiter de la livraison offerte et de l'offre 2e article à -${SECOND_ITEM_DISCOUNT_PERCENT}% (commande > ${FREE_SHIPPING_THRESHOLD_EUR}€).`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in-0 duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
    >
      <div className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-10 pb-8 px-8 text-center font-serif">
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Offre privilège
          </p>
          <h2 id="promo-title" className="text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-tight">
            Livraison offerte
            <br />
            <span className="text-primary font-medium">+ 2e article à −{SECOND_ITEM_DISCOUNT_PERCENT} %</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6 font-sans font-normal">
            Dès <strong className="text-foreground">{FREE_SHIPPING_THRESHOLD_EUR} €</strong> d&apos;achat. Dyson, GHD & accessoires. Paiement sécurisé.
          </p>

          <div className="flex flex-col gap-3 font-sans">
            <Link href="/catalog" onClick={handleClose}>
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-6 text-base"
              >
                Voir les offres
              </Button>
            </Link>
            <a
              href={getWhatsAppUrl(whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors border border-primary/20"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Commander via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
