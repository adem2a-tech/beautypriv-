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
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="inline-block py-1 px-6 border border-primary/40 text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              Exclusivité Privée
            </span>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold mb-8 text-white leading-tight tracking-tighter">
              L'EXCELLENCE <br/><span className="text-primary italic font-light">REDÉFINIE.</span>
            </h1>
            <p className="font-sans text-sm md:text-base mb-12 text-gray-400 tracking-[0.2em] uppercase max-w-xl">
              Dyson & GHD : L'innovation technologique au service de votre beauté. Jusqu'à -50%.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="rounded-none bg-white text-black hover:bg-primary hover:text-white px-12 py-8 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-500">
                Découvrir la collection
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="py-32 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { icon: ShieldCheck, title: "AUTHENTICITÉ GARANTIE", desc: "Produits scellés, provenance Darty & Boulanger." },
              { icon: Clock, title: "SÉLECTION LIMITÉE", desc: "Pièces rares en déstockage exclusif." },
              { icon: Zap, title: "LIVRAISON PRESTIGE", desc: "Expédition prioritaire sous 48h dans toute l'Europe." }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3 }}
                key={i} 
                className="text-center group"
              >
                <div className="w-12 h-12 text-primary mx-auto mb-8 transition-transform duration-500 group-hover:scale-110">
                  <feature.icon className="w-full h-full stroke-[1px]" />
                </div>
                <h3 className="font-serif text-xs font-bold tracking-[0.4em] mb-4 text-white uppercase">{feature.title}</h3>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 leading-loose">{feature.desc}</p>
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
