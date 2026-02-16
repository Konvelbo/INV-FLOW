"use client";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { AIInsightCard } from "@/src/components/dashboard/AIInsightCard";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import LineChart2 from "@/src/components/line-chart-2";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<{
    name: string;
    token: string;
  } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        // console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              {user?.name} 👋
            </h1>
            <h1 className="text-3xl font-semibold tracking-tight">
              Tableau de Bord Financier
            </h1>
            <p className="text-slate-400 mt-1">
              Suivez les performances de votre entreprise et obtenez des
              analyses par IA.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
              Données en direct
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-100">
          <StatsCard
            title="Revenu Total"
            value="45 231,89 €"
            trend="+20,1% vs mois dernier"
            trendUp={true}
            icon={DollarSign}
            className="border-indigo-500/20"
          />
          <StatsCard
            title="Dépenses Totales"
            value="12 305,00 €"
            trend="+4,3% vs mois dernier"
            trendUp={false}
            icon={Wallet}
          />
          <StatsCard
            title="Bénéfice Net"
            value="32 926,89 €"
            trend="+15,2% vs mois dernier"
            trendUp={true}
            icon={TrendingUp}
            className="bg-emerald-900/10 border-emerald-500/20"
          />
          <StatsCard
            title="En Attente"
            value="2 450,00 €"
            trend="-5% vs mois dernier"
            trendUp={true}
            icon={TrendingDown}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          {/* Chart Section */}
          <div className="md:col-span-2 space-y-6">
            <LineChart2 />
          </div>

          {/* AI Insights Section */}
          <div className="md:col-span-1">
            <AIInsightCard />
          </div>
        </div>
      </div>
    </div>
  );
}
