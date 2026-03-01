"use client";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { AIInsightCard } from "@/src/components/dashboard/AIInsightCard";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Package,
  ListTodo,
} from "lucide-react";
import LineChart2 from "@/src/components/line-chart-2";
import { RecentInvoices } from "@/src/components/dashboard/RecentInvoices";
import { InvoiceCalendar } from "@/src/components/dashboard/InvoiceCalendar";
import { useEffect, useState } from "react";
import { useInvoice } from "@/src/context/InvoiceContext";
import { useProductivity } from "@/hooks/useProductivity";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";

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
    chartData: Array<{ name: string; revenue: number }>;
    growth: string;
    performance: string;
    invoiceCount: number;
    recentInvoices: Array<{
      id: string;
      customerName: string;
      totalAmount: number;
      status: string;
      date: string;
    }>;
  } | null>(null);

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
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        fetchStats(userData.token);
      } catch {
        // Handle error silently
      }
    }
  }, []);

  const { currency } = useInvoice();

  // Integrated Planning Data - Backend Sync
  const [todos, setTodos] = useState([]);

  const fetchTodos = async (token: string) => {
    try {
      const response = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Dashboard failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchTodos(user.token);
    }
  }, [user]);

  const { stats: productivityStats } = useProductivity(
    todos as Array<{ status: string; startTime: string; endTime: string }>,
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency || "XOF",
    }).format(value);

  if (!stats) {
    return null; // Let loading.tsx handle the skeleton
  }

  return (
    <div className="min-h-full bg-background text-foreground p-6 md:p-10 lg:p-12 relative pb-20">
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
              Consultez et gérez vos flux de facturation et votre productivité
              avec précision.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
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
            title="Productivité"
            value={`${productivityStats.percentage}%`}
            trend="Planning"
            trendUp={productivityStats.percentage >= 50}
            icon={TrendingUp}
            variant="emerald"
          />
          <StatsCard
            title="Factures Validées"
            value={String(stats?.invoiceCount || 0)}
            trend="Total"
            trendUp={true}
            icon={Package}
            variant="slate"
          />
          <StatsCard
            title="Tâches"
            value={String(productivityStats.total)}
            trend={`${productivityStats.completed} finies`}
            trendUp={productivityStats.completed > 0}
            icon={ListTodo}
            variant="blue"
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

        {/* Productivity Goals & Focus - Ported from Planning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-150">
          <Card className="lg:col-span-2 border border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden rounded-3xl">
            <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between bg-muted/20">
              <h3 className="font-bold text-lg flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <ListTodo className="size-5 text-primary" />
                </div>
                Objectifs de la période
              </h3>
              <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">
                Analyse en cours
              </span>
            </div>
            <CardContent className="p-8 grid md:grid-cols-2 gap-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold opacity-80 text-slate-300">
                    Objectif Quotidien
                  </p>
                  <span className="text-xs font-black text-primary">
                    {productivityStats.completed} / {productivityStats.total}{" "}
                    tâches
                  </span>
                </div>
                <Progress
                  value={productivityStats.percentage}
                  className="h-2.5 bg-slate-800"
                />
                <p className="text-[11px] text-muted-foreground italic tracking-tight leading-relaxed opacity-70">
                  &quot;
                  {productivityStats.percentage >= 100
                    ? "Félicitations ! Vous avez atteint votre objectif."
                    : "Continuez ainsi pour atteindre vos objectifs du jour."}
                  &quot;
                </p>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold opacity-80 text-slate-300">
                    Objectif Hebdomadaire
                  </p>
                  <span className="text-xs font-black text-secondary">
                    {productivityStats.productiveHours} / 20h actives
                  </span>
                </div>
                <Progress
                  value={(productivityStats.productiveHours / 20) * 100}
                  className="h-2.5 bg-slate-800"
                />
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-secondary animate-pulse" />
                  <p className="text-[11px] text-muted-foreground font-medium tracking-tight opacity-70">
                    Cible Dynamique : 35h / semaine
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-3xl rounded-3xl overflow-hidden group">
            <div className="px-8 py-6 border-b border-primary/10 bg-primary/10 italic text-sm font-black text-primary flex items-center gap-3">
              <TrendingUp className="size-5 animate-bounce" />
              Focus Stratégique
            </div>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-6 h-[180px]">
              {productivityStats.inProgress > 0 ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    Actuellement actif sur
                  </p>
                  <p className="text-2xl font-black text-primary leading-tight group-hover:scale-105 transition-transform duration-500">
                    {todos.find(
                      (t: { status: string; title: string }) =>
                        t.status === "in_progress",
                    )?.title || "Mise au point"}
                  </p>
                </>
              ) : (
                <div className="space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-bold text-slate-400">
                    Aucune tâche en cours
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Boostez votre score de productivité !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
