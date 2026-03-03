import { Clock } from "lucide-react";

export function UrgencyBanner() {
  return (
    <div className="bg-foreground text-background py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-xs md:text-sm font-medium tracking-wide">
        <Clock className="w-4 h-4 mr-2 text-accent" />
        <span>Vente Privée : Stocks limités – jusqu'à <span className="text-accent font-bold">-60%</span></span>
      </div>
    </div>
  );
}
