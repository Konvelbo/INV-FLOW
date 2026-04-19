import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Confidentialité | Essor",
  description: "Politique de confidentialité de l'application Essor.",
};

export default function PrivacyPage() {
  let privacyHtml = "<p>Erreur lors du chargement de la politique de confidentialité.</p>";
  
  try {
    const filePath = path.join(process.cwd(), "src", "components", "confidentialiter", "terme.html");
    privacyHtml = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error("Impossible de lire le fichier terme.html", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>
        <div 
          className="bg-card border border-border/50 shadow-xl rounded-[2.5rem] p-8 md:p-12"
          dangerouslySetInnerHTML={{ __html: privacyHtml }} 
        />
      </div>
    </div>
  );
}
