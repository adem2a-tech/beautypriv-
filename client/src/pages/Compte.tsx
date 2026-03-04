import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAccount } from "@/hooks/use-account";
import { validatePhone, PHONE_GUIDE, PHONE_COUNTRY_OPTIONS, formatPhoneForCountry, limitDigitsForCountry, type PhoneCountry } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { User, LogOut, Lock } from "lucide-react";
import { motion } from "framer-motion";

const inputClass =
  "w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20";

export function Compte() {
  const [, setLocation] = useLocation();
  const { account, isLoggedIn, setAccount, logout, hydrate } = useAccount();
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<PhoneCountry>("FR");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ phone?: string; firstName?: string; lastName?: string }>({});
  const [redirectFrom, setRedirectFrom] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      if (from) setRedirectFrom(from);
    }
  }, []);

  useEffect(() => {
    if (account) {
      setPhone(account.phone);
      setFirstName(account.firstName);
      setLastName(account.lastName);
      const res = validatePhone(account.phone);
      if (res.country) setCountry(res.country);
    }
  }, [account]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = limitDigitsForCountry(country, digits);
    const formatted = formatPhoneForCountry(country, limited);
    setPhone(formatted);
    setErrors((e) => ({ ...e, phone: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2: typeof errors = {};
    if (!firstName.trim()) e2.firstName = "Requis";
    if (!lastName.trim()) e2.lastName = "Requis";
    let phoneToValidate = phone;
    const digits = phone.replace(/\D/g, "");
    if (country === "CH" && digits.length === 9 && (digits.startsWith("7") || digits.startsWith("8"))) phoneToValidate = "+41 " + phone.trim();
    if (country === "BE" && digits.length === 9) phoneToValidate = "+32 " + phone.trim();
    const phoneResult = validatePhone(phoneToValidate);
    if (!phoneResult.valid) e2.phone = phoneResult.error || "Numéro invalide";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    setAccount(phoneResult.normalized, firstName.trim(), lastName.trim(), rememberMe);
    if (redirectFrom && (redirectFrom === "/cart" || redirectFrom === "/checkout")) {
      setLocation(redirectFrom);
    }
  };

  if (isLoggedIn && account && redirectFrom) {
    setLocation(redirectFrom);
    return null;
  }
  if (isLoggedIn && account && !redirectFrom) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background py-10 md:py-16"
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Compte" }]} />
          <div className="rounded-2xl border-2 border-border bg-card shadow-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mon compte</h1>
                <p className="text-sm text-muted-foreground">{account.firstName} {account.lastName}</p>
                <p className="text-sm text-muted-foreground">{account.phone}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Vous êtes connecté. Cette identification est requise pour finaliser un paiement.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/cart">
                <Button variant="default" className="rounded-xl">Voir le panier</Button>
              </Link>
              <Button variant="outline" className="rounded-xl" onClick={() => { logout(); setErrors({}); }}>
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-10 md:py-16"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Compte" }]} />

        <div className="rounded-2xl border-2 border-border bg-card shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-border cart-recap-gradient">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">Connexion</h1>
                <p className="text-sm text-muted-foreground mt-0.5 font-medium tracking-wide">
                  Sécurisez votre commande : identifiez-vous avec un numéro France, Suisse ou Belgique.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {redirectFrom === "/cart" && (
              <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-foreground">
                Connectez-vous pour valider votre panier et payer.
              </div>
            )}
            {redirectFrom === "/checkout" && (
              <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-foreground">
                Connectez-vous pour finaliser la commande.
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Pays</label>
              <div className="flex gap-2 mb-2">
                {PHONE_COUNTRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setCountry(opt.value); setPhone(""); setErrors((e) => ({ ...e, phone: undefined })); }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      country === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={inputClass}
                placeholder={PHONE_COUNTRY_OPTIONS.find((o) => o.value === country)?.placeholder ?? "06 12 34 56 78"}
                maxLength={country === "FR" ? 14 : 18}
                inputMode="numeric"
                autoComplete="tel"
              />
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {country === "FR" && "10 chiffres (ex. 06 12 34 56 78 ou +33 6 12 34 56 78). "}
                {country === "CH" && "11 chiffres avec indicatif 41 (ex. +41 79 123 45 67). "}
                {country === "BE" && "11 chiffres avec indicatif 32 (ex. +32 470 12 34 56). "}
                {PHONE_GUIDE}
              </p>
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors((e2) => ({ ...e2, firstName: undefined })); }}
                  className={inputClass}
                  placeholder="Prénom"
                />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors((e2) => ({ ...e2, lastName: undefined })); }}
                  className={inputClass}
                  placeholder="Nom"
                />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">Rester connecté (mémoriser sur cet appareil)</span>
            </label>

            <Button
              type="submit"
              size="lg"
              className="w-full py-6 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Se connecter
            </Button>

            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs pt-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Connexion requise pour le paiement</span>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
