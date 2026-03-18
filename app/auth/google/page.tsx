"use client";

import { useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function GoogleLoginInitiator() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    // Initiate Google Sign-In via POST (handled by next-auth/react's signIn)
    signIn("google", { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
        <h1 className="text-2xl font-bold text-white">
          Redirection vers Google...
        </h1>
        <p className="text-slate-400">
          Veuillez patienter pendant que nous préparons votre connexion sécurisée.
        </p>
      </div>
    </div>
  );
}

export default function GoogleAuthPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <GoogleLoginInitiator />
    </Suspense>
  );
}
