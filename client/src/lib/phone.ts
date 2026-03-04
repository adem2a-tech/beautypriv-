/**
 * Validation téléphone France, Suisse, Belgique.
 * Exemples : FR 06 12 34 56 78, +33 6 12 34 56 78 · CH +41 79 123 45 67 · BE +32 470 12 34 56
 */

const DIGITS_ONLY = /^\d+$/;

/** Normalise en chiffres uniquement (sans + ni espaces). */
export function toDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** France : 06/07 (10 chiffres) ou +33 6/7 (11 chiffres au total). */
function isFrench(digits: string): boolean {
  // 06/07 XX XX XX XX → 10 chiffres commençant par 0[6-7]
  if (digits.length === 10 && digits.startsWith("0") && (digits[1] === "6" || digits[1] === "7")) return true;
  // +33 6/7 XX XX XX XX → 11 chiffres commençant par 33[6-7]
  if (digits.length === 11 && digits.startsWith("33") && (digits[2] === "6" || digits[2] === "7")) return true;
  return false;
}

/** Suisse : +41 79/78/76/... 9 chiffres après 41. */
function isSwiss(digits: string): boolean {
  if (digits.length !== 11) return false;
  return digits.startsWith("41") && digits[2] === "7";
}

/** Belgique : +32 4xx ou 3xx... 9 chiffres après 32. */
function isBelgian(digits: string): boolean {
  if (digits.length !== 11) return false;
  return digits.startsWith("32");
}

export type PhoneCountry = "FR" | "CH" | "BE" | null;

export interface PhoneResult {
  valid: boolean;
  country: PhoneCountry;
  normalized: string;
  error?: string;
}

export function validatePhone(value: string): PhoneResult {
  const digits = toDigits(value);
  if (digits.length < 9) {
    return { valid: false, country: null, normalized: "", error: "Numéro trop court" };
  }
  if (isFrench(digits)) {
    const local = digits.length === 10 ? digits.slice(1) : digits.slice(2); // 9 chiffres sans indicatif
    const normalized = `+33 ${local.slice(0, 1)} ${local.slice(1, 3)} ${local.slice(3, 5)} ${local.slice(5, 7)} ${local.slice(7)}`.trim();
    return { valid: true, country: "FR", normalized };
  }
  if (isSwiss(digits)) {
    const normalized = `+41 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    return { valid: true, country: "CH", normalized };
  }
  if (isBelgian(digits)) {
    const normalized = `+32 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    return { valid: true, country: "BE", normalized };
  }
  return { valid: false, country: null, normalized: "", error: "Numéro invalide (France, Suisse ou Belgique uniquement)" };
}

export const PHONE_GUIDE = (
  "Exemples : France 06 12 34 56 78 ou +33 6 12 34 56 78 · Suisse +41 79 123 45 67 · Belgique +32 470 12 34 56"
);

export const PHONE_COUNTRY_OPTIONS: { value: PhoneCountry; label: string; placeholder: string; maxDigits: number }[] = [
  { value: "FR", label: "France", placeholder: "06 12 34 56 78", maxDigits: 10 },
  { value: "CH", label: "Suisse", placeholder: "+41 79 123 45 67", maxDigits: 11 },
  { value: "BE", label: "Belgique", placeholder: "+32 470 12 34 56", maxDigits: 11 },
];

/** Formate les chiffres selon le pays pour l'affichage. */
export function formatPhoneForCountry(country: PhoneCountry, digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (!country || !d) return "";
  if (country === "FR") {
    // Affichage convivial : soit 06 XX XX XX XX, soit +33 6 XX XX XX XX
    if (d.startsWith("33")) {
      const local = d.slice(2);
      return `+33 ${local.slice(0, 1)} ${local.slice(1, 3)} ${local.slice(3, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`.trim();
    }
    if (d.startsWith("0")) {
      return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 6), d.slice(6, 8), d.slice(8, 10)]
        .filter(Boolean)
        .join(" ")
        .trim();
    }
    // Cas plus rare : utilisateur tape sans 0 ni 33 → on groupe juste par 2
    return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 6), d.slice(6, 8), d.slice(8, 10)]
      .filter(Boolean)
      .join(" ")
      .trim();
  }
  if (country === "CH") {
    const rest = d.startsWith("41") ? d.slice(2) : d;
    if (rest.length <= 2) return rest ? `+41 ${rest}` : "";
    return `+41 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 8)} ${rest.slice(8)}`.trim();
  }
  if (country === "BE") {
    const rest = d.startsWith("32") ? d.slice(2) : d;
    if (rest.length <= 2) return rest ? `+32 ${rest}` : "";
    return `+32 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 8)} ${rest.slice(8)}`.trim();
  }
  return d;
}

/** Extrait uniquement les chiffres et limite au max du pays. Pour FR en 9 chiffres on garde sans 33. */
export function limitDigitsForCountry(country: PhoneCountry, digits: string): string {
  const raw = digits.replace(/\D/g, "");
  if (!country) return raw.slice(0, 11);
  if (country === "FR") {
    // 06/07 → 10 chiffres, ou 33 + 9 chiffres (mobile)
    if (raw.startsWith("33")) return raw.slice(0, 11);
    return raw.slice(0, 10);
  }
  return raw.slice(0, 11);
}
