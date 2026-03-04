/** Remplacer par le numéro au format international sans + (ex: 33612345678) */
export const WHATSAPP_NUMBER = "33780935682";

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function getOrderMessage(productNames: string[]): string {
  const list = productNames.join(", ");
  return `Bonjour, je souhaite commander : ${list}`;
}

/** Message pour demander si un produit (non sur le site) est dispo en réserve */
export const RESERVE_WHATSAPP_MESSAGE =
  "Bonjour, un produit que je cherche n'est pas sur le site. Est-il disponible en réserve ? Merci - Beauty Privé best déstockage.";
