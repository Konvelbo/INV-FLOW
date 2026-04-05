// app/api/subscription/pricing/route.ts
// Returns localized pricing based on the user's country (detected from IP)

import { NextRequest, NextResponse } from "next/server";
import { detectCountryFromIP, getPricingForCountry } from "@/lib/currency";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Extract IP from request
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Detect country, then get pricing
    const countryCode = await detectCountryFromIP(ip);
    const pricing = await getPricingForCountry(countryCode);

    return NextResponse.json({
      country: countryCode,
      currency: pricing.currency,
      monthly: pricing.monthly,
      yearly: pricing.yearly,
    });
  } catch (err) {
    console.error("Pricing API error:", err);
    // Fallback to USD
    return NextResponse.json({
      country: "US",
      currency: { code: "USD", symbol: "$", locale: "en-US", name: "Dollar américain" },
      monthly: { usd: 10.99, local: 10.99, formatted: "$10.99" },
      yearly: {
        usd: 109.99,
        local: 109.99,
        formatted: "$109.99",
        savings: 21.89,
        savingsPercent: 17,
      },
    });
  }
}
