import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/promo";
import {
  saveOrderPayload,
  orderPayloadFromCart,
  type DeliveryInfo,
} from "@/lib/order";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { motion } from "framer-motion";
import { ShoppingBag, Lock, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

const initialDelivery: DeliveryInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  comment: "",
};

function fireConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
  function fire(particleRatio: number, opts?: Parameters<typeof confetti>[0]) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
  }
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotal } = useCart();
  const { account, isLoggedIn, hasHydrated, hydrate } = useAccount();
  const [delivery, setDelivery] = useState<DeliveryInfo>(initialDelivery);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryInfo, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isLoggedIn) {
      setLocation("/compte?from=/checkout");
      return;
    }
    if (account) {
      setDelivery((d) => ({
        ...d,
        firstName: account.firstName,
        lastName: account.lastName,
        phone: account.phone,
      }));
    }
  }, [hasHydrated, isLoggedIn, account, setLocation]);

  const subtotal = getTotal();
  const qualifiesForPromo = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shipping = qualifiesForPromo ? 0 : 590;
  const total = subtotal + shipping;

  const update = (field: keyof DeliveryInfo, value: string) => {
    setDelivery((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof DeliveryInfo, string>> = {};
    if (!delivery.firstName.trim()) e.firstName = "Requis";
    if (!delivery.lastName.trim()) e.lastName = "Requis";
    if (!delivery.email.trim()) e.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.email)) e.email = "Email invalide";
    if (!delivery.phone.trim()) e.phone = "Requis";
    if (!delivery.address.trim()) e.address = "Requis";
    if (!delivery.postalCode.trim()) e.postalCode = "Requis";
    if (!delivery.city.trim()) e.city = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;
    if (!validate()) return;
    setSubmitting(true);
    const base = orderPayloadFromCart(items, shipping);
    saveOrderPayload({ ...base, delivery });
    fireConfetti();
    setTimeout(() => setLocation("/commande-confirmee"), 800);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <p className="text-muted-foreground mb-6">Votre panier est vide.</p>
        <Link href="/cart">
          <Button variant="outline" className="rounded-xl">
            Retour au panier
          </Button>
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-10 md:py-16"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Catalogue", href: "/catalog" }, { label: "Panier", href: "/cart" }, { label: "Commande" }]} />

        <div className="rounded-2xl border-2 border-border bg-card shadow-xl shadow-black/[0.06] overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-border cart-recap-gradient">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                  Finaliser la commande
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5 font-medium tracking-wide">
                  Vos coordonnées en toute sécurité. Livraison soignée à domicile.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prénom</label>
                <input
                  type="text"
                  value={delivery.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className={inputClass}
                  placeholder="Prénom"
                />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Nom</label>
                <input
                  type="text"
                  value={delivery.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className={inputClass}
                  placeholder="Nom"
                />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={delivery.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
                placeholder="email@exemple.fr"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={delivery.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Adresse</label>
              <input
                type="text"
                value={delivery.address}
                onChange={(e) => update("address", e.target.value)}
                className={inputClass}
                placeholder="Numéro et nom de rue"
              />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Code postal</label>
                <input
                  type="text"
                  value={delivery.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  className={inputClass}
                  placeholder="75001"
                />
                {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Ville</label>
                <input
                  type="text"
                  value={delivery.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                  placeholder="Paris"
                />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Commentaire (optionnel)</label>
              <textarea
                value={delivery.comment ?? ""}
                onChange={(e) => update("comment", e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Instructions de livraison, demande 2e article -65%..."
              />
            </div>

            <div className="rounded-xl border-2 border-border bg-muted/20 p-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-medium">{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t-2 border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-serif text-xl font-semibold text-primary tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full py-6 rounded-xl text-base font-bold bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg shadow-[#16a34a]/25 flex items-center justify-center gap-2"
            >
              {submitting ? "Redirection…" : "Commander"}
              <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs pt-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["Visa", "Mastercard", "CB", "PayPal", "Apple Pay"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/60 border border-border/80 text-[10px] font-semibold text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
