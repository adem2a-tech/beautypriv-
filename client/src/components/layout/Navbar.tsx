import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = useCart((state) => state.getItemCount());

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/catalog", label: "Catalogue" },
    { href: "/compte", label: "Compte" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Marque — style luxe */}
          <Link href="/" className="flex-shrink-0 flex flex-col items-start group">
            <span className="font-serif text-2xl sm:text-2xl md:text-3xl font-medium tracking-tight text-foreground leading-none">
              Beauty
            </span>
            <span className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
              <span className="font-sans text-xs sm:text-xs font-medium tracking-[0.3em] text-foreground/80 uppercase">
                Privé
              </span>
            </span>
          </Link>

          {/* Partenaires vérifiés — logos + label (visible mobile et desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <a href="https://www.darty.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0 group">
              <img
                src="/images/partenaires/darty.png"
                alt="Darty"
                className="h-7 w-8 object-contain opacity-90 group-hover:opacity-100 transition-opacity md:h-11 md:w-auto"
                onError={(e) => { const t = e.currentTarget; if (t.src.endsWith(".png")) t.src = "/images/partenaires/darty.svg"; }}
              />
              <span className="inline-flex items-center justify-center gap-0.5 text-[7px] sm:text-[9px] font-semibold tracking-[0.05em] text-primary">
                <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                Partenaire vérifié
              </span>
            </a>
            <a href="https://www.boulanger.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0 group">
              <img
                src="/images/partenaires/boulanger.png"
                alt="Boulanger"
                className="h-7 w-14 object-contain opacity-90 group-hover:opacity-100 transition-opacity md:h-11 md:w-auto"
                onError={(e) => { const t = e.currentTarget; if (t.src.endsWith(".png")) t.src = "/images/partenaires/boulanger.svg"; }}
              />
              <span className="inline-flex items-center justify-center gap-0.5 text-[7px] sm:text-[9px] font-semibold tracking-[0.05em] text-primary">
                <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                Partenaire vérifié
              </span>
            </a>
          </div>

          {/* Desktop Nav — soulignement or */}
          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium tracking-[0.15em] slide-underline-luxe transition-colors duration-300 ${
                  location === link.href ? "text-primary" : "text-foreground/90 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions — panier avec label */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="flex flex-col items-center justify-center gap-0.5 group relative p-3 min-h-[44px] min-w-[44px] md:p-2 text-foreground/90 hover:text-primary transition-colors duration-300">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} aria-hidden />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
              <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.05em] text-foreground/90 group-hover:text-primary">Panier</span>
            </Link>
            
            <div className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px]">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground h-11 w-11 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-lg absolute w-full left-0 top-20">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center min-h-[48px] px-4 py-3 rounded-xl text-base font-medium ${
                  location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
