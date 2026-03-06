"use client";

import Link from "next/link";
import { ArrowRight, FileText, TrendingUp, Brain } from "lucide-react";
import Logo from "@/src/components/navbar-components/logo";
import { SparklesText } from "@/src/components/ui/sparkles-text";
import { TypingText } from "@/src/components/ui/typing-text";
import SignUp from "@/src/components/signup";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInvoice } from "@/src/context/InvoiceContext";

export default function Home() {
  const [signUpChoise, setSignUpChoise] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const { clearInvoiceData } = useInvoice();
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
                  setSignUpChoise("Connexion");
                  setVisibility(true);
                }}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer uppercase tracking-widest"
              >
                Connexion
              </span>
              <Button
                onClick={() => {
                  setSignUpChoise("Creer votre compte");
                  setVisibility(true);
                }}
                className="px-6 py-2.5 text-xs font-black text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em]"
              >
                Démarrer
              </Button>
            </div>
          ) : (
            <Link
              href="/invoice"
              onClick={() => clearInvoiceData()}
              className="px-6 py-2.5 text-xs font-black text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-[0.2em]"
            >
              Lancez-vous
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center pt-32 pb-20">
        <div className="container max-w-5xl mx-auto space-y-12 animate-fade-in-up text-center">
          <div className="inline-flex items-center px-6 py-2.5 space-x-3 text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full backdrop-blur-md uppercase tracking-[0.4em] shadow-lg shadow-primary/5">
            <span className="flex w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>v3.0 Intelligence Operationnelle</span>
          </div>

          <h1 className="flex flex-col items-center justify-center text-7xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-white to-slate-500 leading-none">
            <span className="opacity-40">NEXT-GEN</span>
            <SparklesText className="text-white text-9xl md:text-[10.5rem] -mt-6">
              ESSOR
            </SparklesText>
          </h1>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-sans font-light">
              L&apos;infrastructure de facturation intelligente qui transforme
              vos données en levier de croissance exponentielle.
            </p>
            <TypingText
              text="Analyse prédictive. Conformité automatisée. Vision 360°."
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
                Tableau de Bord
                <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Button
                onClick={() => {
                  setSignUpChoise("Creer votre compte");
                  setVisibility(true);
                }}
                className="group relative inline-flex items-center justify-center px-12 py-6 text-xs font-black text-primary-foreground transition-all duration-500 bg-primary rounded-2xl hover:bg-primary/90 hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] uppercase tracking-[0.2em] h-auto"
              >
                Inscrivez-vous Gratuitement
                <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
              </Button>
            )}

            <Link
              href="#ai-intelligence"
              className="inline-flex items-center justify-center px-12 py-6 text-xs font-bold text-muted-foreground transition-all rounded-2xl border border-border/50 hover:text-foreground hover:bg-white/5 uppercase tracking-[0.2em]"
            >
              Voir la Technologie
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
              L&apos;Ecosystème
            </div>
            <h2 className="text-5xl md:text-7xl font-black bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent tracking-tighter leading-tight">
              PUISSANCE & PRÉCISION
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-sans max-w-2xl mx-auto italic">
              Conçu pour les entreprises qui ne font aucun compromis entre
              rapidité opérationnelle et rigueur comptable.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500 group-hover:rotate-6 shadow-inner shadow-white/5">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                Ingénierie de Facturation
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                Générez des factures professionnelles conformes aux standards
                internationaux en moins de 30 secondes. Notre moteur dynamique
                gère les taxes, les remises et les mentions légales
                automatiquement.
              </p>
            </div>

            {/* Feature 2: High-Performance Data */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-secondary/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-secondary/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:bg-secondary/20 transition-all duration-500 group-hover:-rotate-6 shadow-inner shadow-white/5">
                <TrendingUp className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                Flux de Trésorerie
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                Visualisez votre santé financière en temps réel. Des graphiques
                haute performance analysent vos revenus HT, vos marges et vos
                tendances de paiement pour une visibilité sans faille sur votre
                cash-flow.
              </p>
            </div>

            {/* Feature 3: Security & Backup */}
            <div className="group p-10 rounded-[2.5rem] bg-card border border-border/50 hover:border-emerald-400/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 text-center flex flex-col items-center backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110 shadow-inner shadow-white/5">
                <TrendingUp className="w-10 h-10 text-primary rotate-45" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-sans tracking-tight">
                Archive immuable
              </h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-sm font-medium">
                Retrouvez chaque transaction dans un historique sécurisé et
                catégorisé. Notre système de stockage à haute disponibilité
                garantit que vos données financières sont toujours accessibles
                et inaltérables.
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
                  <span>Module IA Pulse™</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-tight">
                  SUIVI ÉCONOMIQUE <br />
                  <span className="text-primary">
                    PAR INTELLIGENCE ARTIFICIELLE
                  </span>
                </h2>

                <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                  Notre IA ne se contente pas de stocker vos chiffres, elle les
                  comprend. Grâce à l&apos;analyse sémantique et prédictive,{" "}
                  <strong>Pulse™</strong> identifie les variations de revenus,
                  détecte les anomalies de facturation et suggère des
                  optimisations stratégiques en temps réel.
                </p>

                <div className="grid gap-6">
                  {[
                    {
                      title: "Prévision de Trésorerie",
                      desc: "Prédit vos rentrées d'argent à 30/60/90 jours avec une précision de 98%.",
                    },
                    {
                      title: "Détection d'Anomalies",
                      desc: "Alerte instantanément en cas d'écarts de prix ou de doublons de facturation.",
                    },
                    {
                      title: "Score de Santé Financière",
                      desc: "Un indicateur dynamique basé sur 15 paramètres économiques clés.",
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
                          Ai Confidence Index
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
                LE WORKFLOW <br />
                <span className="text-muted-foreground/30">
                  D&apos;ACCÉLÉRATION
                </span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium">
                Une transition fluide de la donnée brute à la vision économique.
              </p>
            </div>
            <div className="h-1 w-32 bg-primary rounded-full mb-4 hidden md:block" />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                label: "CAPTATION",
                desc: "Création instantanée de factures intelligentes.",
              },
              {
                icon: TrendingUp,
                label: "ANALYSE",
                desc: "Traitement des flux financiers en temps réel.",
              },
              {
                icon: Brain,
                label: "INSIGHT",
                desc: "Génération d'analyses stratégiques par l'IA.",
              },
              {
                icon: ArrowRight,
                label: "SCALABILITÉ",
                desc: "Croissance pilotée par les données.",
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
                FORCEZ LE DESTIN <br />
                FINANCIER
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium font-sans italic">
                Ne vous contentez pas de gérer. Dominez vos flux avec
                l&apos;architecture ESSOR.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {!storage ? (
                  <Button
                    onClick={() => {
                      setSignUpChoise("Creer votre compte");
                      setVisibility(true);
                    }}
                    className="inline-flex items-center justify-center px-16 py-8 text-sm font-black text-primary bg-white rounded-[2rem] hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl shadow-black/30 uppercase tracking-[0.3em] h-auto"
                  >
                    Démarrer Maintenant
                    <ArrowRight className="w-5 h-5 ml-4" />
                  </Button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-16 py-8 text-sm font-black text-primary bg-white rounded-[2rem] hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl shadow-black/30 uppercase tracking-[0.3em] h-auto"
                  >
                    Démarrer Maintenant
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
              Architecture logicielle haute performance pour la gestion
              financière moderne. Propulsé par Pulse™ IA.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Link href="#" className="hover:text-primary transition-colors">
                Termes
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Confidentialité
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                API
              </Link>
            </div>
            <p className="font-bold tracking-tight text-[11px] opacity-40">
              &copy; {new Date().getFullYear()} ESSOR ARCHITECTURE. TOUS DROITS
              RÉSERVÉS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
