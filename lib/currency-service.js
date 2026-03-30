// lib/currency-service.js
// JavaScript version of currency logic for Electron main process

const COUNTRY_CURRENCY_MAP = {
  BF: { code: "XOF", symbol: "FCFA", locale: "fr-BF", name: "Franc CFA" },
  CI: { code: "XOF", symbol: "FCFA", locale: "fr-CI", name: "Franc CFA" },
  SN: { code: "XOF", symbol: "FCFA", locale: "fr-SN", name: "Franc CFA" },
  ML: { code: "XOF", symbol: "FCFA", locale: "fr-ML", name: "Franc CFA" },
  NE: { code: "XOF", symbol: "FCFA", locale: "fr-NE", name: "Franc CFA" },
  TG: { code: "XOF", symbol: "FCFA", locale: "fr-TG", name: "Franc CFA" },
  BJ: { code: "XOF", symbol: "FCFA", locale: "fr-BJ", name: "Franc CFA" },
  GW: { code: "XOF", symbol: "FCFA", locale: "pt-GW", name: "Franc CFA" },
  CM: { code: "XAF", symbol: "FCFA", locale: "fr-CM", name: "Franc CFA Central" },
  CD: { code: "CDF", symbol: "FC", locale: "fr-CD", name: "Franc Congolais" },
  GA: { code: "XAF", symbol: "FCFA", locale: "fr-GA", name: "Franc CFA Central" },
  GH: { code: "GHS", symbol: "GH₵", locale: "en-GH", name: "Cedi ghanéen" },
  NG: { code: "NGN", symbol: "₦", locale: "en-NG", name: "Naira nigérian" },
  ZA: { code: "ZAR", symbol: "R", locale: "en-ZA", name: "Rand sud-africain" },
  MA: { code: "MAD", symbol: "DH", locale: "fr-MA", name: "Dirham marocain" },
  TN: { code: "TND", symbol: "DT", locale: "fr-TN", name: "Dinar tunisien" },
  DZ: { code: "DZD", symbol: "DA", locale: "fr-DZ", name: "Dinar algérien" },
  FR: { code: "EUR", symbol: "€", locale: "fr-FR", name: "Euro" },
  DE: { code: "EUR", symbol: "€", locale: "de-DE", name: "Euro" },
  BE: { code: "EUR", symbol: "€", locale: "fr-BE", name: "Euro" },
  IT: { code: "EUR", symbol: "€", locale: "it-IT", name: "Euro" },
  ES: { code: "EUR", symbol: "€", locale: "es-ES", name: "Euro" },
  PT: { code: "EUR", symbol: "€", locale: "pt-PT", name: "Euro" },
  NL: { code: "EUR", symbol: "€", locale: "nl-NL", name: "Euro" },
  GB: { code: "GBP", symbol: "£", locale: "en-GB", name: "Livre sterling" },
  CA: { code: "CAD", symbol: "CA$", locale: "fr-CA", name: "Dollar canadien" },
  US: { code: "USD", symbol: "$", locale: "en-US", name: "Dollar américain" },
};

const DEFAULT_CURRENCY = {
  code: "USD",
  symbol: "$",
  locale: "en-US",
  name: "Dollar américain",
};

const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.924,
  GBP: 0.787,
  XOF: 606.5,
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

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let rateCache = {};

async function tryFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.rates && typeof data.rates === "object") return data.rates;
    return null;
  } catch {
    return null;
  }
}

async function fetchRatesFromUSD(currencies = []) {
  const cacheKey = currencies.sort().join(",") || "all";
  const now = Date.now();

  if (rateCache[cacheKey] && now - rateCache[cacheKey].cachedAt < CACHE_TTL_MS) {
    return rateCache[cacheKey].rates;
  }

  const currencyList = currencies.filter((c) => c !== "USD" && c !== "XOF" && c !== "XAF").join(",");
  let fetchedRates = null;

  if (currencyList) {
    fetchedRates = await tryFetch(`https://api.frankfurter.app/latest?from=USD&to=${currencyList}`);
    if (!fetchedRates) {
      fetchedRates = await tryFetch(`https://api.frankfurter.dev/latest?from=USD&to=${currencyList}`);
    }
  }

  const rates = {
    USD: 1,
    ...(fetchedRates || {}),
  };

  if (rates["EUR"]) {
    rates["XOF"] = rates["EUR"] * 655.957;
    rates["XAF"] = rates["EUR"] * 655.957;
  } else {
    rates["XOF"] = FALLBACK_RATES["XOF"];
    rates["XAF"] = FALLBACK_RATES["XAF"];
  }

  for (const [code, rate] of Object.entries(FALLBACK_RATES)) {
    if (rates[code] === undefined) {
      rates[code] = rate;
    }
  }

  rateCache[cacheKey] = { rates, cachedAt: now };
  return rates;
}

async function convertFromUSD(amountUSD, targetCurrency) {
  if (targetCurrency === "USD") return amountUSD;
  const rates = await fetchRatesFromUSD([targetCurrency]);
  const rate = rates[targetCurrency] || 1;
  return Math.round(amountUSD * rate);
}

function getCurrencyForCountry(countryCode) {
  return COUNTRY_CURRENCY_MAP[countryCode?.toUpperCase()] || DEFAULT_CURRENCY;
}

async function detectCountryFromIP(ip) {
  if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.")) {
    return "BF";
  }
  try {
    const res = await fetch(`https://ipapi.co/${ip}/country/`);
    if (!res.ok) return "US";
    const country = await res.text();
    return country.trim().toUpperCase();
  } catch {
    return "US";
  }
}

function formatPrice(amount, currencyCode, locale) {
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

async function getPricingForCurrency(currencyCode) {
  const MONTHLY_USD = 10.99;
  const YEARLY_USD = 109.99;

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

async function getPricingForCountry(countryCode) {
  const currency = getCurrencyForCountry(countryCode);
  return await getPricingForCurrency(currency.code);
}

module.exports = {
  getPricingForCurrency,
  getPricingForCountry,
  detectCountryFromIP,
  fetchRatesFromUSD,
  convertFromUSD,
  getCurrencyForCountry,
  formatPrice,
  COUNTRY_CURRENCY_MAP,
  DEFAULT_CURRENCY
};
