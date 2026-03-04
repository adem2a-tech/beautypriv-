import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  getOrderPayload,
  getOrderFromCart,
  getOrderWhatsAppUrl,
  getOrderFromCartWhatsAppUrl,
  clearOrderPayload,
  clearOrderFromCart,
  type OrderFromCart,
} from "@/lib/order";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Truck } from "lucide-react";
import confetti from "canvas-confetti";

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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

type PayloadType = "full" | "from_cart";

export function CommandeConfirmee() {
  const [, setLocation] = useLocation();
  const [payloadType, setPayloadType] = useState<PayloadType | null>(null);
  const [orderFromCart, setOrderFromCart] = useState<OrderFromCart | null>(null);
  const hasFiredConfetti = useRef(false);
  const hasOpenedWhatsApp = useRef(false);
  const [openingWhatsApp, setOpeningWhatsApp] = useState(false);

  useEffect(() => {
    const fullPayload = getOrderPayload();
    if (fullPayload) {
      setPayloadType("full");
      if (!hasFiredConfetti.current) {
        hasFiredConfetti.current = true;
        fireConfetti();
      }
      return;
    }
    const cartOrder = getOrderFromCart();
    if (cartOrder) {
      setPayloadType("from_cart");
      setOrderFromCart(cartOrder);
      if (!hasFiredConfetti.current) {
        hasFiredConfetti.current = true;
        fireConfetti();
      }
      return;
    }
    setLocation("/cart");
  }, [setLocation]);

  const handleOpenWhatsApp = () => {
    if (hasOpenedWhatsApp.current) return;
    hasOpenedWhatsApp.current = true;
    setOpeningWhatsApp(true);

    if (payloadType === "full") {
      const payload = getOrderPayload();
      if (!payload) return;
      fireConfetti();
      window.open(getOrderWhatsAppUrl(payload), "_blank", "noopener,noreferrer");
      clearOrderPayload();
      return;
    }
    if (payloadType === "from_cart" && orderFromCart) {
      fireConfetti();
      window.open(getOrderFromCartWhatsAppUrl(orderFromCart), "_blank", "noopener,noreferrer");
      clearOrderFromCart();
    }
  };

  if (payloadType === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">Redirection…</p>
      </div>
    );
  }

  const isFromCart = payloadType === "from_cart";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16"
    >
      <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center text-primary mb-6">
        <CheckCircle2 className="w-10 h-10" strokeWidth={2} />
      </div>
      <h1 className="product-title text-2xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
        {isFromCart ? "En cours de finalisation" : "Commande enregistrée"}
      </h1>
      <p className="text-muted-foreground mb-4 max-w-lg">
        {isFromCart
          ? "C'est la dernière étape avant que votre commande soit créée. Sans envoi sur WhatsApp : pas de livraison, pas de suivi, pas de commande enregistrée."
          : "Un dernier pas : envoyez votre commande sur WhatsApp."}
      </p>
      {isFromCart && orderFromCart && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 px-4 py-2 rounded-xl bg-muted/50">
          <Truck className="w-4 h-4 text-primary shrink-0" />
          <span>
            {orderFromCart.deliveryType === "relais" ? "Point relais" : "Livraison à domicile"}
            {orderFromCart.express ? " · Commande express" : ""}
          </span>
        </div>
      )}
      <p className="text-foreground/90 mb-6 max-w-md text-sm font-medium">
        Envoyez votre commande sur WhatsApp pour que nous créions votre commande, mettions en place le suivi colis et organisions la livraison. Le message contiendra votre panier et votre adresse — ce n&apos;est pas une demande de réserve.
      </p>
      <Button
        size="lg"
        onClick={handleOpenWhatsApp}
        disabled={openingWhatsApp}
        className="rounded-xl py-6 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-3 shadow-lg shadow-primary/25"
      >
        {WHATSAPP_ICON}
        {openingWhatsApp ? "Ouverture de WhatsApp…" : "Envoyer ma commande sur WhatsApp"}
      </Button>
      <p className="text-xs text-muted-foreground mt-6 max-w-sm">
        Après envoi du message, nous créons votre commande, vous confirmons et mettons en place le suivi. Sans cette étape, la commande n'est pas finalisée.
      </p>
      <p className="text-sm text-foreground/90 mt-4 font-medium">
        Le suivi se fait sur WhatsApp pour faciliter le suivi.
      </p>
      <Link href="/catalog" className="mt-8 text-sm text-primary hover:underline font-medium">
        Continuer mes achats
      </Link>
    </motion.div>
  );
}
