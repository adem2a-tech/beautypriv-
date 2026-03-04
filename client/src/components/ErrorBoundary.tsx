import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-background">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-2">
            Une erreur s&apos;est produite
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            Désolé, cette page n&apos;a pas pu s&apos;afficher. Retournez au catalogue pour continuer.
          </p>
          <Link href="/catalog">
            <Button variant="default">Retour au catalogue</Button>
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
