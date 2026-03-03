import { useParams } from "wouter";
import { useProduct, useProductReviews } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Truck, RefreshCw, ShoppingBag, Star, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function ProductDetails() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);
  
  const { data: product, isLoading } = useProduct(productId);
  const { data: reviews } = useProductReviews(productId);
  
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex gap-12 animate-pulse">
        <div className="w-full lg:w-1/2 aspect-square bg-muted rounded-3xl"></div>
        <div className="w-full lg:w-1/2 space-y-6 pt-8">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-4xl mb-4">Produit introuvable</h2>
        <p className="text-muted-foreground mb-8">Ce produit a peut-être été victime de son succès.</p>
      </div>
    );
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  
  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté avec succès.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Images Section */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-border shadow-md"
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-accent text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                  Offre Privée
                </span>
              </div>
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                {product.category}
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-muted-foreground underline cursor-pointer">
                  {reviews?.length || 12} avis clients
                </span>
              </div>

              <div className="flex items-end space-x-4 mb-6 pb-6 border-b border-border">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl text-muted-foreground line-through decoration-destructive mb-1">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-destructive/10 text-destructive font-bold px-3 py-1 rounded-full text-sm mb-1">
                  Économisez {discount}%
                </span>
              </div>

              <div className="mb-8">
                {product.stock <= 10 ? (
                  <div className="flex items-center text-destructive font-semibold bg-destructive/10 px-4 py-3 rounded-xl">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Urgence : Plus que {product.stock} exemplaires en stock !
                  </div>
                ) : (
                  <div className="flex items-center text-orange-600 font-semibold bg-orange-50 px-4 py-3 rounded-xl">
                    <Clock className="w-5 h-5 mr-2" />
                    Stocks limités : Plus que {product.stock} exemplaires.
                  </div>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
                {product.description}
              </p>

              <Button 
                size="lg" 
                className="w-full sm:w-auto px-12 py-7 text-lg rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all duration-300 mb-12"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-6 h-6 mr-3" />
                Ajouter au panier
              </Button>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-border">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><Truck className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold text-sm">Livraison 48/72h</h4>
                    <p className="text-xs text-muted-foreground mt-1">Expédition rapide depuis nos entrepôts français.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold text-sm">Paiement sécurisé</h4>
                    <p className="text-xs text-muted-foreground mt-1">Transactions cryptées via Stripe / Apple Pay.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:col-span-2">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><RefreshCw className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-semibold text-sm">Garantie 14 jours</h4>
                    <p className="text-xs text-muted-foreground mt-1">Satisfait ou remboursé. Retours simplifiés.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
