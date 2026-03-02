import { Brain, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  TaxAdviceDataset,
  type TaxAdvice,
} from "@/src/myComponents/economicTypes";
import { useNotifications } from "@/src/context/NotificationContext";
import { type TranslationKey } from "@/src/lib/translations";
import { Insight, type DashboardStats } from "./types";

export function AIInsightCard({ stats }: { stats?: DashboardStats }) {
  const { t, language } = useLanguage();
  const { addNotification } = useNotifications();
  const [rotatingAdvice, setRotatingAdvice] = useState<TaxAdvice[]>([]);
  const lastGrowthType = useRef<string | null>(null);

  const isFirstRun = useRef(true);

  // Rotation logic: Pick 7 random advice items every 20 minutes
  useEffect(() => {
    const getNewAdvice = () => {
      const allAdvice = TaxAdviceDataset.advice_list;
      const shuffled = [...allAdvice].sort(() => 0.5 - Math.random());
      setRotatingAdvice(shuffled.slice(0, 7));
    };

    getNewAdvice();
    const interval = setInterval(getNewAdvice, 20 * 60 * 1000); // 20 minutes

    return () => clearInterval(interval);
  }, []);

  // Notification logic for growth changes only (preventing refresh alerts)
  useEffect(() => {
    if (!stats) return;

    const currentGrowthType =
      Number(stats.growth) > 10
        ? "up"
        : Number(stats.growth) < 0
          ? "down"
          : null;

    if (currentGrowthType) {
      if (isFirstRun.current) {
        // Just initialize on first load without notifying
        lastGrowthType.current = currentGrowthType;
        isFirstRun.current = false;
        return;
      }

      if (currentGrowthType !== lastGrowthType.current) {
        const title =
          currentGrowthType === "up"
            ? t("exceptionalGrowth")
            : t("revenueVigilance");

        addNotification({
          user: t("aiAssistant"),
          action: t("generated"),
          target: title,
          type: "system",
        });
        lastGrowthType.current = currentGrowthType;
      }
    }
  }, [stats, t, addNotification]);

  const displayInsights = useMemo(() => {
    const dynamicInsights: Insight[] = [];

    if (stats) {
      if (Number(stats.growth) > 10) {
        dynamicInsights.push({
          id: "growth_up",
          type: "opportunity",
          title: t("exceptionalGrowth"),
          description: t("growth_insight_desc").replace(
            "{growth}",
            String(stats.growth),
          ),
        });
      } else if (Number(stats.growth) < 0) {
        dynamicInsights.push({
          id: "growth_down",
          type: "warning",
          title: t("revenueVigilance"),
          description: t("decline_insight_desc").replace(
            "{growth}",
            String(Math.abs(Number(stats.growth))),
          ),
        });
      }

      if (stats.invoiceCount > 5) {
        dynamicInsights.push({
          id: "volume",
          type: "tip",
          title: t("automationAdvice"),
          description: t("volume_insight_desc"),
        });
      }
    }

    // Convert rotatingAdvice to Insight format
    const adviceInsights: Insight[] = rotatingAdvice.map((advice) => ({
      id: `advice_${advice.id}`,
      type:
        advice.impact_level === "High"
          ? "opportunity"
          : advice.impact_level === "Medium"
            ? "tip"
            : "tip",
      title: advice.title[language as "fr" | "en"] || advice.title.fr,
      description:
        advice.description[language as "fr" | "en"] || advice.description.fr,
    }));

    // Combine: priority to dynamic, then fill with advice up to 4 total items
    const combined = [...dynamicInsights];
    adviceInsights.forEach((advice) => {
      if (combined.length < 4) {
        combined.push(advice);
      }
    });

    return combined.length > 0 ? combined : adviceInsights.slice(0, 7);
  }, [stats, rotatingAdvice, t, language]);

  return (
    <div className="group relative p-3 rounded-2xl bg-card border border-border/50 overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-500 hover:bg-card/80 h-full">
      {/* Decorative Light Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-secondary/20 transition-colors duration-700" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3 rounded-xl bg-linear-to-br from-secondary to-indigo-700 text-white shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform duration-300">
          <Brain className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground font-sans tracking-tight">
          {t("aiBusinessAnalysis").split("IA")[0]}
          <span className="text-secondary italic font-semibold">IA</span>
        </h3>
      </div>

      <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-none">
        {displayInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-5 rounded-2xl bg-slate-950/30 border border-white/5 hover:border-secondary/30 transition-all duration-300 group/item"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                {insight.type === "opportunity" && (
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                )}
                {insight.type === "warning" && (
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {insight.type === "tip" && (
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-slate-100 font-bold text-sm group-hover/item:text-secondary transition-colors font-sans">
                  {insight.title}
                </h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
