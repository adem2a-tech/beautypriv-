import { useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";

export function Catalog() {
  const { data: products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = ["Soin & beauté", "Électroménager premium", "Accessoires"];

  const filteredProducts = products?.filter(p => 
    activeCategory ? p.category === activeCategory : true
  ) || [];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">Catalogue Privé</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Explorez notre sélection de produits haut de gamme à des prix défiant toute concurrence. Quantités très limitées.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
            <Button 
              variant={activeCategory === null ? "default" : "outline"}
              className="rounded-full rounded-r-none whitespace-nowrap"
              onClick={() => setActiveCategory(null)}
            >
              Tous
            </Button>
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className={`rounded-full whitespace-nowrap ${activeCategory === null ? 'md:rounded-l-none' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center text-sm text-muted-foreground font-medium">
            <Filter className="w-4 h-4 mr-2" />
            {filteredProducts.length} résultat(s)
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {filteredProducts.map((product) => (
              <motion.div 
                layout 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-muted-foreground font-serif">Aucun produit ne correspond à vos critères.</p>
                <Button variant="outline" className="mt-6 rounded-full" onClick={() => setActiveCategory(null)}>Réinitialiser les filtres</Button>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
