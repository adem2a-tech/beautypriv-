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
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover-lift h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Offre Privée
            </span>
            {discount > 0 && (
              <span className="bg-destructive text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md w-fit">
                -{discount}%
              </span>
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
