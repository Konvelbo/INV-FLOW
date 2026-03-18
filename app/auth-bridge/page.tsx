"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";

function AuthBridgeContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const connectionId = searchParams.get("id");
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // @ts-ignore - custom property from auth.ts
      const token = session.user.token;
      if (token) {
        // 1. Try Deep Link (Fastest fallback)
        window.location.href = `essor://login?token=${token}`;

        // 2. Try Polling Bridge (Most reliable)
        if (connectionId) {
          axios.post("/api/auth/bridge", {
            id: connectionId,
            token: token
          }).then(() => {
            setSynced(true);
            // Optionally close the tab after a delay
            setTimeout(() => window.close(), 3000);
          }).catch(err => {
            console.error("Bridge sync error:", err);
            // Even if bridge fails, we mark as synced so user can close tab
            setSynced(true);
          });
        } else {
           setSynced(true);
        }
      }
    }
  }, [status, session, connectionId]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
            {synced ? (
              <CheckCircle2 className="w-16 h-16 text-primary relative z-10" />
            ) : (
              <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {synced ? "Connexion synchronisée !" : "Finalisation de la connexion..."}
          </h1>
          <p className="text-slate-400 text-lg">
            {synced 
              ? "Vous pouvez maintenant retourner sur l'application ESSOR. Cet onglet se fermera automatiquement."
              : "Veuillez patienter pendant que nous synchronisons votre session avec l'application."}
          </p>
        </div>

        {synced && (
          <button 
            onClick={() => window.close()}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            Fermer cet onglet manuellement
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthBridgePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>}>
      <AuthBridgeContent />
    </Suspense>
  );
}
