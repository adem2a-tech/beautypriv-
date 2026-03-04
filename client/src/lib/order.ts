import { formatPrice } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SECOND_ITEM_DISCOUNT_PERCENT } from "@/lib/promo";
import type { CartItem } from "@/hooks/use-cart";

export interface DeliveryInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  comment?: string;
}

export interface OrderPayload {
  delivery: DeliveryInfo;
  items: { productName: string; quantity: number; priceCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

/** Commande enregistrée depuis le panier : options livraison → WhatsApp pour suivi colis */
export type DeliveryType = "domicile" | "relais";
export type PaymentMethod = "paypal" | "bancaire" | "apple_pay";
export interface OrderFromCartDeliveryAddress {
  address: string;
  /** Bâtiment, étage, appartement, digicode, etc. */
  complement?: string;
  postalCode: string;
  city: string;
}
export interface OrderFromCart {
  items: { productName: string; quantity: number; priceCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  deliveryType?: DeliveryType;
  express?: boolean;
  /** Moyen de paiement choisi */
  paymentMethod?: PaymentMethod;
  /** Adresse de livraison (obligatoire si deliveryType === "domicile") */
  deliveryAddress?: OrderFromCartDeliveryAddress;
}

const STORAGE_KEY = "beauty-prive-order-pending";
const CART_ORDER_KEY = "beauty-prive-order-from-cart";

export function saveOrderPayload(payload: OrderPayload): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function getOrderPayload(): OrderPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderPayload;
  } catch {
    return null;
  }
}

export function clearOrderPayload(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function buildOrderMessage(payload: OrderPayload): string {
  const lines = payload.items.map(
    (i) => `${i.quantity}× ${i.productName} — ${formatPrice(i.priceCents)}`,
  );
  const shippingLine =
    payload.shippingCents === 0
      ? "Livraison : Offerte (dès 400€)"
      : `Livraison : ${formatPrice(payload.shippingCents)}`;
  const d = payload.delivery;
  return (
    `Bonjour, je souhaite finaliser ma commande Beauty Privé.\n\n` +
    `— COMMANDE —\n` +
    lines.map((l) => `• ${l}`).join("\n") +
    `\n\n${shippingLine}\nTotal : ${formatPrice(payload.totalCents)}\n\n` +
    `— LIVRAISON —\n` +
    `${d.firstName} ${d.lastName}\n` +
    `${d.address}\n${d.postalCode} ${d.city}\n` +
    `Email : ${d.email}\nTél : ${d.phone}\n` +
    (d.comment ? `Commentaire : ${d.comment}\n` : "") +
    `\nPaiement par Visa, Mastercard ou PayPal.\n` +
    `Merci de me confirmer la disponibilité et l'offre 2e article à -${SECOND_ITEM_DISCOUNT_PERCENT}% si applicable.`
  );
}

export function getOrderWhatsAppUrl(payload: OrderPayload): string {
  return getWhatsAppUrl(buildOrderMessage(payload));
}

export function orderPayloadFromCart(items: CartItem[], shippingCents: number): Omit<OrderPayload, "delivery"> {
  const subtotalCents = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const totalCents = subtotalCents + shippingCents;
  return {
    items: items.map((i) => ({
      productName: i.product.name,
      quantity: i.quantity,
      priceCents: i.product.price,
    })),
    subtotalCents,
    shippingCents,
    totalCents,
  };
}

export function orderFromCartFromItems(
  items: CartItem[],
  shippingCents: number,
  totalCentsOverride?: number
): OrderFromCart {
  const subtotalCents = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const totalCents = totalCentsOverride ?? subtotalCents + shippingCents;
  return {
    items: items.map((i) => ({
      productName: i.product.name,
      quantity: i.quantity,
      priceCents: i.product.price,
    })),
    subtotalCents,
    shippingCents,
    totalCents,
  };
}

export function saveOrderFromCart(order: OrderFromCart): void {
  try {
    sessionStorage.setItem(CART_ORDER_KEY, JSON.stringify(order));
  } catch {
    // ignore
  }
}

export function getOrderFromCart(): OrderFromCart | null {
  try {
    const raw = sessionStorage.getItem(CART_ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderFromCart;
  } catch {
    return null;
  }
}

export function clearOrderFromCart(): void {
  try {
    sessionStorage.removeItem(CART_ORDER_KEY);
  } catch {
    // ignore
  }
}

/** Message WhatsApp : "Bonjour Beauty Privé, je souhaitais finaliser ma commande. Ma commande :" + détail. */
export function buildOrderMessageFromCart(order: OrderFromCart): string {
  const lines = order.items.map(
    (i) => `${i.quantity}× ${i.productName} — ${formatPrice(i.priceCents)}`,
  );
  const shippingLine =
    order.shippingCents === 0
      ? "Livraison : Offerte (dès 400€)" + (order.express ? " + Express" : "")
      : `Livraison : ${formatPrice(order.shippingCents)}` + (order.express ? " + Express" : "");
  const livraisonChoice =
    order.deliveryType === "relais"
      ? "Point relais (je vous indiquerai lequel par message)."
      : order.deliveryAddress
        ? `Livraison à domicile :\n${order.deliveryAddress.address}${order.deliveryAddress.complement?.trim() ? `\n${order.deliveryAddress.complement.trim()}` : ""}\n${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}`
        : "Livraison à mon adresse (je vous l'indiquerai par message).";
  const expressLine = order.express
    ? "\nLivraison express : Oui (commande express demandée)."
    : "";
  const paymentLabels: Record<PaymentMethod, string> = {
    paypal: "PayPal",
    bancaire: "Carte bancaire (Visa, Mastercard, CB)",
    apple_pay: "Apple Pay",
  };
  const paymentLine = order.paymentMethod
    ? `\n— PAIEMENT —\n${paymentLabels[order.paymentMethod]}\n\n`
    : "\n";
  return (
    `Bonjour Beauty Privé, je souhaitais finaliser ma commande Beauty Privé. Ma commande :\n\n` +
    `— MA COMMANDE —\n` +
    lines.map((l) => `• ${l}`).join("\n") +
    `\n\n${shippingLine}\nTotal : ${formatPrice(order.totalCents)}\n\n` +
    `— LIVRAISON —\n${livraisonChoice}${expressLine}` +
    paymentLine +
    `Merci de confirmer ma commande et de mettre en place le suivi colis.`
  );
}

export function getOrderFromCartWhatsAppUrl(order: OrderFromCart): string {
  return getWhatsAppUrl(buildOrderMessageFromCart(order));
}
