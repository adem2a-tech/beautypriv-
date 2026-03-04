import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  SECOND_ITEM_DISCOUNT_PERCENT,
  EXPRESS_FEE_CENTS,
} from "@/lib/promo";
import {
  orderFromCartFromItems,
  saveOrderFromCart,
  type DeliveryType,
  type OrderFromCartDeliveryAddress,
  type PaymentMethod,
} from "@/lib/order";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Truck, Package, ArrowRight, MapPin, Home, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const inputClass =
  "w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20";

export function OptionsLivraison() {
  const [, setLocation] = useLocation();
  const { items, getTotal } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("domicile");
  const [express, setExpress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<OrderFromCartDeliveryAddress>({
    address: "",
    complement: "",
    postalCode: "",
    city: "",
  });
  const [errors, setErrors] = useState<{ address?: string; postalCode?: string; city?: string }>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bancaire");

  const subtotal = getTotal();
  const qualifiesForPromo = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shipping = qualifiesForPromo ? 0 : 590;
  const promoItem = items.length >= 1 ? items[0] : null;
  const promoDiscountCents =
    qualifiesForPromo && promoItem
      ? Math.round(
          (promoItem.product.price * promoItem.quantity * SECOND_ITEM_DISCOUNT_PERCENT) / 100
        )
      : 0;
  const baseTotal = subtotal - promoDiscountCents + shipping;
  const expressFee = express ? EXPRESS_FEE_CENTS : 0;
  const total = baseTotal + expressFee;

  useEffect(() => {
    if (items.length === 0) setLocation("/cart");
  }, [items.length, setLocation]);

  const handleSuivant = () => {
    if (deliveryType === "domicile") {
      const e: typeof errors = {};
      if (!deliveryAddress.address.trim()) e.address = "Requis";
      if (!deliveryAddress.postalCode.trim()) e.postalCode = "Requis";
      if (!deliveryAddress.city.trim()) e.city = "Requis";
      setErrors(e);
      if (Object.keys(e).length > 0) return;
    }
    const order = orderFromCartFromItems(items, shipping, baseTotal);
    saveOrderFromCart({
      ...order,
      totalCents: total,
      deliveryType,
      express,
      paymentMethod,
      ...(deliveryType === "domicile" && {
        deliveryAddress: {
          address: deliveryAddress.address.trim(),
          ...(deliveryAddress.complement?.trim() && { complement: deliveryAddress.complement.trim() }),
          postalCode: deliveryAddress.postalCode.trim(),
          city: deliveryAddress.city.trim(),
        },
      }),
    });
    setLocation("/commande-confirmee");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">Redirection…</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen py-10 md:py-16"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Catalogue", href: "/catalog" },
            { label: "Panier", href: "/cart" },
            { label: "Options de livraison" },
          ]}
        />

        <div className="rounded-2xl border-2 border-border bg-card shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-border cart-recap-gradient">
            <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight mb-1">
              Options de livraison
            </h1>
            <p className="text-sm text-muted-foreground font-medium tracking-wide">
              Choisissez comment vous souhaitez recevoir votre commande.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Mode de livraison
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType("domicile")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    deliveryType === "domicile"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <Home className="w-5 h-5 shrink-0" />
                  <span className="font-medium">Livraison à domicile</span>
                </button>
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-muted/50 text-muted-foreground cursor-not-allowed opacity-80"
                >
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span className="font-medium line-through">Point relais</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground ml-auto">Indisponible</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Type de commande
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExpress(false)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    !express
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <Package className="w-5 h-5 shrink-0" />
                  <span className="font-medium">Standard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExpress(true)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    express
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <Truck className="w-5 h-5 shrink-0" />
                  <span className="font-medium">Commande express (+5€)</span>
                </button>
              </div>
            </div>

            {deliveryType === "domicile" && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-foreground">
                  Adresse de livraison
                </label>
                <div>
                  <input
                    type="text"
                    value={deliveryAddress.address}
                    onChange={(e) => {
                      setDeliveryAddress((a) => ({ ...a, address: e.target.value }));
                      setErrors((e2) => ({ ...e2, address: undefined }));
                    }}
                    className={inputClass}
                    placeholder="Numéro et nom de rue"
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive mt-1">{errors.address}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={deliveryAddress.complement ?? ""}
                    onChange={(e) =>
                      setDeliveryAddress((a) => ({ ...a, complement: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="Complément (bâtiment, étage, appartement, digicode…)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Optionnel</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={deliveryAddress.postalCode}
                      onChange={(e) => {
                        setDeliveryAddress((a) => ({ ...a, postalCode: e.target.value }));
                        setErrors((e2) => ({ ...e2, postalCode: undefined }));
                      }}
                      className={inputClass}
                      placeholder="Code postal"
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => {
                        setDeliveryAddress((a) => ({ ...a, city: e.target.value }));
                        setErrors((e2) => ({ ...e2, city: undefined }));
                      }}
                      className={inputClass}
                      placeholder="Ville"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Moyen de paiement
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "paypal"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#003087" d="M7.076 21.337H2.47a.596.596 0 0 1-.59-.692L4.944 3.8a.596.596 0 0 1 .59-.5h5.18c2.212 0 3.869.518 4.964 1.548 1.016.946 1.516 2.216 1.516 3.782 0 1.57-.582 2.925-1.746 3.93-.95.82-2.27 1.23-3.964 1.23H9.22a.596.596 0 0 0-.59.5l-.74 4.717-.002.01-.452 2.87a.398.398 0 0 1-.394.33z" />
                    <path fill="#009cde" d="M23.472 14.75c-.346-2.26-2.076-3.5-5.02-3.5h-3.254c-.49 0-.906.36-.985.846l-1.22 7.752-.002.01-.37 2.35a.596.596 0 0 0 .59.692h2.98a.596.596 0 0 0 .59-.5l.147-.936a.596.596 0 0 1 .59-.5h.37c2.37 0 4.318-1.93 4.724-4.5.18-1.08.06-2-.34-2.67z" />
                  </svg>
                  <span className="font-medium text-sm">PayPal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bancaire")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "bancaire"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <CreditCard className="w-8 h-8 shrink-0" strokeWidth={1.5} />
                  <span className="font-medium text-sm">Carte bancaire</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("apple_pay")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === "apple_pay"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="font-medium text-sm">Apple Pay</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-2 space-y-1">
                <p>
                  Sous-total livraison :{" "}
                  <span className="tabular-nums">{formatPrice(baseTotal)}</span>
                </p>
                {express && (
                  <p>
                    + Commande express : <span className="tabular-nums">{formatPrice(EXPRESS_FEE_CENTS)}</span>
                  </p>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground mb-4">
                Total : <span className="tabular-nums">{formatPrice(total)}</span>
              </p>
              <Button
                size="lg"
                onClick={handleSuivant}
                className="w-full py-6 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Prochaine étape : envoi de votre commande sur WhatsApp (récap panier + adresse).
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/cart"
          className="mt-6 inline-block text-sm text-primary hover:underline font-medium"
        >
          ← Retour au panier
        </Link>
      </div>
    </motion.div>
  );
}
