"use client";

import { useState } from "react";
import ClientsPage from "../clients/page";
import ProductsPage from "../products/page";
import ExpensesPage from "../expenses/page";
import { useLanguage } from "@/src/context/LanguageContext";
import { Users, Package, Receipt } from "lucide-react";

export default function ManagementPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "clients" | "products" | "expenses"
  >("clients");

  return (
    <div className="min-h-full min-w-full bg-background flex flex-col">
      <div className="border-b border-border/50 sticky top-0 z-40 bg-background/80 backdrop-blur-md px-5 md:px-10 lg:px-16 pt-8 pb-0 pt-28 md:pt-28 lg:pt-28">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-10 bg-primary rounded-full" />
                <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                  Workspace
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent font-sans">
                {t("management") || "Gestion Globale"}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl font-sans">
                Gérez vos clients, votre catalogue et vos dépenses en un seul
                endroit.
              </p>
            </div>
          </div>

          <div className="flex space-x-8 overflow-x-auto scrollbar-hide pt-4">
            <button
              onClick={() => setActiveTab("clients")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "clients" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <Users className="w-4 h-4" />
              {t("clients") || "Clients"}
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "products" ? "border-indigo-500 text-indigo-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <Package className="w-4 h-4" />
              {t("products") || "Catalogue"}
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === "expenses" ? "border-amber-500 text-amber-500" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <Receipt className="w-4 h-4" />
              {t("expenses") || "Dépenses"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 md:p-5 lg:p-5 px-10 md:px-10 lg:px-10  overflow-y-auto relative pb-20">
        <div className="w-full animate-fade-in-up">
          {activeTab === "clients" && <ClientsPage isComponent={true} />}
          {activeTab === "products" && <ProductsPage isComponent={true} />}
          {activeTab === "expenses" && <ExpensesPage isComponent={true} />}
        </div>
      </div>
    </div>
  );
}
