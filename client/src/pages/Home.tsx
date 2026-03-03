import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { useProducts } from "@/hooks/use-products";
import { ShieldCheck, Clock, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.filter(p => p.isFeatured).slice(0, 4) || [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* landing page hero minimalist beauty products */}
        <img
          src="https://pixabay.com/get/gcd9144f06f22ff3ed36bf4bad386a2c3bdbd9f07d92376f375738476778c025421ecf0264c18fcedabd6afff71309fe6515a1e5fa7b0a0fbdc841bb914b68801_1280.jpg"
          alt="Premium Beauty Products"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold tracking-widest uppercase mb-6">
              Ventes Privées : -50% sur les grandes marques
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground leading-[1.1]">
              Le luxe <br/><span className="text-primary italic">à prix déstocké.</span>
            </h1>
            <p className="font-sans text-lg md:text-xl mb-10 text-muted-foreground leading-relaxed max-w-lg">
              Partenaire officiel des plus grandes enseignes (Darty, Boulanger, Fnac). 
              Des produits premium neufs et garantis, jusqu'à -50% toute l'année.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                Voir les offres
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Pourquoi nous choisir ?</h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: ShieldCheck, title: "100% Authentique", desc: "Tous nos produits proviennent de marques certifiées et vérifiées." },
              { icon: Clock, title: "Stock Limité", desc: "Des prix exclusifs dus à nos faibles quantités en déstockage." },
              { icon: Zap, title: "Expédition Rapide", desc: "Livraison sécurisée sous 48/72h pour toute commande en France." }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="bg-secondary/10 rounded-3xl p-8 text-center hover:bg-secondary/20 transition-colors border border-border/50"
              >
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Produits Vedettes</h2>
              <p className="text-muted-foreground mt-2">Les offres les plus prisées du moment.</p>
            </div>
            <Link href="/catalog" className="hidden sm:inline-flex text-primary font-semibold hover:underline">
              Voir tout le catalogue &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center sm:hidden">
            <Link href="/catalog">
              <Button variant="outline" className="rounded-full w-full">Voir tout le catalogue</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Elles nous font confiance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sophie M.", text: "Des prix imbattables pour des produits de beauté que j'adore. Expédition super rapide !" },
              { name: "Claire D.", text: "Le lisseur haut de gamme que je voulais à -40%. Authentique et reçu dans une boîte parfaite." },
              { name: "Julie R.", text: "Concept génial. Le service client est très réactif et les produits sont incroyables." }
            ].map((review, i) => (
              <div key={i} className="bg-background rounded-3xl p-8 border border-border shadow-sm">
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-foreground italic mb-6">"{review.text}"</p>
                <div className="font-semibold">{review.name}</div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <ShieldCheck className="w-3 h-3 mr-1 text-green-600" /> Achat vérifié
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
