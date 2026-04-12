"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-xl animate-fade-in-up">
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-2xl scale-110">
          <AlertCircle className="w-16 h-16 text-destructive animate-pulse" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-destructive">
            {t("errorTitle")}
          </h1>
          <p className="text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
            {t("errorDescription")}
          </p>
        </div>

        {/* Technical Hint (Simple and Premium) */}
        {error.message && (
          <div className="w-full bg-destructive/5 border border-destructive/10 p-4 rounded-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive mb-1 opacity-60">{t("techInfo")}</p>
            <p className="text-xs text-slate-300 font-mono italic opacity-90 truncate max-w-full">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest gap-3 transition-all h-auto"
          >
            <RefreshCcw className="w-5 h-5" />
            {t("retry")}
          </Button>

          <Link href="/dashboard" passHref className="flex-grow sm:flex-grow-0">
            <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105 h-auto w-full">
              <Home className="w-5 h-5" />
              {t("backToDashboard")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
