import { Link } from "wouter";
import { Instagram, Facebook, Twitter, CreditCard, ShieldCheck, Truck, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/40 border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12 lg:gap-10">
          <div className="space-y-5">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-medium text-foreground tracking-tight">Beauty</span>
              <span className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-primary" aria-hidden />
                <span className="font-sans text-xs font-medium tracking-[0.25em] text-foreground/90 uppercase">Privé</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-light tracking-[0.02em]">
              Le luxe à prix privé. Des produits premium en déstockage, sélectionnés avec la plus grande exigence.
            </p>
            <p className="text-xs text-primary font-semibold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" /> 4,9/5 · +1 200 avis
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300"><Instagram className="w-5 h-5" strokeWidth={1.5} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300"><Facebook className="w-5 h-5" strokeWidth={1.5} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300"><Twitter className="w-5 h-5" strokeWidth={1.5} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-medium text-base mb-5 tracking-wide text-foreground">Liens Rapides</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Accueil</Link></li>
              <li><Link href="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Boutique</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Questions Fréquentes</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Nous Contacter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-medium text-base mb-5 tracking-wide text-foreground">Informations</h4>
            <ul className="space-y-3">
              <li><Link href="/cgv" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">CGV</Link></li>
              <li><Link href="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Politique de Remboursement</Link></li>
              <li><Link href="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Mentions Légales</Link></li>
              <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-medium text-base mb-5 tracking-wide text-foreground">Paiement Sécurisé</h4>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground font-light">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground font-light">
                <Truck className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                <span>Expédition en 48/72h</span>
              </div>
              <div className="flex items-center space-x-3 mt-2 text-muted-foreground">
                <CreditCard className="w-6 h-6 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] font-medium border border-primary/40 text-primary px-2 py-1 tracking-wide">Stripe</span>
                <span className="text-[10px] font-medium border border-primary/40 text-primary px-2 py-1 tracking-wide">Pay</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-16 pt-8 text-center text-xs text-muted-foreground font-light tracking-[0.08em]">
          <p>&copy; {new Date().getFullYear()} Beauty Privé. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
