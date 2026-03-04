import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const INTRO_SEEN_KEY = "beauty-prive-intro-seen";

export function setIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // ignore
  }
}

export function getIntroSeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

interface IntroGateProps {
  onEnter: () => void;
}

export function IntroGate({ onEnter }: IntroGateProps) {
  const handleEnter = () => {
    setIntroSeen();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col lg:flex-row bg-background">
      {/* Partie gauche : vidéo Dyson */}
      <div className="relative w-full lg:w-[55%] h-[45vh] lg:h-full min-h-[280px] bg-black overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
        >
          <source src="/intro-dyson.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        {/* Badge Élu produit de l'année */}
        <div className="absolute top-4 right-4 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-white shadow-lg shadow-black/40 border border-white/70">
          <img
            src="/images/elu-produit-annee.png"
            alt="Élu Produit de l'année"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:max-w-xs space-y-2">
          <p className="inline-flex items-center gap-2 text-white/90 text-[11px] md:text-xs font-medium tracking-[0.18em] uppercase">
            <span className="inline-block h-px w-6 bg-white/60" aria-hidden />
            Partenariat officiel Darty · Boulanger
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-4 py-2">
            <span className="text-yellow-300 text-sm">★★★★★</span>
            <span className="text-[11px] md:text-xs text-white/90 font-medium">
              Approuvé par plus de 1&nbsp;200 clientes
            </span>
          </div>
        </div>
      </div>

      {/* Partie droite : accès au site */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-card text-card-foreground">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col items-center gap-2 mb-3">
            <span className="font-serif text-3xl md:text-4xl font-medium text-foreground tracking-tight">
              Beauty
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
              <span className="font-sans text-xs font-medium tracking-[0.3em] text-foreground/80 uppercase">
                Privé
              </span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm md:text-base mt-6 mb-6 leading-relaxed">
            L’excellence en déstockage beauté, approuvée par des clientes exigeantes.
            Produits Dyson, GHD et soins premium jusqu’à <span className="font-semibold text-primary">-65&nbsp;%</span>,
            100&nbsp;% authentiques et garantis.
          </p>
          <div className="flex flex-col items-center gap-3 mb-8 text-xs md:text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[11px] md:text-xs uppercase tracking-[0.16em]">
                +1&nbsp;200 avis clients ★ 4,9/5
              </span>
              <span className="px-3 py-1 rounded-full border border-muted-foreground/20 bg-muted/10 text-[11px] md:text-xs uppercase tracking-[0.16em]">
                Paiement sécurisé &amp; stocks limités
              </span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleEnter}
            className="w-full sm:w-auto rounded-xl py-6 px-10 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Entrer sur le site
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
