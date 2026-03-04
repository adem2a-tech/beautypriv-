import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  label: string;
  delay?: number;
  duration?: number;
}

export function AnimatedCounter({
  value,
  label,
  delay = 0,
  duration = 3500,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState("0");
  const [trigger, setTrigger] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Relance l'animation à chaque fois que le compteur revient dans le viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setDisplay("0");
          setTrigger((t) => t + 1);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (trigger === 0) return;

    const match = value.match(/[\d.,]+/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const numericPart = match[0];
    const hasDecimal = /[.,]/.test(numericPart);
    const normalized = numericPart.replace(",", ".");
    const target = parseFloat(normalized.replace(/\s/g, ""));
    if (Number.isNaN(target)) {
      setDisplay(value);
      return;
    }

    const rest = value.replace(numericPart, "");
    const startTime = Date.now() + delay;
    let raf: number;

    const formatter = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: hasDecimal ? 1 : 0,
      maximumFractionDigits: hasDecimal ? 1 : 0,
    });

    const tick = () => {
      const now = Date.now();
      if (now < startTime) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formattedNumber = formatter.format(current);
      setDisplay(`${formattedNumber}${rest}`);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, value, delay, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-bold text-3xl md:text-4xl lg:text-5xl tabular-nums text-primary transition-all duration-300">
        {display}
      </div>
      <div className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
        {label}
      </div>
    </div>
  );
}
