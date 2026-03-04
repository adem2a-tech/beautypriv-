/**
 * Galeries d'images par produit (photos fournies par le client).
 * Clé = nom exact du produit tel qu'en BDD.
 */
const PRODUCT_GALLERIES: Record<string, string[]> = {
  "Aspirateur robot laveur Dyson Spot+Scrub™ Ai": [
    "/images/dyson-spot-scrub-1.png",
    "/images/dyson-spot-scrub-2.png",
    "/images/dyson-spot-scrub-3.png",
    "/images/dyson-spot-scrub-4.png",
    "/images/dyson-spot-scrub-5.png",
  ],
  "Aspirateur laveur Dyson V16 Piston Animal Submarine™": [
    "/images/dyson-v16-submarine-1.png",
    "/images/dyson-v16-submarine-2.png",
    "/images/dyson-v16-submarine-3.png",
    "/images/dyson-v16-submarine-4.png",
    "/images/dyson-v16-submarine-5.png",
    "/images/dyson-v16-submarine-6.png",
  ],
  "Dyson Airwrap Coanda 2x": [
    "/images/airwrap-coanda-2x-1.png",
    "/images/airwrap-coanda-2x-2.png",
    "/images/airwrap-coanda-2x-3.png",
    "/images/airwrap-coanda-2x-4.png",
  ],
  "Multi-styler Dyson Airwrap i.d™ - cheveux bouclés à frisés (Soie Ambrée)": [
    "/images/airwrap-id-soie-ambree-1.png",
    "/images/airwrap-id-soie-ambree-2.png",
    "/images/airwrap-id-soie-ambree-3.png",
    "/images/airwrap-id-soie-ambree-4.png",
    "/images/airwrap-id-soie-ambree-5.png",
    "/images/airwrap-id-soie-ambree-6.png",
  ],
  "Dyson Airwrap™ Complete Long Volumise": [
    "/images/dyson-airwrap-complete-long-1.png",
    "/images/dyson-airwrap-complete-long-2.png",
    "/images/dyson-airwrap-complete-long-3.png",
  ],
  "Multi-styler Dyson Airwrap i.d™ - cheveux bouclés à frisés (Bleu de Prusse/Cuivré)": [
    "/images/airwrap-id-bleu-prusse-1.png",
    "/images/airwrap-id-bleu-prusse-2.png",
    "/images/airwrap-id-bleu-prusse-3.png",
    "/images/airwrap-id-bleu-prusse-4.png",
  ],
  "Lisseur GHD Chronos Noir à plaques classiques (plaques 26 mm)": [
    "/images/ghd-chronos-noir-1.png",
    "/images/ghd-chronos-noir-2.png",
    "/images/ghd-chronos-noir-3.png",
    "/images/ghd-chronos-noir-4.png",
    "/images/ghd-chronos-noir-5.png",
  ],
};

export function getProductGallery(productName: string, fallbackImageUrl: string): string[] {
  const gallery = PRODUCT_GALLERIES[productName];
  if (gallery && gallery.length > 0) return gallery;
  return [fallbackImageUrl];
}
