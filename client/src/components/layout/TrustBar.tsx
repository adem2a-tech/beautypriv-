import { Trophy, BadgeCheck, Lock, Truck, Shield } from "lucide-react";

const items = [
  { icon: Trophy, label: "Élu Meilleur Déstockeur de France 2024" },
  { icon: BadgeCheck, label: "Certifié Revendeur Agréé" },
  { icon: Lock, label: "Paiement 100% Sécurisé" },
  { icon: Truck, label: "Livraison Rapide 24/48h" },
  { icon: Shield, label: "Produits Contrôlés & Garantis" },
];

function TrustItem({ icon: Icon, label }: { icon: typeof Trophy; label: string }) {
  return (
    <div className="flex items-center gap-2 shrink-0 px-6 text-[11px] md:text-xs font-semibold tracking-[0.06em] text-foreground/90">
      <Icon className="w-4 h-4 shrink-0 text-primary" strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  );
}

export function TrustBar() {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/[0.08] to-primary/5 border-b border-border/80 relative z-40">
      {/* Desktop: static centered */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-x-2 gap-y-2 py-3 px-4 max-w-7xl mx-auto">
        {items.map((item, i) => (
          <TrustItem key={i} icon={item.icon} label={item.label} />
        ))}
      </div>
      {/* Mobile: marquee */}
      <div className="md:hidden overflow-hidden py-3" aria-hidden="false">
        <div className="flex animate-trust-marquee w-max">
          {[...items, ...items].map((item, i) => (
            <TrustItem key={i} icon={item.icon} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
