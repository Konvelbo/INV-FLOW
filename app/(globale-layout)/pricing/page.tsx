"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { useIPCAction } from "@/hooks/useIPCAction";
import { useLanguage } from "@/src/context/LanguageContext";
import Loading from "@/app/loading";
import {
  Check,
  Zap,
  Crown,
  Sparkles,
  Shield,
  Loader2,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ---- Types ----
interface PricingData {
  country: string;
  currency: { code: string; symbol: string; locale: string; name: string };
  monthly: { usd: number; local: number; formatted: string };
  yearly: {
    usd: number;
    local: number;
    formatted: string;
    savings: number;
    savingsPercent: number;
  };
}

// ---- Features helpers ----
const getFreeFeatures = (dict: any) => [
  { text: dict.feat_limit_6 || "6 factures par jour", included: true },
  { text: dict.feat_1_comp || "1 compagnie", included: true },
  { text: dict.feat_unlimited_cp || "Clients & produits illimités", included: true },
  { text: dict.feat_unlimited_tasks || "Planning & tâches illimité", included: true },
  { text: dict.feat_export || "Exporter en PDF & Excel", included: true },
  { text: dict.feat_ai_no || "Assistant IA", included: false },
  { text: dict.feat_comp_no || "Compagnies illimitées", included: false },
  { text: dict.feat_inv_no || "Factures illimitées", included: false },
];

const getProFeatures = (dict: any) => [
  { text: dict.feat_inv_ok || "Factures illimitées", included: true },
  { text: dict.feat_comp_ok || "Compagnies illimitées", included: true },
  { text: dict.feat_unlimited_cp || "Clients & produits illimités", included: true },
  { text: dict.feat_unlimited_tasks || "Planning & tâches illimité", included: true },
  { text: dict.feat_export || "Exporter en PDF & Excel", included: true },
  { text: dict.feat_ai_ok || "Assistant IA complet", included: true },
  { text: dict.feat_support || "Support prioritaire", included: true },
  { text: dict.feat_updates || "Mises à jour gratuites", included: true },
];

// ---- Animated Feature Item ----
function FeatureItem({
  text,
  included,
  accent = "primary",
  delay = 0,
}: {
  text: string;
  included: boolean;
  accent?: "primary" | "yellow";
  delay?: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn("flex items-center gap-3 text-sm", !included && "opacity-35")}
    >
      {included ? (
        <span
          className={cn(
            "size-5 rounded-full flex items-center justify-center flex-shrink-0",
            accent === "yellow"
              ? "bg-yellow-500/15 text-yellow-400"
              : "bg-primary/15 text-primary"
          )}
        >
          <Check className="size-3" />
        </span>
      ) : (
        <span className="size-5 rounded-full flex items-center justify-center flex-shrink-0 bg-muted text-muted-foreground/40">
          <X className="size-3" />
        </span>
      )}
      <span>{text}</span>
    </motion.li>
  );
}

