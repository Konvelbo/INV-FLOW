// lib/currency.ts
// Country detection and currency conversion with 24h cache

// ---- Types ----
export interface CurrencyInfo {
  code: string;     // e.g., "XOF"
  symbol: string;   // e.g., "FCFA"
  locale: string;   // e.g., "fr-BF"
  name: string;     // e.g., "Franc CFA"
}

// ---- Country → Currency Mapping ----
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyInfo> = {
  // UEMOA (Franc CFA)
  BF: { code: "XOF", symbol: "FCFA", locale: "fr-BF", name: "Franc CFA" },
  CI: { code: "XOF", symbol: "FCFA", locale: "fr-CI", name: "Franc CFA" },
  SN: { code: "XOF", symbol: "FCFA", locale: "fr-SN", name: "Franc CFA" },
  ML: { code: "XOF", symbol: "FCFA", locale: "fr-ML", name: "Franc CFA" },
  NE: { code: "XOF", symbol: "FCFA", locale: "fr-NE", name: "Franc CFA" },
  TG: { code: "XOF", symbol: "FCFA", locale: "fr-TG", name: "Franc CFA" },
  BJ: { code: "XOF", symbol: "FCFA", locale: "fr-BJ", name: "Franc CFA" },
  GW: { code: "XOF", symbol: "FCFA", locale: "pt-GW", name: "Franc CFA" },

  // CEMAC (Franc CFA Central)
  CM: { code: "XAF", symbol: "FCFA", locale: "fr-CM", name: "Franc CFA Central" },
  CD: { code: "CDF", symbol: "FC", locale: "fr-CD", name: "Franc Congolais" },
  GA: { code: "XAF", symbol: "FCFA", locale: "fr-GA", name: "Franc CFA Central" },

  // Other Africa
  GH: { code: "GHS", symbol: "GH₵", locale: "en-GH", name: "Cedi ghanéen" },
  NG: { code: "NGN", symbol: "₦", locale: "en-NG", name: "Naira nigérian" },
  ZA: { code: "ZAR", symbol: "R", locale: "en-ZA", name: "Rand sud-africain" },
  MA: { code: "MAD", symbol: "DH", locale: "fr-MA", name: "Dirham marocain" },
  TN: { code: "TND", symbol: "DT", locale: "fr-TN", name: "Dinar tunisien" },
  DZ: { code: "DZD", symbol: "DA", locale: "fr-DZ", name: "Dinar algérien" },

  // Europe
  FR: { code: "EUR", symbol: "€", locale: "fr-FR", name: "Euro" },
  DE: { code: "EUR", symbol: "€", locale: "de-DE", name: "Euro" },
  BE: { code: "EUR", symbol: "€", locale: "fr-BE", name: "Euro" },
  IT: { code: "EUR", symbol: "€", locale: "it-IT", name: "Euro" },
  ES: { code: "EUR", symbol: "€", locale: "es-ES", name: "Euro" },
  PT: { code: "EUR", symbol: "€", locale: "pt-PT", name: "Euro" },
  NL: { code: "EUR", symbol: "€", locale: "nl-NL", name: "Euro" },

  // UK
  GB: { code: "GBP", symbol: "£", locale: "en-GB", name: "Livre sterling" },

  // Canada
  CA: { code: "CAD", symbol: "CA$", locale: "fr-CA", name: "Dollar canadien" },

  // Default (US + rest of world)
  US: { code: "USD", symbol: "$", locale: "en-US", name: "Dollar américain" },
};

export const DEFAULT_CURRENCY: CurrencyInfo = {
  code: "USD",
  symbol: "$",
  locale: "en-US",
  name: "Dollar américain",
};

// ---- Currency → Settings Mapping (derived) ----
export const CURRENCY_SETTINGS: Record<string, { symbol: string; locale: string }> = Object.values(COUNTRY_CURRENCY_MAP).reduce((acc, curr) => {
  if (!acc[curr.code]) {
    acc[curr.code] = { symbol: curr.symbol, locale: curr.locale };
  }
  return acc;
}, {} as Record<string, { symbol: string; locale: string }>);

// ---- Hardcoded fallback rates (relative to USD, updated 2025) ----
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.924,
  GBP: 0.787,
  XOF: 606.5,   // EUR × 655.957
  XAF: 606.5,
  CAD: 1.379,
  GHS: 15.8,
  NGN: 1580,
  ZAR: 18.4,
  MAD: 9.75,
  TND: 3.12,
  DZD: 134.5,
  CDF: 2810,
};

const rateCache: Record<string, { rates: Record<string, number>; cachedAt: number }> = {};
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Try a single fetch to an exchange-rate API endpoint.
 * Returns null on any failure so callers can try the next.
 */
async function tryFetch(url: string): Promise<Record<string, number> | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000); // 5s timeout
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    // Both Frankfurter and exchangerate-api return { rates: {...} }
    if (data?.rates && typeof data.rates === "object") return data.rates as Record<string, number>;
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch exchange rates from USD. Tries multiple APIs in sequence,
 * always falls back to hardcoded rates — never throws.
 */
