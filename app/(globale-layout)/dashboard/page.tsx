"use client";
import { StatsCard } from "@/src/components/dashboard/StatsCard";
import { AIInsightCard } from "@/src/components/dashboard/AIInsightCard";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  ListTodo,
  Users,
} from "lucide-react";
import LineChart2 from "@/src/components/line-chart-2";
import { RecentInvoices } from "@/src/components/dashboard/RecentInvoices";

import { InvoiceCalendar } from "@/src/components/dashboard/InvoiceCalendar";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useInvoiceState } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import {
  type User,
  type DashboardStats,
  type Todo,
} from "@/src/components/dashboard/types";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchStats = useCallback(async (token: string) => {
    try {
      const [resMetrics, resCharts] = await Promise.all([
        fetch(`/api/dashboard/metrics?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch(`/api/dashboard/charts?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
      ]);

      if (resMetrics.ok && resCharts.ok) {
        const dataMetrics = await resMetrics.json();
        const dataCharts = await resCharts.json();
        setStats({ ...dataMetrics, ...dataCharts });
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  }, []);

  const fetchTodos = useCallback(async (token: string) => {
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
  }, []);

  useEffect(() => {
    // Only fetch if we have a user token and stats are not yet loaded
    // This avoids immediate state updates on every render cycle which can trigger cascading render warnings
    if (user?.token && !stats) {
      const initDashboard = async () => {
        await Promise.all([fetchStats(user.token), fetchTodos(user.token)]);
      };
      initDashboard();
    }
  }, [user?.token, stats, fetchStats, fetchTodos]);

  const productivityStats = useMemo(() => {
    const total = todos.length;
    const completedTasks = todos.filter((t) => t.status === "done");
    const inProgress = todos.filter((t) => t.status === "in_progress").length;

    const productiveMs = completedTasks.reduce((acc: number, t) => {
      if (t.startTime && t.endTime) {
        return (
          acc +
          (new Date(t.endTime).getTime() - new Date(t.startTime).getTime())
        );
      }
      return acc;
    }, 0);

    const productiveHours =
      Math.round((productiveMs / (1000 * 60 * 60)) * 10) / 10;
    const percentage =
      total > 0 ? Math.round((completedTasks.length / total) * 100) : 0;

    return {
      total,
      completed: completedTasks.length,
      inProgress,
      percentage,
      productiveHours,
    };
  }, [todos]);

  const { currency } = useInvoiceState();
  const { t, language } = useLanguage();

  const formatCurrency = useCallback(
    (value: number) =>
      new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-US", {
        style: "currency",
        currency: currency || "XOF",
      }).format(value),
    [currency, language],
  );

  if (!stats) {
    return null; // Let loading.tsx handle the skeleton
  }

  const ProductNum = stats?.recentProducts.map((_, i: number) => {
    const ii = i + 1;
    return ii;
  });

  return (
    <div
      id="dashboard"
      className="h-full w-full bg-background text-foreground p-6 md:p-10 lg:p-12 pt-20 relative"
    >
      {/* Background Decorative Elements - Refined Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[60px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[60px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[70px]" />
      </div>

      <div className="max-w-8xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 bg-primary rounded-full" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                {t("financesHub")}
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent font-sans">
              {t("hello")}, {user?.name || t("guest")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-sans">
              {t("dashboardDescription")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-card border border-border/50 backdrop-blur-xl shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-foreground text-xs font-bold uppercase tracking-widest">
                {t("online")}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          <StatsCard
            title={t("monthlyRevenues")}
            value={(() => {
              const today = new Date();
              const lastDay = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0,
              ).getDate();
              const isEndOfMonth = today.getDate() >= lastDay - 1; // Last 2 days
              return isEndOfMonth
                ? formatCurrency(stats?.revenuesScaledThisMonth || 0)
                : "--";
            })()}
            trend={(() => {
              const current = stats?.revenuesScaledThisMonth || 0;
              const last = stats?.revenuesScaledLastMonth || 0;
              if (last === 0) return "+0.0%";
              const diff = current - last;
              const percent = (diff / last) * 100;
              return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
            })()}
            trendUp={(stats?.revenuesScaledThisMonth || 0) >= (stats?.revenuesScaledLastMonth || 0)}
            icon={DollarSign}
            variant="blue"
            href="/history"
          />
          <StatsCard
            title={t("monthlyExpenses")}
            value={formatCurrency(stats?.expensesThisMonth || 0)}
            trend={`${stats?.expensesCountThisMonth || 0} ${t("expenses")}`}
            trendUp={false}
            icon={Wallet}
            variant="amber"
            href="/expenses"
          />
          <StatsCard
            title={t("monthlyProfit")}
            value={formatCurrency(stats?.profitThisMonth || 0)}
            trend={
              stats?.profitThisMonth > 0
                ? t("positive_stat")
                : t("negative_stat")
            }
            trendUp={stats?.profitThisMonth > 0}
            icon={TrendingUp}
            variant="emerald"
          />
          <StatsCard
            title={t("scaledRevenue")}
            value={formatCurrency(stats?.revenuesScaledAllTime || 0)}
            trend={`${stats?.countScaledAllTime || 0} ${t("invoice")}`}
            trendUp={true}
            icon={TrendingUp}
            variant="emerald"
            href="/history"
          />
          <StatsCard
            title={t("unpaidInvoices")}
            value={formatCurrency(stats?.revenuesNonScaledAllTime || 0)}
            trend={`${stats?.countNonScaledAllTime || 0} ${t("invoice")}`}
            trendUp={false}
            icon={TrendingDown}
            variant="amber"
            href="/history"
          />
          <StatsCard
            title={t("activeClients")}
            value={String(stats?.activeClientsCount || 0)}
            trend={t("total_stat")}
            trendUp={true}
            icon={Users}
            variant="indigo"
            href="/clients"
          />
          <StatsCard
            title={t("tasks")}
            value={String(productivityStats.total)}
            trends={[
              {
                label: t("done_stat"),
                value: productivityStats.completed,
                up: true,
              },
              {
                label: t("todo_stat"),
                value: productivityStats.total - productivityStats.completed,
                up: false,
              },
            ]}
            icon={ListTodo}
            variant="slate"
            href="/planning"
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
                {t("periodGoals")}
              </h3>
              <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-black uppercase tracking-[0.2em]">
                {t("analysisInProgress")}
              </span>
            </div>
            <CardContent className="p-8 grid md:grid-cols-2 gap-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold opacity-80 text-slate-300">
                    {t("dailyGoal")}
                  </p>
                  <span className="text-xs font-black text-primary">
                    {productivityStats.completed} / {productivityStats.total}{" "}
                    {productivityStats.total > 1
                      ? t("tasks_plural")
                      : t("task")}
                  </span>
                </div>
                <Progress
                  value={productivityStats.percentage}
                  className="h-2.5 bg-muted/30"
                />
                <p className="text-[11px] text-muted-foreground italic tracking-tight leading-relaxed opacity-70">
                  &quot;
                  {productivityStats.percentage >= 100
                    ? t("congratsGoal")
                    : t("keepGoing")}
                  &quot;
                </p>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold opacity-80 text-slate-300">
                    {t("weeklyGoal")}
                  </p>
                  <span className="text-xs font-black text-secondary">
                    {productivityStats.productiveHours} / 20{t("activeHours")}
                  </span>
                </div>
                <Progress
                  value={(productivityStats.productiveHours / 20) * 100}
                  className="h-2.5 bg-muted/30"
                />
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-secondary animate-pulse" />
                  <p className="text-[11px] text-muted-foreground font-medium tracking-tight opacity-70">
                    {t("dynamicTarget")} : 35h {t("perWeek")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 shadow-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-3xl rounded-3xl overflow-hidden group">
            <div className="px-8 py-6 border-b border-primary/10 bg-primary/10 italic text-sm font-black text-primary flex items-center gap-3">
              <TrendingUp className="size-5 animate-bounce" />
              {t("focusStrategic")}
            </div>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-6 h-[180px]">
              {productivityStats.inProgress > 0 ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                    {t("activeOn")}
                  </p>
                  <p className="text-2xl font-black text-primary leading-tight group-hover:scale-105 transition-transform duration-500">
                    {todos.find(
                      (t: { status: string; title: string }) =>
                        t.status === "in_progress",
                    )?.title || t("validatedInvoices")}
                  </p>
                </>
              ) : (
                <div className="space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-bold text-slate-400">
                    {t("noActiveTask")}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("boostProductivity")}
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

          {/* Right Column - Recent Invoices & Unpaid & Products */}
          <div className="lg:flex flex-col space-y-8">
            <RecentInvoices invoices={stats?.recentInvoices || []} />

            {stats?.recentProducts && (
              <Card className="border border-border/40 shadow-2xl bg-card/60 backdrop-blur-xl shrink-0 overflow-hidden flex flex-col h-full rounded-2xl max-h-[600px]">
                <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-muted/10">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    {t("recentProducts")}
                  </h3>
                  <span className="text-[10px] font-black uppercase text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    {ProductNum ? <span>{ProductNum} </span> : <span>0</span>}
                    {"  "}
                    {t("total_stat")}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                  {stats.recentProducts.length > 0 ? (
                    stats.recentProducts.map((product: any) => (
                      <div
                        key={product.id}
                        className="flex justify-between items-center group bg-background/40 hover:bg-muted/10 p-3 rounded-lg border border-transparent hover:border-border/30 transition-all cursor-default"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-foreground truncate max-w-[160px] group-hover:text-primary transition-colors">
                            {product.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.type === "service"
                              ? t("service")
                              : t("catalog")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-bold font-mono text-foreground">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      {t("noRecord")}.
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
