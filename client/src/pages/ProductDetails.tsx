import { useState } from "react";
import { useParams, Link } from "wouter";
import { useProduct, useProductReviews } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { getProductGallery } from "@/lib/product-gallery";
import { ImageSlider } from "@/components/ui/image-slider";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { ShieldCheck, Truck, RefreshCw, ShoppingBag, Star, AlertTriangle, Clock, Minus, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function ProductDetails() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);
  const [quantity, setQuantity] = useState(1);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);

  const { data: product, isLoading } = useProduct(productId);
  const { data: reviews } = useProductReviews(productId);

  const addItem = useCart((state) => state.addItem);
  const cartItemCount = useCart((state) => state.getItemCount());
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-5 w-64 bg-muted rounded mb-8" />
        <div className="flex gap-12">
          <div className="w-full lg:w-1/2 aspect-[4/5] bg-muted rounded-2xl animate-pulse" />
          <div className="w-full lg:w-1/2 space-y-6 pt-0">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-12 bg-muted rounded w-full" />
            <div className="h-24 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-4xl mb-4">Produit introuvable</h2>
        <p className="text-muted-foreground mb-8">Ce produit a peut-être été victime de son succès.</p>
        <Link href="/catalog">
          <Button variant="outline">Retour au catalogue</Button>
        </Link>
      </div>
    );
  }

  const originalPrice = Number(product.originalPrice) || 1;
  const discount = Math.round((1 - (Number(product.price) || 0) / originalPrice) * 100);
  const reviewLabel = reviews && Array.isArray(reviews) && reviews.length > 0 ? `${reviews.length} avis` : "+1 200 avis";

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} × ${quantity} ajouté avec succès.`,
      duration: 3000,
    });
  };

  const rawImages = getProductGallery(String(product.name ?? ""), product.imageUrl);
  const productImages = Array.isArray(rawImages) ? rawImages.filter((url): url is string => Boolean(url)) : [];
  const safeImages = productImages.length > 0 ? productImages : (product.imageUrl ? [product.imageUrl] : []);
  const hasMultipleImages = safeImages.length > 1;
  const goExpandedPrev = () =>
    setExpandedImageIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const goExpandedNext = () =>
    setExpandedImageIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Catalogue", href: "/catalog" },
    { label: product.category, href: "/catalog" },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 lg:py-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <PageBreadcrumb items={breadcrumbItems} />

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-14">
          {/* Colonne image produit : centrée et agrandie (mobile + desktop) */}
          <div className="w-full lg:w-[48%] min-w-0 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full max-w-md lg:max-w-none aspect-[3/4] max-h-[55vh] sm:max-h-[60vh] md:max-h-none sm:aspect-[4/5] rounded-none overflow-visible bg-transparent neon-rose-led hover:neon-rose-led-strong transition-all duration-300"
            >
              <div className="absolute inset-[2px] rounded-none overflow-hidden bg-card/95">
                <ImageSlider
                  images={safeImages}
                  interval={5000}
                  className="w-full h-full"
                  onExpandClick={(i) => {
                    setExpandedImageIndex(Math.max(0, Math.min(i, safeImages.length - 1)));
                    setImageExpanded(true);
                  }}
                />
              </div>
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-md">
                  Offre Privée
                </span>
              </div>
            </motion.div>
          </div>

          {/* Colonne droite : infos produit — min-w-0 pour que le texte wrap sur mobile */}
          <div className="w-full lg:w-[52%] flex flex-col min-w-0">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="flex flex-col min-w-0"
            >
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-2">
                {product.category}
              </p>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                {product.brand ?? "DYSON"}
              </p>
              <h1 className="product-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3 sm:mb-4 break-words">
                {product.name}
              </h1>

              {/* Avis + note */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  4,9/5 · {reviewLabel}
                </span>
              </div>
              <div className="mb-5">
                <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                  Best-seller
                </span>
              </div>

              {/* Description — break-words pour ne plus couper en milieu de ligne sur mobile */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-5 break-words">
                {product.description}
              </p>

              {/* Détails du produit — bloc pour tous les produits */}
              <div className="font-sans mb-5 sm:mb-6 p-4 sm:p-5 rounded-xl bg-muted/40 border border-border">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Détails du produit</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground font-medium">Marque</dt>
                    <dd className="text-foreground font-semibold">{product.brand ?? "Dyson"}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-muted-foreground font-medium">Catégorie</dt>
                    <dd className="text-foreground font-semibold">{product.category}</dd>
                  </div>
                  {product.partnership && (
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-muted-foreground font-medium">Partenariat</dt>
                      <dd className="text-foreground font-semibold">{product.partnership}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Prix */}
              <div className="flex flex-wrap items-baseline gap-3 mb-6 pb-6 border-b border-border">
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-primary/15 text-primary font-bold px-2.5 py-1 rounded-md text-sm">
                  −{discount}%
                </span>
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock === 0 ? (
                  <div className="flex items-center text-muted-foreground font-semibold bg-muted/50 px-4 py-2.5 rounded-lg text-sm">
                    <Clock className="w-4 h-4 mr-2 shrink-0" />
                    Actuellement en rupture de stock
                  </div>
                ) : product.stock <= 10 ? (
                  <div className="flex items-center text-destructive font-semibold bg-destructive/10 px-4 py-2.5 rounded-lg text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                    Plus que {product.stock} en stock
                  </div>
                ) : (
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="w-4 h-4 mr-2 shrink-0" />
                    En stock
                  </div>
                )}
              </div>

              {/* Quantité */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                    Quantité
                  </label>
                  <div className="inline-flex items-center rounded-lg border border-border bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground hover:bg-muted transition-colors touch-manipulation"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold tabular-nums text-sm py-2">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground hover:bg-muted transition-colors touch-manipulation"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA principal */}
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-lg px-10 py-6 min-h-[48px] text-sm font-bold uppercase tracking-wider mb-4 touch-manipulation"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
              </Button>

              {/* Garanties — écriture simple, sans serif */}
              <div className="font-sans grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-card border border-border text-foreground">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Livraison 48/72h</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Expédition rapide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Paiement sécurisé</p>
                    <p className="text-sm text-muted-foreground mt-0.5">100% authentique</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Garantie 14 jours</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Satisfait ou remboursé</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Overlay plein écran : image agrandie + croix pour revenir */}
      {imageExpanded && safeImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Image agrandie"
          onClick={() => setImageExpanded(false)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setImageExpanded(false); }}
            className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Fermer et revenir au produit"
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goExpandedPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-7 h-7" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goExpandedNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-7 h-7" strokeWidth={2} />
              </button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()}>
          <img
            src={safeImages[expandedImageIndex] ?? safeImages[0] ?? ""}
            alt=""
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
          </div>
        </div>
      )}

      {/* Terminer le paiement — en bas à droite, synchro avec le panier navbar */}
      <Link
        href="/cart"
        className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-30 flex flex-col items-center gap-1 p-3 rounded-2xl bg-card/95 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:bg-card transition-all touch-manipulation min-w-[56px]"
        aria-label={`Terminer le paiement, ${cartItemCount} article${cartItemCount !== 1 ? "s" : ""} au panier`}
      >
        <span className="relative inline-flex">
          <ShoppingBag className="w-6 h-6 text-primary" strokeWidth={1.5} aria-hidden />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </span>
        <span className="text-[10px] font-semibold text-foreground/90 text-center leading-tight">
          Terminer le paiement
        </span>
      </Link>
    </div>
  );
}
