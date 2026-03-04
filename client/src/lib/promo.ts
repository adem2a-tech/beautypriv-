/** Seuil en centimes : au-dessus = livraison offerte + éligible 2e article -65% */
export const FREE_SHIPPING_THRESHOLD_CENTS = 40000; // 400€

/** Réduction du 2e article (en %) */
export const SECOND_ITEM_DISCOUNT_PERCENT = 65;

/** Supplément commande express (en centimes) */
export const EXPRESS_FEE_CENTS = 500; // 5€

export const FREE_SHIPPING_THRESHOLD_EUR = FREE_SHIPPING_THRESHOLD_CENTS / 100;
