import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendItem {
  label: string;
  value?: string | number;
  up?: boolean;
  color?: string; // Optional custom color class
}

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  trends?: TrendItem[]; // New prop for multiple trends
  icon: LucideIcon;
  variant?: "blue" | "indigo" | "emerald" | "amber" | "slate";
  className?: string;
  subtitle?: string;
}

const variants = {
  blue: {
    bg: "bg-blue-500/5",
    border: "border-blue-500/10",
    hover: "hover:border-blue-500/30",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  indigo: {
    bg: "bg-indigo-500/5",
    border: "border-indigo-500/10",
    hover: "hover:border-indigo-500/30",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
  emerald: {
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/10",
    hover: "hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  amber: {
    bg: "bg-amber-500/5",
    border: "border-amber-500/10",
    hover: "hover:border-amber-500/30",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  slate: {
    bg: "bg-slate-500/5",
    border: "border-slate-500/10",
    hover: "hover:border-slate-500/30",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-500",
  },
};

export function StatsCard({
  title,
  value,
  trend,
  trendUp,
  trends,
  icon: Icon,
  variant = "blue",
  className,
  subtitle,
}: StatsCardProps) {
  const v = variants[variant];

  return (
    <div
      className={cn(
        "group relative p-6 rounded-3xl bg-card border border-border/50 transition-all duration-300",
        "hover:shadow-2xl hover:shadow-black/5 hover:border-border",
        className,
      )}
    >
      <div className="w-full flex flex-row-reverse mb-5">
        <div
          className={cn(
            "p-3 rounded-2xl w-13 h-13 flex justify-center items-center transition-all duration-500 group-hover:rotate-6",
            v.bg,
            v.iconColor,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1.5">
          <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-foreground tracking-tighter">
              {value}
            </div>
            {subtitle && (
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-row-reverse gap-2 mt-2 mb-3">
          {trends ? (
            trends.map((t, i) => (
              <div
                key={i}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-colors",
                  t.color
                    ? t.color
                    : t.up
                      ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                      : "bg-red-500/5 text-red-500 border-red-500/10",
                )}
              >
                {t.label}{" "}
                {t.value !== undefined && <span className="opacity-50">|</span>}{" "}
                {t.value}
              </div>
            ))
          ) : trend ? (
            <div
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border",
                trendUp
                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                  : "bg-red-500/5 text-red-500 border-red-500/10",
              )}
            >
              {trend}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
