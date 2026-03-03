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

// Pages
import { Home } from "@/pages/Home";
import { Catalog } from "@/pages/Catalog";
import { ProductDetails } from "@/pages/ProductDetails";
import { Cart } from "@/pages/Cart";
import { CGV, Refund, Legal, Contact, FAQ } from "@/pages/StaticPages";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
      
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <UrgencyBanner />
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