async function fetchRatesFromUSD(currencies: string[]): Promise<Record<string, number>> {
  const cacheKey = currencies.sort().join(",");
  const now = Date.now();

  if (rateCache[cacheKey] && now - rateCache[cacheKey].cachedAt < CACHE_TTL_MS) {
    return rateCache[cacheKey].rates;
  }

  const currencyList = currencies.filter((c) => c !== "USD" && c !== "XOF" && c !== "XAF").join(",");

  let fetchedRates: Record<string, number> | null = null;

  if (currencyList) {
    // Attempt 1: api.frankfurter.app (official, most reliable)
    fetchedRates = await tryFetch(
      `https://api.frankfurter.app/latest?from=USD&to=${currencyList}`
    );

    // Attempt 2: api.frankfurter.dev (mirror)
    if (!fetchedRates) {
      fetchedRates = await tryFetch(
        `https://api.frankfurter.dev/latest?from=USD&to=${currencyList}`
      );
    }
  }

  const rates: Record<string, number> = {
    USD: 1,
    ...(fetchedRates || {}),
  };

  // XOF & XAF are pegged to EUR (1 EUR = 655.957 XOF/XAF) — always derive them
  if (rates["EUR"]) {
    rates["XOF"] = rates["EUR"] * 655.957;
    rates["XAF"] = rates["EUR"] * 655.957;
  } else {
    // Use hardcoded fallback if EUR not fetched
    rates["XOF"] = FALLBACK_RATES["XOF"];
    rates["XAF"] = FALLBACK_RATES["XAF"];
  }

  // Fill in any missing currencies from hardcoded fallback
  for (const [code, rate] of Object.entries(FALLBACK_RATES)) {
    if (rates[code] === undefined) {
      rates[code] = rate;
    }
  }

  if (!fetchedRates) {
    console.warn("Currency API unavailable — using hardcoded fallback rates.");
  }

  rateCache[cacheKey] = { rates, cachedAt: now };
  return rates;
}


/**
 * Convert a USD amount to the target currency.
 */
export async function convertFromUSD(
  amountUSD: number,
  targetCurrency: string
): Promise<number> {
  if (targetCurrency === "USD") return amountUSD;

  const rates = await fetchRatesFromUSD([targetCurrency]);
  const rate = rates[targetCurrency] || 1;
  return Math.round(amountUSD * rate);
}

/**
 * Get the currency info for a given ISO country code.
 */
export function getCurrencyForCountry(countryCode: string): CurrencyInfo {
  return COUNTRY_CURRENCY_MAP[countryCode?.toUpperCase()] || DEFAULT_CURRENCY;
}

/**
 * Detect the user's country from their IP address using ipapi.co (free, 1000 req/day).
 */
export async function detectCountryFromIP(ip: string): Promise<string> {
  // Skip for localhost / private IPs
  if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.")) {
    return "BF"; // Default to Burkina Faso for local dev
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/country/`, {
      headers: { "User-Agent": "ESSOR-App/1.0" },
    });
    if (!res.ok) return "US";
    const country = await res.text();
    return country.trim().toUpperCase();
  } catch {
    return "US";
  }
}

/**
 * Format a price amount according to locale and currency.
 */
export function formatPrice(
  amount: number,
  currencyCode: string,
  locale: string
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: currencyCode === "XOF" || currencyCode === "XAF" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}

/**
 * Get pricing for all plans in the user's local currency.
 */
export async function getPricingForCountry(countryCode: string): Promise<{
  currency: CurrencyInfo;
  monthly: { usd: number; local: number; formatted: string };
  yearly: { usd: number; local: number; formatted: string; savings: number; savingsPercent: number };
}> {
  const MONTHLY_USD = 10.99;
  const YEARLY_USD = 109.99;

  const currency = getCurrencyForCountry(countryCode);
  const [monthlyLocal, yearlyLocal] = await Promise.all([
    convertFromUSD(MONTHLY_USD, currency.code),
    convertFromUSD(YEARLY_USD, currency.code),
  ]);

  const yearlyEquivalentMonthly = monthlyLocal * 12;
  const savings = yearlyEquivalentMonthly - yearlyLocal;
  const savingsPercent = Math.round((savings / yearlyEquivalentMonthly) * 100);

  return {
    currency,
    monthly: {
      usd: MONTHLY_USD,
      local: monthlyLocal,
      formatted: formatPrice(monthlyLocal, currency.code, currency.locale),
    },
    yearly: {
      usd: YEARLY_USD,
      local: yearlyLocal,
      formatted: formatPrice(yearlyLocal, currency.code, currency.locale),
      savings,
      savingsPercent,
    },
  };
}

/**
 * Get pricing for all plans based on a currency code.
 */
export async function getPricingForCurrency(currencyCode: string): Promise<{
  currency: CurrencyInfo;
  monthly: { usd: number; local: number; formatted: string };
  yearly: { usd: number; local: number; formatted: string; savings: number; savingsPercent: number };
}> {
  const MONTHLY_USD = 10.99;
  const YEARLY_USD = 109.99;

  // Find the first country mapping that uses this currency
  const currencyInfo = Object.values(COUNTRY_CURRENCY_MAP).find(c => c.code === currencyCode) || DEFAULT_CURRENCY;
  
  const [monthlyLocal, yearlyLocal] = await Promise.all([
    convertFromUSD(MONTHLY_USD, currencyCode),
    convertFromUSD(YEARLY_USD, currencyCode),
  ]);

  const yearlyEquivalentMonthly = monthlyLocal * 12;
  const savings = yearlyEquivalentMonthly - yearlyLocal;
  const savingsPercent = Math.round((savings / yearlyEquivalentMonthly) * 100);

  return {
    currency: currencyInfo,
    monthly: {
      usd: MONTHLY_USD,
      local: monthlyLocal,
      formatted: formatPrice(monthlyLocal, currencyInfo.code, currencyInfo.locale),
    },
    yearly: {
      usd: YEARLY_USD,
      local: yearlyLocal,
      formatted: formatPrice(yearlyLocal, currencyInfo.code, currencyInfo.locale),
      savings,
      savingsPercent,
    },
  };
}
