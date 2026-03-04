import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "beauty-prive-cookie-consent";
const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 an

function setConsentCookie(value: string) {
  try {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    // ignore
  }
}

function getStoredConsent(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredConsent(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored !== "accepted" && stored !== "refused") {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    setStoredConsent("accepted");
    setConsentCookie("accepted");
    setVisible(false);
  };

  const refuse = () => {
    setStoredConsent("refused");
    setConsentCookie("refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[100] p-4 sm:p-5 bg-card/98 backdrop-blur-xl border-t-2 border-primary/20 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] safe-area-pb"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Cookie className="w-5 h-5 text-primary" strokeWidth={1.5} aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 id="cookie-consent-title" className="font-semibold text-foreground text-sm sm:text-base mb-0.5">
              Nous utilisons des cookies
            </h2>
            <p id="cookie-consent-desc" className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Pour le bon fonctionnement du site, la sécurité et votre expérience. En continuant, vous acceptez notre utilisation des cookies.{" "}
              <Link href="/cookies" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
                En savoir plus
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={refuse}
            className="min-h-[44px] touch-manipulation rounded-lg border-border text-muted-foreground hover:text-foreground"
          >
            Refuser
          </Button>
          <Button
            size="sm"
            onClick={accept}
            className="min-h-[44px] touch-manipulation rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Tout accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
