"use client";

import { Brain, ShieldCheck, Zap } from "lucide-react";
import { ChatInterface } from "@/src/components/ai/ChatInterface";

export default function AIAdvisorPage() {
  return (
    <div className="min-h-screen min-w-full bg-background text-foreground p-6 md:p-10 lg:p-16 relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-8xl mx-auto space-y-12 relative z-10 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 bg-primary rounded-full" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                Pulse™ Intelligence
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent font-sans">
              Assistant IA Économique
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-sans">
              Analysez vos flux, optimisez vos marges et prenez des décisions
              stratégiques basées sur vos données réelles.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Données Sécurisées
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <Zap className="w-4 h-4 text-amber-500" />
              Analyse Temps Réel
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 min-h-0 animate-fade-in-up delay-100">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
