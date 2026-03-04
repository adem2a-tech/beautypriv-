import { Clock } from "lucide-react";

export function UrgencyBanner() {
  return (
    <div className="hidden md:block bg-primary/8 text-foreground py-3 px-4 relative z-50 border-b border-border/80">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-[11px] md:text-xs font-medium tracking-[0.15em] uppercase text-foreground/90">
        <Clock className="w-3.5 h-3.5 mr-2 text-primary" strokeWidth={1.5} />
        <span>Vente Privée Dyson & GHD : Stocks limités – jusqu'à <span className="text-primary font-semibold">−50%</span> · Partenariat Officiel Darty/Boulanger</span>
      </div>
    </div>
  );
}
