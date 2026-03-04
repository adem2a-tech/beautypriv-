import { Clock } from "lucide-react";

export function PartnershipBar() {
  return (
    <div
      className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-0 pb-2 px-4 text-center w-full border-t border-border/50 leading-tight"
      aria-label="Partenariat et offre"
    >
        <Clock className="w-3.5 h-3.5 shrink-0 text-primary" strokeWidth={1.5} aria-hidden />
        <span className="font-sans text-[11px] md:text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Vente privée Dyson &amp; GHD : stocks limités – jusqu&apos;à{" "}
          <span className="text-primary font-semibold">-50 %</span>
          {" "}– Partenariat officiel Darty / Boulanger
        </span>
    </div>
  );
}
