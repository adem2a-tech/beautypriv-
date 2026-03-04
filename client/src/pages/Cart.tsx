import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAccount } from "@/hooks/use-account";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD_CENTS, FREE_SHIPPING_THRESHOLD_EUR, SECOND_ITEM_DISCOUNT_PERCENT } from "@/lib/promo";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Minus, Plus, Trash2, Lock, Gift, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

const PROMO_POPUP_SEEN_KEY = "beauty-prive-promo-popup-seen";
const PROMO_POPUP_COOLDOWN_HOURS = 24;

export function Cart() {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const isLoggedIn = useAccount((s) => s.isLoggedIn);
  const [promoPopupOpen, setPromoPopupOpen] = useState(false);

  const subtotal = getTotal();
  const qualifiesForPromo = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shipping = qualifiesForPromo ? 0 : 590;

  const [promoProductId, setPromoProductId] = useState<number | null>(null);
  useEffect(() => {
    if (qualifiesForPromo && items.length >= 1) {
      setPromoProductId((prev) =>
        prev === null || !items.some((i) => i.product.id === prev) ? items[0].product.id : prev
      );
    }
  }, [qualifiesForPromo, items]);
  const promoItem = items.find((i) => i.product.id === promoProductId);
  const promoDiscountCents =
    qualifiesForPromo && promoItem
      ? Math.round((promoItem.product.price * promoItem.quantity * SECOND_ITEM_DISCOUNT_PERCENT) / 100)
      : 0;
  const total = subtotal - promoDiscountCents + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);

  useEffect(() => {
    if (items.length === 0 || total < FREE_SHIPPING_THRESHOLD_CENTS) return;
    try {
      const raw = localStorage.getItem(PROMO_POPUP_SEEN_KEY);
      if (raw) {
        const closedAt = Number(raw);
        if (Number.isFinite(closedAt)) {
          const elapsedHours = (Date.now() - closedAt) / (1000 * 60 * 60);
          if (elapsedHours < PROMO_POPUP_COOLDOWN_HOURS) return;
        }
      }
      setPromoPopupOpen(true);
    } catch {
      // ignore
    }
  }, [items.length, total]);

  const closePromoPopup = () => {
    setPromoPopupOpen(false);
    try {
      localStorage.setItem(PROMO_POPUP_SEEN_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  const handlePayer = () => {
    if (!isLoggedIn) {
      setLocation("/compte?from=/cart");
      return;
    }
    setLocation("/options-livraison");
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
          <ShoppingBag className="w-10 h-10" strokeWidth={1.5} />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-3 tracking-tight">
          Votre panier est vide
        </h2>
        <p className="text-muted-foreground mb-10 max-w-md text-sm leading-relaxed">
          Découvrez notre sélection exclusive et profitez de la livraison offerte dès {FREE_SHIPPING_THRESHOLD_EUR}€.
        </p>
        <Link href="/catalog">
          <Button
            size="lg"
            className="rounded-xl px-10 py-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            Découvrir le catalogue
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background py-10 md:py-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Catalogue", href: "/catalog" }, { label: "Panier" }]} />
        {/* En-tête panier */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="product-title text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Votre panier
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {items.length} article{items.length > 1 ? "s" : ""} — Finalisez en quelques secondes
            </p>
          </div>
        </div>

        {/* Bandeau promo 400€ */}
        {!qualifiesForPromo && remainingForFreeShipping > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 flex flex-wrap items-center gap-4"
          >
            <Sparkles className="w-6 h-6 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">
                Plus que <span className="text-primary font-semibold">{formatPrice(remainingForFreeShipping)}</span> pour la livraison offerte
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Dès {FREE_SHIPPING_THRESHOLD_EUR}€ : livraison gratuite + un 2e article à -{SECOND_ITEM_DISCOUNT_PERCENT}%
              </p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" size="sm" className="rounded-xl border-primary/40 text-primary hover:bg-primary/10 shrink-0">
                Ajouter un article
              </Button>
            </Link>
          </motion.div>
        )}

        {qualifiesForPromo && items.length >= 1 && (() => {
          const bestForDiscount = items.length > 0
            ? items.reduce((best, cur) =>
                cur.product.price * cur.quantity > (best?.product.price ?? 0) * (best?.quantity ?? 0) ? cur : best
              )
            : null;
          const bestProductId = bestForDiscount?.product.id ?? null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 rounded-2xl bg-primary/10 border border-primary/25"
            >
              <div className="flex items-start gap-3">
                <Gift className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    Livraison offerte + un article à -{SECOND_ITEM_DISCOUNT_PERCENT}% : choisissez lequel
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    La réduction s&apos;applique automatiquement au total ci-contre.
                  </p>
                  {bestProductId && items.length > 1 && (
                    <p className="text-sm font-medium text-primary mb-2">
                      Choisir l&apos;article le plus cher = total le plus bas.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => {
                      const isBest = item.product.id === bestProductId && items.length > 1;
                      return (
                        <button
                          key={item.product.id}
                          type="button"
                          onClick={() => setPromoProductId(item.product.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                            promoProductId === item.product.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border text-foreground hover:border-primary/50"
                          } ${isBest ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""}`}
                        >
                          {item.product.name.length > 40 ? item.product.name.slice(0, 40) + "…" : item.product.name}
                          {isBest && (
                            <span className="ml-1.5 text-xs opacity-90">(recommandé)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Popup promo dès 400€ — une fois toutes les 24h, style haut de gamme */}
        <Dialog open={promoPopupOpen} onOpenChange={(open) => !open && closePromoPopup()}>
          <DialogContent className="sm:max-w-md rounded-2xl border-2 border-border shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <DialogTitle className="font-serif text-xl font-semibold text-foreground">
                  Promo activée
                </DialogTitle>
              </div>
              <DialogDescription className="text-left pt-2 text-muted-foreground font-sans text-sm leading-relaxed">
                Votre panier dépasse {FREE_SHIPPING_THRESHOLD_EUR} € : livraison offerte et réduction
                <strong className="text-foreground"> 2e article à −{SECOND_ITEM_DISCOUNT_PERCENT} %</strong> appliquée automatiquement.
                Choisissez l&apos;article concerné puis cliquez sur SUIVANT.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={closePromoPopup} className="w-full rounded-xl mt-4 font-semibold">
              J&apos;ai compris
            </Button>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Liste des articles */}
          <div className="w-full lg:w-[58%] space-y-5">
            {items.map((item, index) => {
              const hasDiscount = item.product.originalPrice > item.product.price;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.product.id}
                  className="group relative bg-card rounded-2xl border border-border/80 p-5 sm:p-6 flex gap-5 sm:gap-6 items-center shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-muted/50 flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0 py-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {item.product.category}
                    </p>
                    <h3 className="font-serif font-semibold text-xl text-foreground leading-tight line-clamp-2 tracking-tight">
                      {item.product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                      <span className="font-semibold text-primary text-lg tabular-nums">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="inline-flex items-center rounded-xl border border-border bg-muted/30 p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-card"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </Button>
                        <span className="font-medium text-sm w-8 text-center tabular-nums">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-card"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    onClick={() => removeItem(item.product.id)}
                    aria-label="Retirer du panier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Récapitulatif + CTA — style bloc paiement type e‑commerce */}
          <div className="w-full lg:w-[42%]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="sticky top-24 bg-card rounded-2xl border-2 border-border shadow-xl shadow-black/[0.06] overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-border cart-recap-gradient font-sans">
                <h2 className="text-xl font-bold text-foreground mb-5 tracking-tight">
                  Récapitulatif
                </h2>
                <div className="space-y-3 text-sm md:text-base font-normal tracking-normal text-foreground">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="tabular-nums font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {qualifiesForPromo && promoDiscountCents > 0 && promoItem && (
                    <div className="flex justify-between text-primary">
                      <span className="text-muted-foreground">Promo -{SECOND_ITEM_DISCOUNT_PERCENT}% (1 article)</span>
                      <span className="tabular-nums font-medium">-{formatPrice(promoDiscountCents)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-primary font-semibold">Offerte chez vous</span>
                      ) : (
                        <span className="tabular-nums font-medium">{formatPrice(shipping)}</span>
                      )}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Livraison à domicile uniquement (pas de point relais).
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-border">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 cart-recap-gradient font-sans font-medium tracking-wide">
                <Button
                  size="lg"
                  onClick={handlePayer}
                  className="w-full py-6 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  SUIVANT
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="rounded-xl p-5 sm:p-6 bg-gradient-to-br from-primary/15 via-primary/8 to-primary/5 border border-primary/20 shadow-inner">
                  <div className="flex items-center justify-center gap-2 text-foreground font-semibold text-sm tracking-wide">
                    <Lock className="w-4 h-4 shrink-0 text-primary" />
                    <span>Paiement sécurisé</span>
                  </div>
                  <p className="text-center text-sm text-foreground/90 leading-relaxed mt-3 font-medium max-w-sm mx-auto">
                    Nous travaillons avec WhatsApp pour le suivi. Paiement par carte ou PayPal après validation.
                  </p>
                  <p className="text-center text-xs font-medium text-foreground/80 mt-2 uppercase tracking-wider">
                    Paiement en ligne sécurisé
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {["Visa", "Mastercard", "CB", "PayPal", "Apple Pay"].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-white/70 border border-primary/15 text-xs font-semibold text-foreground shadow-sm"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
