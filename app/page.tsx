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
} from "lucide-react";
import Logo from "@/src/components/navbar-components/logo";
import { SparklesText } from "@/src/components/ui/sparkles-text";
import { TypingText } from "@/src/components/ui/typing-text";
import SignUp from "@/src/components/signup";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Home() {
  const [signUpChoise, setSignUpChoise] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const { clearInvoiceData } = useInvoice();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [storage, setStorage] = useState<{
    name: string;
    token: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setStorage(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

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
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Logo logoUrl={"/black-caractere-non-black.png"} w={45} h={45} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Essor
            </span>
          </div>

          {!storage ? (
            <div className="flex items-center gap-6">
              <span
                id="landing_page_conBtn"
                onClick={() => {
                  setSignUpChoise(t("loginAction"));
                  setVisibility(true);
                }}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer uppercase tracking-widest"
              >
                {t("login")}
              </span>
              <Button
                onClick={() => {
                  setSignUpChoise(t("createAccount"));
                  setVisibility(true);
                }}
                className="px-6 py-2.5 text-xs font-black text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em]"
              >
                {t("startBtn")}
              </Button>
            </div>
          ) : (
            <Link
              href="/invoice"
              onClick={() => clearInvoiceData()}
              className="px-6 py-2.5 text-xs font-black text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em]"
            >
              {t("getStarted")}
            </Link>
          )}
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
            <span className="opacity-40">NEXT-GEN</span>
            <SparklesText className="text-white text-9xl md:text-[10.5rem] -mt-6">
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
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-12 py-6 text-xs font-black text-primary-foreground transition-all duration-500 bg-primary rounded-2xl hover:bg-primary/90 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] uppercase tracking-[0.2em]"
              >
                {t("dashboard")}
                <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
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
      <section className="relative z-10 py-32 bg-background/50">
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

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Advanced Billing */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
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
            </div>

            {/* Feature 2: Strategic Dashboard */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-blue-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
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
            </div>

            {/* Feature 3: CRM & Client Management */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-orange-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
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
            </div>

            {/* Feature 4: Planning & Alerts */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-red-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
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
            </div>

            {/* Feature 5: Intelligence Pulse™ */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-emerald-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
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
            </div>

            {/* Feature 6: Security & Archives */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-indigo-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
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
            </div>
          </div>
        </div>
      </section>

      {/* AI Economic Intelligence Section */}
      <section
        id="ai-intelligence"
        className="relative z-10 py-40 overflow-hidden"
      >
        <div className="container px-6 mx-auto">
          <div className="bg-linear-to-br from-card/80 to-background border border-border/50 rounded-[3.5rem] p-12 md:p-24 backdrop-blur-3xl relative">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />

            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-8">
                <div className="inline-flex items-center px-4 py-2 space-x-2 text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full uppercase tracking-widest">
                  <Brain className="w-4 h-4" />
                  <span>{t("pulseModule")}</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-tight">
                  {t("aiSectionTitle")} <br />
                  <span className="text-primary">{t("aiSectionSubtitle")}</span>
                </h2>

                <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                  {t("aiSectionDesc")}
                </p>

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
                    <div
                      key={idx}
                      className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group"
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
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                {/* Decorative Elements for AI Graphic */}
                <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse" />
                <div className="absolute -inset-10 bg-secondary/20 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition duration-1000 delay-500" />

                <div className="relative p-1 rounded-[3rem] bg-linear-to-tr from-primary/50 via-white/10 to-secondary/50 shadow-2xl overflow-hidden">
                  <div className="rounded-[2.8rem] bg-slate-950 p-10 aspect-square flex items-center justify-center">
                    <div className="relative w-full h-200 flex flex-col items-center justify-center space-y-8">
                      <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                        <Brain className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      </div>
                      <div className="space-y-4 w-full">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-2 rounded-full bg-linear-to-r from-primary/40 to-transparent w-[${100 - i * 20}%] mx-auto animate-pulse`}
                            style={{
                              animationDelay: `${i * 200}ms`,
                              width: `${90 - i * 15}%`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-center">
                        <span className="text-primary font-mono text-3xl font-black">
                          98.4%
                        </span>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-1">
                          {t("aiConfidence")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

          <div className="grid md:grid-cols-4 gap-8">
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
              <div key={idx} className="space-y-6 group">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container px-6 mx-auto">
          <div className="relative overflow-hidden rounded-[4rem] bg-linear-to-br from-primary via-emerald-700 to-indigo-900 p-12 md:p-24 text-center shadow-[0_50px_100px_-20px_rgba(16,185,129,0.3)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
              </div>
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
                <Logo />
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
              <Link href="#" className="hover:text-primary transition-colors">
                {t("terms")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("privacy")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("api")}
              </Link>
            </div>
            <p className="font-bold tracking-tight text-[11px] opacity-40">
              &copy; {new Date().getFullYear()} {t("footerRights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
