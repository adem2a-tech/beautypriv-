import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Product } from "@shared/schema";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const V16_NAME = "Aspirateur laveur Dyson V16 Piston Animal Submarine™";
const V16_IMAGE = "/images/dyson-v16-submarine-1.png";
const SPOT_SCRUB_NAME = "Aspirateur robot laveur Dyson Spot+Scrub™ Ai";
const SPOT_SCRUB_IMAGE = "/images/dyson-spot-scrub-1.png";

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté avec succès.`,
      duration: 3000,
    });
  };

  const discount = Math.round(
    (1 - product.price / product.originalPrice) * 100
  );
  const badgeLabel = discount >= 30 ? "Soldé" : "Exclusivité";

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{ y: -6 }}
        className="bg-card/90 backdrop-blur-xl overflow-hidden rounded-none border border-primary/25 shadow-[0_18px_60px_rgba(0,0,0,0.08)] neon-rose-led hover:neon-rose-led-strong hover-lift-luxe h-full flex flex-col transition-all duration-300"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-card border-b border-primary/20 rounded-none p-8 sm:p-4 md:p-0">
          <motion.img
            src={product.name === V16_NAME ? V16_IMAGE : product.name === SPOT_SCRUB_NAME ? SPOT_SCRUB_IMAGE : product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain object-center bg-muted/20 transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-primary border border-primary/30 text-[10px] font-semibold px-3 py-1.5 uppercase tracking-[0.18em] rounded-md shadow-sm">
              {badgeLabel}
            </span>
          </div>
          {discount > 0 && (
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1.5 rounded-md shadow-sm">
                −{discount}%
              </span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 hidden md:block">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1">
            {product.category}
          </p>
          <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5">
            {product.brand ?? "DYSON"}
          </p>
          <h3 className="product-title font-bold text-base text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 text-primary/90 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
            <span className="text-[11px] text-muted-foreground font-medium">4,9/5 · +1 200 avis</span>
          </div>

          {/* Prix : promo en avant, prix de base barré */}
          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {formatPrice(product.price)}
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleAddToCart}
              className="md:hidden shrink-0 rounded-lg border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary h-11 w-11 touch-target-safe"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
