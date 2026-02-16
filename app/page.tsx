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

export default function Home() {
  const [signUpChoise, setSignUpChoise] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const [storage, setStorage] = useState<{
    name: string;
    token: string;
  } | null>(null);

  useEffect(() => {
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
        "min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 selection:text-blue-200",
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Logo />
            </div>
            <span className="text-xl font-bold tracking-tight">
              InvoiceFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span
              id="landing_page_conBtn"
              onClick={() => {
                setSignUpChoise("Connexion");
                setVisibility(true);
              }}
              className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Connexion
            </span>
            <Button
              onClick={() => {
                setSignUpChoise("Creer votre compte");
                setVisibility(true);
              }}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20">
        <div className="container max-w-5xl mx-auto space-y-8 animate-fade-in-up text-center">
          <div className="inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium text-blue-300 bg-blue-900/30 border border-blue-800 rounded-full backdrop-blur-sm">
            <span className="flex w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>v2.0 Disponible Maintenant</span>
          </div>

          <h1 className="flex items-center justify-center text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-blue-100 to-blue-200 leading-tight">
            Invoice
            <SparklesText className="text-white text-8xl">Flow</SparklesText>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed">
            Simplifiez votre facturation, suivez vos finances et grandissez avec
            l&apos;IA.
            <TypingText
              text="Des factures professionnelles & des analyses intelligentes."
              speed={80}
              showCursor={true}
              className="text-slate-200 block mt-2"
            />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {storage ? (
              <Link
                href="/invoice"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Commencer
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Button
                onClick={() => {
                  setVisibility(true);
                  setSignUpChoise("Connexion");
                }}
                className="group relative inline-flex items-center justify-center px-1 py-6 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Commencer
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            )}

            <Link
              href="/features"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-300 transition-colors rounded-full hover:text-white hover:bg-white/5"
            >
              En Savoir Plus
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
          <ArrowRight className="rotate-90 w-6 h-6" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 bg-slate-950">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-linear-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Fonctionnalités Conçues pour Vous
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Au-delà de la facturation : Des outils puissants pour suivre votre
              croissance et optimiser votre entreprise.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <FileText className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Facturation Intelligente
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Générez des factures professionnelles en quelques minutes.
                Modèles personnalisables qui correspondent parfaitement à votre
                marque.
              </p>
            </div>

            {/* Feature 2: Financial Tracking */}
            <div className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <TrendingUp className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Suivi Financier
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Surveillez les gains, les pertes et le bénéfice net en temps
                réel. Visualisez votre santé financière avec des tableaux de
                bord intuitifs.
              </p>
            </div>

            {/* Feature 3: AI Insights */}
            <div className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Brain className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Analyses par IA
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Obtenez des recommandations intelligentes pour optimiser les
                coûts et augmenter les revenus. Votre assistant commercial
                intelligent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container px-6 mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-16 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white tracking-tight">
                Prêt à simplifier votre facturation ?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Rejoignez des milliers d&apos;entreprises qui font confiance à
                InvoiceFlow pour leur facturation. Commencez aujourd&apos;hui
                gratuitement.
              </p>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-blue-900 bg-white rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Créer Compte Gratuit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-900 bg-slate-950">
        <div className="container px-6 mx-auto text-center">
          <div className="flex justify-center items-center space-x-6 mb-8 text-slate-500">
            {/* Social Links or other footer items could go here */}
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} InvoiceFlow. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
