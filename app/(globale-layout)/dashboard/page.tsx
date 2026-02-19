"use client";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { AIInsightCard } from "@/src/components/dashboard/AIInsightCard";
import { DollarSign, TrendingUp, Wallet, Package } from "lucide-react";
import LineChart2 from "@/src/components/line-chart-2";
import { RecentInvoices } from "@/src/components/dashboard/RecentInvoices";
import { InvoiceCalendar } from "@/src/components/dashboard/InvoiceCalendar";
import { useEffect, useState } from "react";
import { useInvoice } from "@/src/context/InvoiceContext";

export default function Dashboard() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    token: string;
  } | null>(null);

  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalMaterial: number;
    pendingRevenue: number;
    pendingCount: number;
    chartData: any[];
    growth: string;
    performance: string;
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
      const response = await fetch(`/api/dashboard/stats?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
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

  const { currency } = useInvoice();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency || "XOF",
    }).format(value);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-450 bg-background text-foreground p-6 md:p-10 lg:p-12 relative overflow-hidden pb-20">
      {/* Background Decorative Elements - Refined Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 bg-primary rounded-full" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                Finances Hub
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent font-sans">
              Bonjour, {user?.name || "Invité"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-sans">
              Consultez et gérez vos flux de facturation avec une précision
              chirurgicale.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-card border border-border/50 backdrop-blur-xl shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-foreground text-xs font-bold uppercase tracking-widest">
                En Ligne
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:grid-rows-2 xl:gap-6 xl:gap-x-10 gap-6 animate-fade-in-up delay-100">
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
            value={stats?.performance ? `${stats.performance}%` : "0.0%"}
            trend="VS précédent"
            trendUp={Number(stats?.performance) >= 0}
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
          {/* Left/Middle Column - Chart & AI */}
          <div className="lg:col-span-2 space-y-8">
            <LineChart2 externalData={stats?.chartData} />

            <div className="grid md:grid-cols-2 gap-8">
              <InvoiceCalendar invoices={stats?.recentInvoices || []} />
              <AIInsightCard stats={stats} />
            </div>
          </div>

          {/* Right Column - Recent Invoices */}
          <div className="lg:col-span-1">
            <RecentInvoices invoices={stats?.recentInvoices || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
