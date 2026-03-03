import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product details
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté avec succès.`,
      duration: 3000,
    });
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <motion.div 
        whileHover={{ y: -10, rotateY: 5, perspective: 1000 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 h-full flex flex-col relative"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-black">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
            loading="lazy"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-primary/90 text-white text-[9px] font-bold px-4 py-1 uppercase tracking-[0.2em] backdrop-blur-sm">
              Luxury Deal
            </span>
          </div>
          {discount > 0 && (
            <div className="absolute top-4 right-4">
              <span className="bg-destructive text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-md">
                -{discount}%
              </span>
            </div>
          )}
          </div>
          
          {/* Quick Add Button - fades in on hover for desktop */}
          <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 md:block hidden">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-white/90 text-foreground hover:bg-primary hover:text-primary-foreground backdrop-blur-sm shadow-lg rounded-xl"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            {product.category}
          </div>
          <h3 className="font-serif font-semibold text-lg text-foreground mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto flex items-end justify-between pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="font-bold text-xl text-foreground">
                {formatPrice(product.price)}
              </span>
            </div>
            
            {/* Mobile Add to Cart */}
            <Button 
              size="icon"
              variant="outline"
              onClick={handleAddToCart}
              className="md:hidden rounded-full border-border/80 text-foreground bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
