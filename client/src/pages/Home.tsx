import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useProducts } from "@/hooks/use-products";
import { ShieldCheck, Clock, Zap, Star, Quote, BadgeCheck, MessageCircle } from "lucide-react";
import { getWhatsAppUrl, RESERVE_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.filter(p => p.isFeatured).slice(0, 4) || [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section — full-bleed, overlay left:0 pour éviter décalage */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden w-full isolate">
        <div className="absolute top-0 left-0 right-0 bottom-0 w-full min-w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/hero_video.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full min-w-full bg-black/60"
            style={{ left: 0 }}
            aria-hidden
          />
        </div>

        {/* Badge Élu Produit de l'Année */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10" aria-hidden>
          <img
            src="/images/elu-produit-annee.png"
            alt="Élu Produit de l'Année"
            className="h-12 w-auto object-contain md:h-16 drop-shadow-lg"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="inline-block py-2 px-6 border border-primary/50 text-primary text-[10px] font-medium tracking-[0.35em] uppercase mb-4 md:mb-8">
              Exclusivité Privée
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-medium mb-4 md:mb-8 text-white leading-tight tracking-tight">
              L'EXCELLENCE <br/><span className="text-primary italic font-light">REDÉFINIE.</span>
            </h1>
            <p className="font-sans text-sm md:text-base mb-6 md:mb-12 text-white/60 tracking-[0.2em] uppercase max-w-xl font-light">
              Dyson & GHD : L'innovation au service de votre beauté. Jusqu'à −50%.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="rounded-sm bg-white text-black hover:bg-primary/20 hover:text-primary hover:border hover:border-primary/50 px-12 py-8 text-xs font-medium tracking-[0.3em] uppercase transition-all duration-500">
                Voir nos offres
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/80 to-transparent"></div>
        </div>
      </section>

      {/* Chiffres animés — dégradé rose doux */}
      <section className="py-16 md:py-20 section-reviews-gradient border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center text-foreground mb-12 tracking-tight">
            Des chiffres qui inspirent confiance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <AnimatedCounter value="1200+" label="Clients satisfaits" delay={0} />
            <AnimatedCounter value="4.9/5" label="Note moyenne" delay={250} />
            <AnimatedCounter value="3500+" label="Produits vendus" delay={500} />
            <AnimatedCounter value="48" label="Délai de livraison moyen (h)" delay={750} />
          </div>
        </div>
      </section>

      {/* USPs Section — dégradé + confiance */}
      <section className="py-24 md:py-32 cart-recap-gradient border-y border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { icon: ShieldCheck, title: "AUTHENTICITÉ GARANTIE", desc: "Produits scellés, provenance Darty & Boulanger. Vous achetez en toute sérénité." },
              { icon: Clock, title: "SÉLECTION LIMITÉE", desc: "Pièces rares en déstockage exclusif. Qualité contrôlée." },
              { icon: Zap, title: "LIVRAISON PRESTIGE", desc: "Expédition prioritaire sous 48h dans toute l'Europe. Suivi jusqu'à chez vous." }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="text-center group"
              >
                <div className="w-12 h-12 text-primary mx-auto mb-8 transition-transform duration-500 ease-out group-hover:scale-110">
                  <feature.icon className="w-full h-full stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-xs font-semibold tracking-[0.25em] mb-4 text-foreground uppercase">{feature.title}</h3>
                <p className="text-sm tracking-wide text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-24 section-reviews-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground tracking-tight">Produits Vedettes</h2>
              <p className="text-muted-foreground mt-2 font-medium tracking-wide">Sélection premium, qualité garantie.</p>
              <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> 4,9/5 · +1 200 avis clients
              </p>
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
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
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

      {/* Pourquoi nos prix sont-ils si bas ? */}
      <section className="py-20 cart-recap-gradient border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">
              Transparence & confiance
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium tracking-wide">
              Beauty Privé est un déstockage premium : nous proposons les meilleures marques en toute transparence, sans jamais compromettre l&apos;authenticité.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm md:text-base text-muted-foreground font-medium tracking-wide">
            <div className="space-y-3">
              <p>
                • <span className="font-semibold text-foreground">Partenariats avec les grandes enseignes</span> :
                nous rachetons les invendus, fins de séries et anciens packagings de groupes comme{" "}
                <span className="font-semibold">Darty</span> ou <span className="font-semibold">Boulanger</span>.
              </p>
              <p>
                • <span className="font-semibold text-foreground">Prix cassés, quantité limitée</span> : nous ajustons
                les remises en fonction de la demande et de la hype du produit. Quand le stock ou l&apos;offre est
                épuisé, le prix revient simplement au tarif public conseillé.
              </p>
            </div>
            <div className="space-y-3">
              <p>
                • <span className="font-semibold text-foreground">100% authentique</span> : tous nos produits sont
                neufs, scellés, contrôlés et proviennent de circuits officiels uniquement.
              </p>
              <p>
                • <span className="font-semibold text-foreground">Aucune surprise</span> : les réductions affichées
                sont réelles, et visibles immédiatement dans votre panier. Si une promo disparaît, c&apos;est que
                l&apos;opération est terminée – jamais parce que le produit est différent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Produits en réserve — best déstockage (message réserve uniquement, pas commande) */}
      <section className="py-10 sm:py-14 cart-recap-gradient border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-foreground/90 font-medium mb-4">
            Des produits sont disponibles <strong className="text-primary">en réserve</strong>. Un produit n&apos;est pas sur le site ? Contactez-nous sur WhatsApp pour vérifier la disponibilité — nous sommes le <strong>best déstockage</strong>.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Ce lien envoie un message « produit absent du site, est-il en réserve ? » — pour commander, utilisez le panier puis Options de livraison.
          </p>
          <a
            href={getWhatsAppUrl(RESERVE_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Vérifier dispo en réserve
          </a>
        </div>
      </section>

      {/* Avis clients — dégradé rose luxe & confiance */}
      <section className="py-12 sm:py-24 md:py-32 section-reviews-gradient border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-[10px] font-semibold tracking-[0.35em] uppercase text-primary mb-4 text-trust">
              Témoignages vérifiés
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 tracking-tight">
              La confiance de nos clientes
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-6 font-medium tracking-wide text-trust">
              Plus de 1&nbsp;200 clientes nous font confiance. Des avis authentiques, des retours sincères.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-5 py-2.5 shadow-sm">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-primary text-primary" />)}
              <span className="text-sm font-bold text-foreground">4,9/5</span>
              <span className="text-muted-foreground text-xs font-medium">· Avis vérifiés</span>
            </div>
          </div>
          <div className="scroll-touch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scroll-smooth touch-manipulation [scroll-padding-inline:1rem] md:[scroll-padding-inline:0]">
            {[
              { name: "Marie L.", city: "Lyon", text: "Dyson reçu en parfait état, livraison ultra rapide. Je recommande en toute confiance.", date: "Il y a 2 semaines" },
              { name: "Thomas B.", city: "Paris", text: "Prix imbattables, suivi WhatsApp rassurant. Une équipe sérieuse et réactive.", date: "Il y a 1 mois" },
              { name: "Sarah K.", city: "Marseille", text: "GHD neuf, scellé, avec facture. Authenticité garantie, j'ai eu raison de leur faire confiance.", date: "Il y a 3 semaines" },
              { name: "Karim D.", city: "Lille", text: "Vrais partenariats, prix justes. J'ai commandé en toute sérénité.", date: "Il y a 2 mois" },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 }}
                className="group relative bg-card/90 backdrop-blur-sm rounded-2xl p-6 lg:p-7 border-2 border-border/60 shadow-md shadow-black/[0.04] hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 shrink-0 w-[min(100%,340px)] md:w-auto snap-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl" />
                <Quote className="absolute top-5 right-5 w-9 h-9 text-primary/15 pointer-events-none" strokeWidth={1} />
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 rounded-xl border-2 border-primary/20 shrink-0 shadow-sm">
                    <AvatarFallback className="bg-primary/15 text-primary font-semibold text-sm rounded-xl">
                      {review.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-semibold text-foreground text-[15px] tracking-wide">{review.name}</span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-primary font-semibold tracking-wide">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Avis vérifié
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium tracking-wide mt-0.5">{review.city}</div>
                    <div className="flex text-primary mt-1.5">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="font-serif text-foreground/95 text-[15px] leading-[1.75] mb-5 italic font-medium">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">{review.date}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
