import { useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Filter, Star, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, RESERVE_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { motion } from "framer-motion";

export function Catalog() {
  const { data: products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = ["Soin & beauté", "Électroménager premium", "Accessoires"];

  const filteredProducts =
    products?.filter((p) =>
      activeCategory ? p.category === activeCategory : true
    ) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Catalogue" }]} />

        {/* Titre + filtres — style boutique pro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="product-title text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Catalogue
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            Produits haut de gamme à prix déstockage. Quantités limitées.
            <span className="text-primary font-semibold text-xs inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" /> 4,9/5 · +1 200 avis
            </span>
          </p>
        </div>

        {/* Onglets catégories + résultat */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-10 py-4 px-0 md:px-4 rounded-xl bg-card border border-border/80">
          <div className="scroll-touch flex items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar snap-x snap-mandatory md:snap-none scroll-smooth touch-manipulation">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              className={
                "shrink-0 snap-center touch-manipulation min-h-[44px] " +
                (activeCategory === null
                  ? "rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  : "rounded-lg border-border text-muted-foreground hover:text-foreground hover:border-primary/40 bg-transparent")
              }
              onClick={() => setActiveCategory(null)}
            >
              Tous
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className={
                  "shrink-0 snap-center touch-manipulation min-h-[44px] " +
                  (activeCategory === cat
                    ? "rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                    : "rounded-lg border-border text-muted-foreground hover:text-foreground hover:border-primary/40 bg-transparent")
                }
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="hidden md:flex items-center text-sm text-muted-foreground font-medium">
            <Filter className="w-4 h-4 mr-2 opacity-70" />
            {filteredProducts.length} résultat(s)
          </div>
        </div>

        {/* Produits en réserve + WhatsApp si pas sur le site */}
        <div className="mb-8 p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground/90 font-medium mb-3">
            Des produits sont disponibles <strong className="text-primary">en réserve</strong>. Un produit n&apos;est pas sur le site ? Contactez-nous sur WhatsApp pour vérifier la disponibilité — nous sommes le <strong>best déstockage</strong>.
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Ce lien ouvre un message type « produit absent du site, est-il en réserve ? » — pas pour finaliser une commande (commande = panier puis Options de livraison).
          </p>
          <a
            href={getWhatsAppUrl(RESERVE_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Vérifier dispo en réserve via WhatsApp
          </a>
        </div>

        {/* Grille produits */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-[420px] rounded-sm bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.2 },
              },
              hidden: {},
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <p className="font-serif text-xl text-muted-foreground mb-6">
                  Aucun produit ne correspond à vos critères.
                </p>
                <Button
                  variant="outline"
                  className="rounded-sm border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => setActiveCategory(null)}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
