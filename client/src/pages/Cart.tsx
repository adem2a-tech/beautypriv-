import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const { toast } = useToast();

  const subtotal = getTotal();
  const shipping = subtotal > 10000 ? 0 : 590; // Free shipping over 100€
  const total = subtotal + shipping;

  const handleCheckoutMock = () => {
    toast({
      title: "Redirection vers le paiement...",
      description: "Ceci est une simulation de passage en caisse.",
      duration: 3000,
    });
    setTimeout(() => {
      clearCart();
      toast({
        title: "Commande confirmée !",
        description: "Merci pour votre achat sur Beauty Privé.",
      });
      window.location.href = "/";
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
          <Trash2 className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl mb-4 font-bold">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-8">Découvrez nos offres exclusives et ajoutez vos coups de cœur.</p>
        <Link href="/catalog">
          <Button size="lg" className="rounded-full px-8">Continuer mes achats</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-foreground">Votre Panier</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Items List */}
          <div className="w-full lg:w-2/3 space-y-6">
            {items.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.product.id} 
                className="bg-white p-4 sm:p-6 rounded-3xl border border-border flex gap-6 items-center shadow-sm"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight mb-1 line-clamp-2">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase">{item.product.category}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div className="font-bold text-lg">{formatPrice(item.product.price)}</div>
                    
                    <div className="flex items-center space-x-3 bg-muted/50 rounded-full p-1 border border-border">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white" 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 absolute top-4 sm:top-6 right-4 sm:right-6"
                  onClick={() => removeItem(item.product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl border border-border sticky top-28 shadow-lg shadow-black/5">
              <h3 className="font-serif text-2xl font-bold mb-6">Récapitulatif</h3>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-green-600 font-bold">Gratuite</span> : formatPrice(shipping)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-3xl">{formatPrice(total)}</span>
              </div>

              <Button 
                size="lg" 
                className="w-full py-6 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 mb-6"
                onClick={handleCheckoutMock}
              >
                Procéder au paiement <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="flex flex-col items-center justify-center space-y-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                  Paiement 100% sécurisé
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 border border-border rounded font-bold bg-muted/30">Stripe</span>
                  <span className="px-2 py-1 border border-border rounded font-bold bg-muted/30">Apple Pay</span>
                  <span className="px-2 py-1 border border-border rounded font-bold bg-muted/30">CB</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
