import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UrgencyBanner } from "@/components/layout/UrgencyBanner";
import { TrustBar } from "@/components/layout/TrustBar";
import { PromoModal } from "@/components/layout/PromoModal";
import { PromoBar } from "@/components/layout/PromoBar";
import { PartnershipBar } from "@/components/layout/PartnershipBar";

// Pages
import { Home } from "@/pages/Home";
import { Catalog } from "@/pages/Catalog";
import { ProductDetails } from "@/pages/ProductDetails";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { Compte } from "@/pages/Compte";
import { OptionsLivraison } from "@/pages/OptionsLivraison";
import { CommandeConfirmee } from "@/pages/CommandeConfirmee";
import { CGV, Refund, Legal, Contact, FAQ } from "@/pages/StaticPages";
import { IntroGate, getIntroSeen } from "@/pages/IntroGate";
import { useState, useEffect } from "react";
import { useAccount } from "@/hooks/use-account";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function ProductDetailsWithBoundary() {
  return (
    <ErrorBoundary>
      <ProductDetails />
    </ErrorBoundary>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetailsWithBoundary} />
      <Route path="/cart" component={Cart} />
      <Route path="/compte" component={Compte} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/options-livraison" component={OptionsLivraison} />
      <Route path="/commande-confirmee" component={CommandeConfirmee} />

      {/* Static Pages */}
      <Route path="/cgv" component={CGV} />
      <Route path="/refund" component={Refund} />
      <Route path="/legal" component={Legal} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const hydrateAccount = useAccount((s) => s.hydrate);

  useEffect(() => {
    if (getIntroSeen()) setShowIntro(false);
  }, []);

  useEffect(() => {
    hydrateAccount();
  }, [hydrateAccount]);

  if (showIntro) {
    return (
      <IntroGate onEnter={() => setShowIntro(false)} />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col site-gradient">
          <UrgencyBanner />
          <TrustBar />
          <Navbar />
          <PromoModal />
          <main className="flex-grow pb-24 md:pb-20">
            <Router />
          </main>
          <Footer />
          <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col border-t border-primary/25 bg-card/98 backdrop-blur-xl shadow-[0_-1px_0_0_hsl(var(--border)),0_-2px_12px_0_hsl(var(--primary)/0.25),0_-1px_0_0_hsl(var(--primary)/0.4)]">
            <PromoBar />
            <PartnershipBar />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
