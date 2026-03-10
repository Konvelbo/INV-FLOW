"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function GlobalLayoutError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { t } = useLanguage();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center space-y-8 p-10 animate-fade-in-up">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-xl">
                <AlertCircle className="w-16 h-16 text-destructive/80" />
            </div>

            <div className="space-y-3">
                <h2 className="text-3xl font-black uppercase tracking-tight italic">
                    {t("errorTitle") || "Accès Interrompu"}
                </h2>
                <p className="text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
                    {t("errorDescription") || "Une erreur est survenue lors du chargement de cette section. Vous pouvez essayer de rafraîchir ou revenir à l'accueil."}
                </p>
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    variant="outline"
                    className="h-12 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest gap-2 transition-all"
                >
                    <RefreshCcw className="w-4 h-4" />
                    {t("retry") || "Réessayer"}
                </Button>

                <Link href="/dashboard" passHref>
                    <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-primary/20 transition-all">
                        <Home className="w-4 h-4" />
                        {t("backToDashboard") || "Dashboard"}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
