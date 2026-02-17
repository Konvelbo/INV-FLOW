"use client";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { AIInsightCard } from "@/src/components/dashboard/AIInsightCard";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
  Package,
} from "lucide-react";
import LineChart2 from "@/src/components/line-chart-2";
import { RecentInvoices } from "@/src/components/dashboard/RecentInvoices";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<{
    name: string;
    token: string;
  } | null>(null);

  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalMaterial: number;
    pendingRevenue: number;
    pendingCount: number;
    chartData: any[];
    growth: string;
    invoiceCount: number;
    recentInvoices: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        fetchStats(userData.token);
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(value);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 relative overflow-hidden pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">
                Portail Administrateur
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Bonjour, {user?.name || "Invité"} 👋
            </h1>
            <p className="text-slate-400 text-lg">
              Voici l'état actuel de votre performance financière.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 text-sm font-medium">
                Système Actif
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-fade-in-up delay-100">
          <StatsCard
            title="Revenu Scalé"
            value={formatCurrency(stats?.totalRevenue || 0)}
            trend={`${stats?.growth || 0}% mois`}
            trendUp={Number(stats?.growth) >= 0}
            icon={DollarSign}
            variant="blue"
          />
          <StatsCard
            title="Matériel Facturé"
            value={`${stats?.totalMaterial || 0}`}
            trend="Unités"
            trendUp={true}
            icon={Package}
            variant="indigo"
          />
          <StatsCard
            title="Performance"
            value={formatCurrency(
              (stats?.totalRevenue || 0) / (stats?.invoiceCount || 1),
            )}
            trend="Par facture"
            trendUp={true}
            icon={TrendingUp}
            variant="emerald"
          />
          <StatsCard
            title="Factures Validées"
            value={String(stats?.invoiceCount || 0)}
            trend="Total"
            trendUp={true}
            icon={TrendingUp}
            variant="slate"
          />
          <StatsCard
            title="En Attente"
            value={String(stats?.pendingCount || 0)}
            trend={formatCurrency(stats?.pendingRevenue || 0)}
            trendUp={false}
            icon={Wallet}
            variant="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up delay-200 pb-10">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <LineChart2 externalData={stats?.chartData} />
          </div>

          {/* AI Insights & Recent Invoices Section */}
          <div className="lg:col-span-1 space-y-8">
            <AIInsightCard stats={stats} />
            <RecentInvoices invoices={stats?.recentInvoices || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
