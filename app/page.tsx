"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  TrendingUp,
  Brain,
  Users,
  Mail,
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Globe,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Logo from "@/src/components/navbar-components/logo";
import { SparklesText } from "@/src/components/ui/sparkles-text";
import { TypingText } from "@/src/components/ui/typing-text";
import SignUp from "@/src/components/signup";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Home() {
  const [signUpChoise, setSignUpChoise] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);

  const router = useRouter();
  const { clearInvoiceData } = useInvoice();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [storage, setStorage] = useState<{
    name: string;
    token: string;
  } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("features");

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const sections = ["features", "details", "ai-intelligence"];
      const scrollPos = window.scrollY + 300;
      let current = "features";

      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          if (scrollPos >= element.offsetTop) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  function FeatureCard({ i, index, scrollYProgress, t }: { i: number; index: number; scrollYProgress: any; t: any }) {
    const milestone = index * 0.25;
    const start = milestone - 0.25;
    const end = milestone + 0.25;

    let input: number[];
    let scaleOutput: number[];
    let opacityOutput: number[];
    let shadowOutput: string[];

    if (index === 0) {
      input = [0, 0.25];
      scaleOutput = [1.05, 0.85];
      opacityOutput = [1, 0.3];
      shadowOutput = [
        "0px 40px 80px -20px rgba(16,185,129,0.3)",
        "0px 0px 0px 0px rgba(16,185,129,0)"
      ];
    } else if (index === 4) {
      input = [0.75, 1];
      scaleOutput = [0.85, 1.05];
      opacityOutput = [0.3, 1];
      shadowOutput = [
        "0px 0px 0px 0px rgba(16,185,129,0)",
        "0px 40px 80px -20px rgba(16,185,129,0.3)"
      ];
    } else {
      input = [start, milestone, end];
      scaleOutput = [0.85, 1.05, 0.85];
      opacityOutput = [0.3, 1, 0.3];
      shadowOutput = [
        "0px 0px 0px 0px rgba(16,185,129,0)",
        "0px 40px 80px -20px rgba(16,185,129,0.3)",
        "0px 0px 0px 0px rgba(16,185,129,0)"
      ];
    }

    const scale = useTransform(scrollYProgress, input, scaleOutput);
    const opacity = useTransform(scrollYProgress, input, opacityOutput);
    const boxShadow = useTransform(scrollYProgress, input, shadowOutput);

    return (
      <div className="w-[85vw] md:w-[60vw] lg:w-[45vw] shrink-0">
        <motion.div
          style={{ scale, opacity, boxShadow }}
          className="flex flex-col gap-8 p-10 md:p-14 min-h-[450px] rounded-[3rem] bg-background/95 backdrop-blur-2xl border border-border hover:border-primary/50 transition-colors duration-500 relative overflow-hidden group cursor-default"
        >
          <div className="absolute top-0 right-0 w-64 h-78 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/20 transition-all" />
          <div className="w-20 h-20 rounded-3xl bg-primary/10 shadow-inner shadow-xl flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
            <span className="text-primary font-black text-3xl">{i}</span>
          </div>
          <div className="space-y-6 relative z-10 w-full bg-transparent flex-1 mt-4">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight font-sans">
              {/* @ts-ignore */}
              {t(`detailList${i}Title`)}
            </h3>
            <p className="text-muted-foreground leading-relaxed font-sans text-lg md:text-xl">
              {/* @ts-ignore */}
              {t(`detailList${i}Desc`)}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  function HorizontalFeatures({ t }: { t: any }) {
    const horizontalScrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: horizontalScrollRef,
      offset: ["start start", "end end"]
    });

    // Translation stops exactly when the right-most part of the scroll track hits the right edge of the screen
    // Format must match perfectly (two numbers each) for Framer Motion to interpolate the string!
    const xTransform = useTransform(scrollYProgress, [0, 1], ["calc(0% + 0vw)", "calc(-100% + 100vw)"]);

    return (
      <>
        {/* Detailed Features Title */}
        <section className="relative z-10 pt-32 pb-4 bg-background">
          <div className="container px-6 mx-auto max-w-5xl">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                {t("detailFeaturesSubtitle")}
              </div>
              <h2 className="text-4xl md:text-6xl font-black bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent tracking-tighter leading-tight">
                {t("detailFeaturesTitle")}
              </h2>
            </div>
          </div>
        </section>

        {/* Detailed Features Horizontal Scroll */}
        <section ref={horizontalScrollRef} className="relative h-[400vh] bg-background">
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            <motion.div
              style={{ x: xTransform }}
              className="flex w-max items-center gap-[5vw] px-[7.5vw] md:px-[20vw] lg:px-[27.5vw]"
            >
              {[1, 2, 3, 4, 5].map((i, index) => (
                <FeatureCard key={i} i={i} index={index} scrollYProgress={scrollYProgress} t={t} />
              ))}
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed?.id) {
          setStorage(parsed);

          if (!sessionStorage.getItem("hasAutoRedirected")) {
            sessionStorage.setItem("hasAutoRedirected", "true");
            const hasCompanies =
              (parsed.companies && parsed.companies.length > 0) ||
              !!parsed.activeCompanyId;
            const target = hasCompanies ? "/dashboard" : "/companies";
            router.push(target);
          }
        }
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, [router]);

  if (!mounted) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    viewport: { once: true, margin: "-100px" },
  };

  const cardHover = {
    scale: 1.03,
    y: -8,
    transition: { duration: 0.2, ease: "easeOut" },
  };

  return (
    <div
      id="landing_page"
      className={cn(
        "min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground",
        visibility && "overflow-y-hidden",
      )}
    >
      {visibility === true && (
        <SignUp
          onVisibility={setVisibility}
          choice={signUpChoise}
          setSignUpChoise={setSignUpChoise}
        />
      )}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-background/80 shadow-lg backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between relative">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 cursor-pointer relative z-10"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Logo logoUrl={"/black-caractere-non-black.png"} w={45} h={45} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Essor
            </span>
          </motion.div>

          {/* Navigation Menu - Centered */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md px-1.5 py-1.5 rounded-2xl border border-white/10">
            {[
              { id: "features", label: t("navFeatures") },
              { id: "details", label: t("navDetails") },
              { id: "ai-intelligence", label: t("navAI") },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setActiveSection(link.id)}
                  className={cn(
                    "relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground/60 hover:text-white"
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute -bottom-1 left-4 right-4 h-[2px] bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons Section */}
          <div className="flex items-center gap-6 relative z-10">
            {!storage ? (
              <>
                <motion.span
                  id="landing_page_conBtn"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    setSignUpChoise(t("loginAction"));
                    setVisibility(true);
                  }}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("login")}
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      setSignUpChoise(t("createAccount"));
                      setVisibility(true);
                    }}
                    className="px-6 py-2.5 text-[10px] font-black text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em]"
                  >
                    {t("startNow")}
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/invoice"
                  onClick={() => clearInvoiceData()}
                  className="px-6 py-2.5 text-[10px] font-black text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em]"
                >
                  {t("getStarted")}
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center pt-32 pb-20">
        <div className="container max-w-5xl mx-auto space-y-12 animate-fade-in-up text-center">
          <div className="inline-flex items-center px-6 py-2.5 space-x-3 text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full backdrop-blur-md uppercase tracking-[0.4em] shadow-lg shadow-primary/5">
            <span className="flex w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>{t("topBadge")}</span>
          </div>

          <h1 className="flex flex-col items-center justify-center text-7xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-white to-slate-500 leading-none">
            <span>NEXT-GEN</span>
            <SparklesText className="text-primary text-9xl md:text-[10.5rem] -mt-6">
              {t("appName")}
            </SparklesText>
          </h1>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-sans font-light">
              {t("heroSubtitle")}
            </p>
            <TypingText
              text={t("heroTypingText")}
              speed={60}
              showCursor={true}
              className="text-primary font-bold text-lg md:text-xl tracking-wide"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            {storage ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/dashboard"
                  className="group relative inline-flex items-center justify-center px-12 py-6 text-xs font-black text-primary-foreground transition-all duration-500 bg-primary rounded-2xl hover:bg-primary/90 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] uppercase tracking-[0.2em]"
                >
                  {t("dashboard")}
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => {
                    setSignUpChoise(t("createAccount"));
                    setVisibility(true);
                  }}
                  className="group relative inline-flex items-center justify-center px-12 py-6 text-xs font-black text-primary-foreground transition-all duration-500 bg-primary rounded-2xl hover:bg-primary/90 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] uppercase tracking-[0.2em] h-auto"
                >
                  {t("signUpFree")}
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            )}

            <Link
              href="#ai-intelligence"
              className="inline-flex items-center justify-center px-12 py-6 text-xs font-bold text-muted-foreground transition-all rounded-2xl border border-border/50 hover:text-foreground hover:bg-white/5 uppercase tracking-[0.2em]"
            >
              {t("seeTech")}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500/50">
          <ArrowRight className="rotate-90 w-6 h-6" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 bg-background/50">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-24 max-w-4xl mx-auto space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              {t("ecosystemBadge")}
            </div>
            <h2 className="text-5xl md:text-7xl font-black bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent tracking-tighter leading-tight">
              {t("ecosystemTitle")}
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-sans max-w-2xl mx-auto italic">
              {t("ecosystemDesc")}
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* Feature 1: Advanced Billing */}
            <motion.div
              variants={fadeInUp}
              whileHover={cardHover}
              className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500 group-hover:rotate-6 shadow-inner shadow-white/5 text-primary">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                {t("feature1Title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                {t("feature1Desc")}
              </p>
            </motion.div>

            {/* Feature 2: Strategic Dashboard */}
            <motion.div
              variants={fadeInUp}
              whileHover={cardHover}
              className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-blue-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-400/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-blue-400/10 flex items-center justify-center mb-8 group-hover:bg-blue-400/20 transition-all duration-500 group-hover:-rotate-6 shadow-inner shadow-white/5 text-blue-400">
                <LayoutDashboard className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                {t("feature2Title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                {t("feature2Desc")}
              </p>
            </motion.div>

            {/* Feature 3: CRM & Client Management */}
            <motion.div
              variants={fadeInUp}
              whileHover={cardHover}
              className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-orange-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-orange-400/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-orange-400/10 flex items-center justify-center mb-8 group-hover:bg-orange-400/20 transition-all duration-500 group-hover:scale-110 shadow-inner shadow-white/5 text-orange-400">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                {t("feature3Title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                {t("feature3Desc")}
              </p>
            </motion.div>

            {/* Feature 4: Planning & Alerts */}
            <motion.div
              variants={fadeInUp}
              whileHover={cardHover}
              className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-red-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-red-400/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-red-400/10 flex items-center justify-center mb-8 group-hover:bg-red-400/20 transition-all duration-500 group-hover:rotate-12 shadow-inner shadow-white/5 text-red-400">
                <Bell className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                {t("feature4Title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                {t("feature4Desc")}
              </p>
            </motion.div>

            {/* Feature 5: Intelligence Pulse™ */}
            <motion.div
              variants={fadeInUp}
              whileHover={cardHover}
              className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-emerald-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-emerald-400/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-emerald-400/10 flex items-center justify-center mb-8 group-hover:bg-emerald-400/20 transition-all duration-500 group-hover:-rotate-12 shadow-inner shadow-white/5 text-emerald-400">
                <Brain className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                {t("feature5Title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                {t("feature5Desc")}
              </p>
            </motion.div>

            {/* Feature 6: Security & Archives */}
            <motion.div
              variants={fadeInUp}
              whileHover={cardHover}
              className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-indigo-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-indigo-400/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-indigo-400/10 flex items-center justify-center mb-8 group-hover:bg-indigo-400/20 transition-all duration-500 group-hover:scale-110 shadow-inner shadow-white/5 text-indigo-400">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                {t("feature6Title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                {t("feature6Desc")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Features Title */}
      <div id="details">
        <HorizontalFeatures t={t} />
      </div>


      {/* AI Economic Intelligence Section */}
      <section
        id="ai-intelligence"
        className="relative z-10 py-40 overflow-hidden"
      >
        <div className="container px-6 mx-auto">
          <div className="bg-linear-to-br from-card/80 to-background border border-border/50 shadow-xl rounded-[3.5rem] p-12 md:p-24 backdrop-blur-3xl relative">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="grid lg:grid-cols-2 gap-20 items-center relative z-10"
            >
              <div className="space-y-8">
                <motion.div
                  variants={fadeInUp}
                  className="inline-flex items-center px-4 py-2 space-x-2 text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full uppercase tracking-widest"
                >
                  <Brain className="w-4 h-4" />
                  <span>{t("pulseModule")}</span>
                </motion.div>

                <motion.h2
                  variants={fadeInUp}
                  className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-tight"
                >
                  {t("aiSectionTitle")} <br />
                  <span className="text-primary">{t("aiSectionSubtitle")}</span>
                </motion.h2>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-muted-foreground font-sans leading-relaxed"
                >
                  {t("aiSectionDesc")}
                </motion.p>

                <div className="grid gap-6">
                  {[
                    {
                      title: t("automatedReportsTitle"),
                      desc: t("automatedReportsDesc"),
                    },
                    {
                      title: t("interactiveAssistantTitle"),
                      desc: t("interactiveAssistantDesc"),
                    },
                    {
                      title: t("financialHealthTitle"),
                      desc: t("financialHealthDesc"),
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={fadeInUp}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(255,255,255,0.08)",
                      }}
                      className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group cursor-default"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground font-sans tracking-tight uppercase text-sm tracking-[0.1em]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div variants={fadeInUp} className="relative group">
                {/* Decorative Elements for AI Graphic */}
                <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse" />
                <div className="absolute -inset-10 bg-secondary/20 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition duration-1000 delay-500" />

                <div className="relative p-1 rounded-[3rem] bg-linear-to-tr from-primary/50 via-white/10 to-secondary/50 shadow-2xl overflow-hidden">
                  <div className="rounded-[2.8rem] bg-slate-950 p-10 aspect-square flex items-center justify-center">
                    <div className="relative w-full h-200 flex flex-col items-center justify-center space-y-8">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center"
                      >
                        <Brain className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      </motion.div>
                      <div className="space-y-4 w-full">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${90 - i * 15}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                            className={`h-2 rounded-full bg-linear-to-r from-primary/40 to-transparent mx-auto`}
                          />
                        ))}
                      </div>
                      <div className="text-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          className="text-primary font-mono text-3xl font-black"
                        >
                          98.4%
                        </motion.span>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-1">
                          {t("aiConfidence")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's New v1.5 Section */}
      <section id="whats-new" className="relative z-10 py-32 bg-background/30 backdrop-blur-sm">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-24 max-w-4xl mx-auto space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              {t("v15Badge")}
            </div>
            <h2 className="text-5xl md:text-7xl font-black bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent tracking-tighter leading-tight">
              {t("whatsNewTitle")}
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-sans max-w-2xl mx-auto italic">
              {t("whatsNewSubtitle")}
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          >
            {[
              // { id: 1, icon: Zap },
              { id: 1, icon: Bell },
              { id: 2, icon: ShieldCheck },
              // { id: 4, icon: Globe },
              // { id: 5, icon: FileCheck },
              { id: 3, icon: RefreshCw },
            ].map((item) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                whileHover={cardHover}
                className="group p-8 rounded-[2.5rem] bg-card/40 border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl relative overflow-hidden cursor-default"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-all" />
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-primary">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-sans tracking-tight">
                  {/* @ts-ignore */}
                  {t(`update${item.id}Title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-sans text-sm">
                  {/* @ts-ignore */}
                  {t(`update${item.id}Desc`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative z-10 py-32 bg-background">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">
                {t("workflowTitle")} <br />
                <span className="text-muted-foreground/30">
                  {t("workflowSubtitle")}
                </span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium">
                {t("workflowDesc")}
              </p>
            </div>
            <div className="h-1 w-32 bg-primary rounded-full mb-4 hidden md:block" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: FileText,
                label: t("step1Label"),
                desc: t("step1Desc"),
              },
              {
                icon: TrendingUp,
                label: t("step2Label"),
                desc: t("step2Desc"),
              },
              {
                icon: Brain,
                label: t("step3Label"),
                desc: t("step3Desc"),
              },
              {
                icon: ArrowRight,
                label: t("step4Label"),
                desc: t("step4Desc"),
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="space-y-6 group cursor-default"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl group-hover:shadow-primary/25">
                    <step.icon className="w-8 h-8" />
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-10 left-32 right-[-2rem] h-px bg-linear-to-r from-border/50 via-primary/20 to-transparent" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono text-xs font-bold">
                      0{idx + 1}
                    </span>
                    <h4 className="font-black text-sm tracking-[0.2em] text-foreground uppercase">
                      {step.label}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium pr-4">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container px-6 mx-auto">
          <div className="relative overflow-hidden rounded-[4rem] bg-linear-to-br from-primary via-emerald-700 to-indigo-900 p-12 md:p-24 text-center shadow-[0_50px_100px_-20px_rgba(16,185,129,0.3)]">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-black/20 blur-[100px] rounded-full" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase drop-shadow-2xl">
                {t("ctaTitle")} <br />
                {t("ctaTitleHighlight")}
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium font-sans italic">
                {t("ctaSubtitle")}
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                {!storage ? (
                  <Button
                    onClick={() => {
                      setSignUpChoise(t("createAccount"));
                      setVisibility(true);
                    }}
                    className="inline-flex items-center justify-center px-16 py-8 text-sm font-black text-primary bg-white rounded-[2rem] hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl shadow-black/30 uppercase tracking-[0.3em] h-auto"
                  >
                    {t("startNow")}
                    <ArrowRight className="w-5 h-5 ml-4" />
                  </Button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-16 py-8 text-sm font-black text-primary bg-white rounded-[2rem] hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl shadow-black/30 uppercase tracking-[0.3em] h-auto"
                  >
                    {t("startNow")}
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-24 border-t border-border/20 bg-background text-sm font-sans">
        <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-muted-foreground">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Logo
                  logoUrl={"/black-caractere-non-black.png"}
                  w={45}
                  h={45}
                />
              </div>
              <span className="font-black tracking-[0.5em] uppercase text-sm text-foreground">
                ESSOR
              </span>
            </div>
            <p className="text-xs max-w-xs text-center md:text-left leading-relaxed font-medium">
              {t("footerDesc")}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] mb-4">

              <Link href="/privacy" className="hover:text-primary transition-colors">
                {t("privacy")}
              </Link>
            </div>
            <p className="font-bold tracking-tight text-[11px] opacity-40">
              &copy; {new Date().getFullYear()} {t("footerRights")}
            </p>
            <p className="font-black tracking-widest text-[11px] text-primary/80 uppercase mt-1">
              {t("authorSignature")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
