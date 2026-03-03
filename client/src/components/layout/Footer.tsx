import { Link } from "wouter";
import { Instagram, Facebook, Twitter, CreditCard, ShieldCheck, Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-foreground">Beauty Privé</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Le luxe à prix privé. Des produits premium en déstockage, sélectionnés avec la plus grande exigence.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Liens Rapides</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Boutique</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">Questions Fréquentes</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Nous Contacter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Informations</h4>
            <ul className="space-y-3">
              <li><Link href="/cgv" className="text-sm text-muted-foreground hover:text-primary transition-colors">CGV</Link></li>
              <li><Link href="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Politique de Remboursement</Link></li>
              <li><Link href="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Paiement Sécurisé</h4>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Expédition en 48/72h</span>
              </div>
              <div className="flex items-center space-x-3 mt-2 text-muted-foreground">
                <CreditCard className="w-8 h-8" />
                <span className="text-xs font-bold border border-border px-2 py-1 rounded">Stripe</span>
                <span className="text-xs font-bold border border-border px-2 py-1 rounded">Pay</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="border-t border-border mt-16 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Beauty Privé. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
