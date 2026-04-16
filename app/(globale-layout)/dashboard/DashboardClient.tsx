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
import { CombinedDashboardTabs } from "@/src/components/dashboard/CombinedDashboardTabs";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useInvoiceState } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import {
  type DashboardStats,
  type Todo,
} from "@/src/components/dashboard/types";
import Link from "next/link";

interface DashboardClientProps {
  initialStats: DashboardStats;
  initialTodos: Todo[];
  userName: string;
}

export default function DashboardClient({
  initialStats,
  initialTodos,
  userName,
}: DashboardClientProps) {
  const stats = initialStats || {
    recentProducts: [],
    chartData: [],
    recentInvoices: [],
  } as any;
  const todos = initialTodos || [];

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

  const productivityStats = useMemo(() => {
    const safeTodos = todos || [];
    const total = safeTodos.length;
    const completedTasks = safeTodos.filter((t) => t.status === "done");
    const inProgress = safeTodos.filter((t) => t.status === "in_progress").length;

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

  return (
    <div
      id="dashboard"
      className="h-full w-full bg-background text-foreground p-6 md:p-10 lg:p-12 pt-20 relative"
    >
      {/* Background Decorative Elements */}
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
              {t("hello")}, {userName || t("guest")}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          <StatsCard
            title={t("monthlyRevenues")}
            value={(() => {
              const today = new Date();
              const lastDay = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0,
              ).getDate();
              const isEndOfMonth = today.getDate() >= lastDay - 1;
              return isEndOfMonth
                ? formatCurrency(stats.revenuesScaledThisMonth || 0)
                : "--";
            })()}
            trend={(() => {
              const current = stats.revenuesScaledThisMonth || 0;
              const last = stats.revenuesScaledLastMonth || 0;
              if (last === 0) return "+0.0%";
              const diff = current - last;
              const percent = (diff / last) * 100;
              return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
            })()}
            trendUp={(stats.revenuesScaledThisMonth || 0) >= (stats.revenuesScaledLastMonth || 0)}
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
            trend={stats?.profitThisMonth > 0 ? t("positive_stat") : t("negative_stat")}
            trendUp={stats?.profitThisMonth > 0}
            icon={TrendingUp}
            variant="emerald"
          />
          <StatsCard
            title={t("scaledRevenue")}
            value={formatCurrency(stats?.revenuesNonScaledAllTime || 0)}
            trend={`${stats?.countNonScaledAllTime || 0} ${t("invoice")}`}
            trendUp={false}
            icon={TrendingUp}
            variant="rose"
            href="/history"
          />
          <StatsCard
            title={t("activeClients")}
            value={String(stats.activeClientsCount || 0)}
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
              { label: t("done_stat"), value: productivityStats.completed, up: true },
              { label: t("todo_stat"), value: productivityStats.total - productivityStats.completed, up: false },
            ]}
            icon={ListTodo}
            variant="slate"
            href="/planning"
          />
        </div>

        {/* Productivity Goals */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in-up delay-150">
          <Card className="xl:col-span-2 border border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden rounded-3xl">
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
                  <p className="text-sm font-bold opacity-80 text-slate-300">{t("dailyGoal")}</p>
                  <span className="text-xs font-black text-primary">
                    {productivityStats.completed} / {productivityStats.total}{" "}
                    {productivityStats.total > 1 ? t("tasks_plural") : t("task")}
                  </span>
                </div>
                <Progress value={productivityStats.percentage} className="h-2.5 bg-muted/30" />
                <p className="text-[11px] text-muted-foreground italic tracking-tight leading-relaxed opacity-70">
                  &quot;{productivityStats.percentage >= 100 ? t("congratsGoal") : t("keepGoing")}&quot;
                </p>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold opacity-80 text-slate-300">{t("weeklyGoal")}</p>
                  <span className="text-xs font-black text-secondary">
                    {productivityStats.productiveHours} / 20{t("activeHours")}
                  </span>
                </div>
                <Progress value={(productivityStats.productiveHours / 20) * 100} className="h-2.5 bg-muted/30" />
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
                    {todos.find((t) => t.status === "in_progress")?.title || t("validatedInvoices")}
                  </p>
                </>
              ) : (
                <div className="space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-bold text-slate-400">{t("noActiveTask")}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("boostProductivity")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-8 animate-fade-in-up delay-200 pb-10 w-full">
          {/* Performance Chart - Full Width */}
          <div className="w-full">
            <LineChart2 externalData={stats.chartData} />
            
            {/* Hidden AI Logic */}
            <div className="hidden">
              <AIInsightCard stats={stats} />
            </div>
          </div>

          <div className="w-full">
            <CombinedDashboardTabs stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