// ---- Main Component ----
export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [checkingOut, setCheckingOut] = useState<"monthly" | "yearly" | null>(null);
  const [success, setSuccess] = useState(false);
  const { subscription, refresh } = useSubscription();
  const { performAction } = useIPCAction();
  const { dict, t } = useLanguage();

  const FREE_FEATURES = getFreeFeatures(dict);
  const PRO_FEATURES = getProFeatures(dict);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setSuccess(true);
      refresh();
    }

    // Auto-verify test payments in dev mode
    const testRef = params.get("test_ref");
    if (testRef) {
      const verifyTest = async () => {
        const res = await performAction("subscription", "verifyPayment", { reference: testRef });
        if (res.success && res.data?.status === "success") {
          setSuccess(true);
          refresh();
        }
      };
      verifyTest();
    }
  }, [refresh, performAction]);

  useEffect(() => {
    const fetchPricing = async () => {
      setLoadingPricing(true);
      try {
        const res = await performAction("subscription", "detectPricing");
        if (res.success && res.data) {
          setPricing(res.data);
        } else throw new Error();
      } catch {
        setPricing({
          country: "BF",
          currency: { code: "XOF", symbol: "FCFA", locale: "fr-BF", name: "Franc CFA" },
          monthly: { usd: 10.99, local: 6665, formatted: "6 665 FCFA" },
          yearly: { usd: 109.99, local: 66663, formatted: "66 663 FCFA", savings: 13317, savingsPercent: 17 },
        });
      } finally {
        setLoadingPricing(false);
      }
    };
    fetchPricing();
  }, []);

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user?.id) {
      toast.error(dict.authRequired || "Veuillez vous connecter pour vous abonner.");
      return;
    }

    setCheckingOut(plan);
    try {
      const res = await performAction("subscription", "initCheckout", {
        plan,
        countryCode: pricing?.country || "BF",
      });

      if (res.success && res.data?.paymentUrl) {
        // @ts-ignore
        if (window.electronAPI?.openExternal) {
          // @ts-ignore
          await window.electronAPI.openExternal(res.data.paymentUrl);
          toast.success(
            dict.paymentInstructions || "Paiement ouvert dans votre navigateur. Revenez ici après.",
            { duration: 6000 }
          );
          let attempts = 0;
          const poll = setInterval(async () => {
            attempts++;
            try {
              const checkRes = await performAction("subscription", "verifyPayment", {
                reference: res.data.reference,
              });
              if (checkRes.success && checkRes.data?.status === "success") {
                clearInterval(poll);
                setSuccess(true);
                refresh();
                toast.success(dict.activationSuccess || "🎉 Abonnement activé avec succès !", { duration: 8000 });
              }
            } catch {}
            if (attempts >= 36) clearInterval(poll);
          }, 5000);
        } else {
          window.open(res.data.paymentUrl, "_blank");
        }
      } else {
        toast.error(res.error || "Erreur lors de l'initiation du paiement.");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setCheckingOut(null);
    }
  };

  const currentPlan = subscription?.plan ?? "free";

  if (loadingPricing) {
    return <Loading />;
  }

  // ---- Success Screen ----
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center space-y-8 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="size-28 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto relative"
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald-500/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <CheckCircle2 className="size-14 text-emerald-500" />
          </motion.div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-foreground">
              {dict.pricing_welcome || "Bienvenue dans Premium !"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {dict.pricing_active_desc || "Votre abonnement est actif. Profitez de toutes les fonctionnalités sans limite."}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setSuccess(false); refresh(); }}
            className="px-10 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors shadow-xl shadow-primary/25 flex items-center gap-2 mx-auto"
          >
            {dict.pricing_start_now || "Commencer"} <ArrowRight className="size-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ---- Main Pricing Page ----
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-500/4 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/3 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20 space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold"
          >
            <Sparkles className="size-4 animate-pulse" />
            {dict.choosePlan || "Choisissez votre plan"}
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              {dict.pricingTitle?.split(".")[0]}.
            </span>{" "}
            <span className="text-primary">{dict.pricingTitle?.split(".")[1]}</span>
          </h1>

          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            {dict.pricingSubtitle}
          </p>

        </motion.div>

        {/* ---- Cards Grid ---- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* ==== Card 1: Free ==== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className={cn(
              "relative rounded-3xl border p-8 flex flex-col gap-6 cursor-default",
              "bg-card/40 backdrop-blur-2xl transition-shadow duration-500",
              "hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:border-muted-foreground/20",
              currentPlan === "free"
                ? "border-primary/20 shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]"
                : "border-border/40"
            )}
          >
            {/* Glare on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/3 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {currentPlan === "free" && (
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                {dict.pricing_current || "Plan actuel"}
              </div>
            )}

            <div className="space-y-4">
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="size-14 rounded-2xl bg-muted/80 border border-border/50 flex items-center justify-center"
              >
                <Zap className="size-7 text-muted-foreground" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black">{dict.freePlan || "Gratuit"}</h2>
                <p className="text-muted-foreground text-sm mt-1">{dict.pricing_start_test || "Pour démarrer et tester l'app"}</p>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-6xl font-black tracking-tight">0</span>
                <span className="text-2xl text-muted-foreground font-bold">{pricing?.currency.code || "FCFA"}</span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{dict.pricing_free_forever || "Pour toujours gratuit"}</p>
            </div>

            <ul className="space-y-3.5 flex-1">
              {FREE_FEATURES.map((f, i) => (
                <FeatureItem key={i} {...f} delay={0.2 + i * 0.04} />
              ))}
            </ul>

            <motion.button
              disabled
              className="w-full py-3.5 rounded-2xl border border-border/50 text-muted-foreground font-bold text-sm cursor-default opacity-60"
            >
              {currentPlan === "free" ? (dict.pricing_current || "✓ Plan actuel") : (dict.freePlan || "Gratuit")}
            </motion.button>
          </motion.div>

          {/* ==== Card 2: Monthly ==== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            whileHover={{
              y: -10,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className={cn(
              "relative rounded-3xl border p-8 flex flex-col gap-6",
              "bg-gradient-to-b from-primary/8 to-primary/3 backdrop-blur-2xl",
              "transition-all duration-500",
              "hover:shadow-[0_40px_70px_-20px_hsl(var(--primary)/0.3)] hover:border-primary/60",
              currentPlan === "monthly"
                ? "border-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.3)]"
                : "border-primary/25"
            )}
          >
            {/* Animated glow border on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {currentPlan === "monthly" && (
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                {dict.pricing_current || "Plan actuel"}
              </div>
            )}

            <div className="space-y-4">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="size-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center"
              >
                <Zap className="size-7 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black">{dict.monthlyPlan || "Mensuel"}</h2>
                <p className="text-muted-foreground text-sm mt-1">{dict.pricing_cancel_anytime || "Accès complet, résiliable à tout moment"}</p>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-6xl font-black tracking-tight text-primary">
                  {pricing?.monthly.local.toLocaleString()}
                </span>
                <span className="text-2xl text-muted-foreground font-bold">{pricing?.currency.code}</span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {dict.pricing_per_month} · ${pricing?.monthly.usd} USD
              </p>
            </div>

            <ul className="space-y-3.5 flex-1">
              {PRO_FEATURES.map((f, i) => (
                <FeatureItem key={i} {...f} delay={0.3 + i * 0.04} />
              ))}
            </ul>

            <motion.button
              onClick={() => handleSubscribe("monthly")}
              disabled={checkingOut !== null || currentPlan === "monthly"}
              whileHover={
                checkingOut === null && currentPlan !== "monthly"
                  ? { scale: 1.03, y: -2 }
                  : {}
              }
              whileTap={
                checkingOut === null && currentPlan !== "monthly"
                  ? { scale: 0.97 }
                  : {}
              }
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 relative overflow-hidden",
                "shadow-lg transition-shadow duration-300",
                currentPlan === "monthly"
                  ? "bg-primary/20 text-primary cursor-default"
                  : "bg-primary text-white hover:shadow-primary/40 hover:shadow-xl cursor-pointer"
              )}
            >
              {/* Shimmer on hover */}
              {currentPlan !== "monthly" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              )}
              {checkingOut === "monthly" ? (
                <><Loader2 className="size-4 animate-spin" /> {dict.processing || "Traitement..."}</>
              ) : currentPlan === "monthly" ? (
                dict.pricing_current || "✓ Plan actuel"
              ) : (
                <><Zap className="size-4" /> {dict.pricing_choose || "Choisir ce plan"}</>
              )}
            </motion.button>
          </motion.div>

          {/* ==== Card 3: Annual (hero) ==== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            whileHover={{
              y: -12,
              transition: { type: "spring", stiffness: 280, damping: 18 },
            }}
            className={cn(
              "relative rounded-3xl border p-8 flex flex-col gap-6",
              "bg-gradient-to-b from-yellow-500/10 via-amber-500/5 to-transparent backdrop-blur-2xl",
              "transition-all duration-500",
              "hover:shadow-[0_50px_80px_-20px_rgba(234,179,8,0.25)] hover:border-yellow-400/50",
              currentPlan === "yearly"
                ? "border-yellow-500 shadow-[0_0_0_2px_rgba(234,179,8,0.3)]"
                : "border-yellow-500/25"
            )}
          >
            {/* Gold shimmer effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/8 via-transparent to-transparent pointer-events-none" />

            {/* Popular badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/30"
            >
              {dict.pricing_popular || "🔥 Meilleure offre"}
            </motion.div>

            {currentPlan === "yearly" && (
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase tracking-widest">
                {dict.pricing_current || "Plan actuel"}
              </div>
            )}

            <div className="space-y-4">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="size-14 rounded-2xl bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center"
              >
                <Crown className="size-7 text-yellow-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black">{dict.yearlyPlan || "Annuel"}</h2>
                <p className="text-muted-foreground text-sm mt-1">{dict.pricing_best_value || "Le meilleur rapport qualité-prix"}</p>
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-6xl font-black tracking-tight text-yellow-400">
                    {pricing?.yearly.local.toLocaleString()}
                  </span>
                  <span className="text-2xl text-muted-foreground font-bold">{pricing?.currency.code}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {dict.pricing_per_year} · ${pricing?.yearly.usd} USD
                </p>
                {pricing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold"
                  >
                    <Check className="size-3" />
                    {dict.pricing_save} {pricing.yearly.savingsPercent}% {dict.pricing_vs_monthly}
                  </motion.div>
                )}
              </div>
            </div>

            <ul className="space-y-3.5 flex-1">
              {PRO_FEATURES.map((f, i) => (
                <FeatureItem key={i} {...f} accent="yellow" delay={0.4 + i * 0.04} />
              ))}
            </ul>

            <motion.button
              onClick={() => handleSubscribe("yearly")}
              disabled={checkingOut !== null || currentPlan === "yearly"}
              whileHover={
                checkingOut === null && currentPlan !== "yearly"
                  ? { scale: 1.04, y: -2 }
                  : {}
              }
              whileTap={
                checkingOut === null && currentPlan !== "yearly"
                  ? { scale: 0.96 }
                  : {}
              }
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 relative overflow-hidden",
                "transition-all duration-300",
                currentPlan === "yearly"
                  ? "bg-yellow-500/20 text-yellow-400 cursor-default"
                  : "bg-gradient-to-r from-yellow-500 to-amber-400 text-black hover:shadow-xl hover:shadow-yellow-500/30 cursor-pointer"
              )}
            >
              {/* Animated shimmer */}
              {currentPlan !== "yearly" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
                />
              )}
              {checkingOut === "yearly" ? (
                <><Loader2 className="size-4 animate-spin" /> {dict.processing || "Traitement..."}</>
              ) : currentPlan === "yearly" ? (
                dict.pricing_current || "✓ Plan actuel"
              ) : (
                <><Crown className="size-4" /> {dict.pricing_choose || "Choisir ce plan"}</>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* ---- Trust badges ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-6 text-muted-foreground"
        >
          {[
            { icon: Shield, text: dict.securePayment || "Paiement sécurisé LigdiCash" },
            { icon: Check, text: dict.paymentMethods || "Orange Money & Moov acceptés" },
            { icon: Check, text: dict.cardPayment || "Carte VISA / Mastercard" },
            { icon: Check, text: dict.regionalPayment || "Zone UEMOA + International" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-card/30 border border-border/30 backdrop-blur-sm hover:border-primary/20 transition-colors cursor-default"
            >
              <Icon className="size-4 text-primary flex-shrink-0" />
              {text}
            </motion.div>
          ))}
        </motion.div>

        {/* ---- Current plan expiry ---- */}
        {subscription && subscription.plan !== "free" && subscription.expiresAt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            {dict.pricing_expiry
              ?.replace("{type}", subscription.plan === "yearly" ? (dict.pricing_type_yearly || "annuel") : (dict.pricing_type_monthly || "mensuel"))
              ?.replace("{date}", new Date(subscription.expiresAt).toLocaleDateString(dict.language === "fr" ? "fr-FR" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }))
            }
          </motion.div>
        )}

        {/* ---- Back link ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            {dict.pricing_back || "← Retour au tableau de bord"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
