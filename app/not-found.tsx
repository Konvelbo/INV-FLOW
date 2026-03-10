"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6">
            {/* Decorative Background Elements (Simple and Premium) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md animate-fade-in-up">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
                    <FileQuestion className="w-16 h-16 text-primary animate-bounce-slow" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-7xl font-black tracking-tighter uppercase italic">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("pageNotFound") || "Page Introuvable"}
                    </h2>
                    <p className="text-slate-400 font-sans leading-relaxed">
                        {t("pageNotFoundDesc") || "Oups ! Il semble que cette page n'existe plus ou a été déplacée."}
                    </p>
                </div>

                <Link href="/dashboard" passHref>
                    <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                        <Home className="w-5 h-5" />
                        {t("backToDashboard") || "Retour au Tableau de Bord"}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
