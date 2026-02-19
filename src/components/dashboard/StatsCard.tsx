import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  variant?: "blue" | "indigo" | "emerald" | "amber" | "slate";
  className?: string;
}

const variants = {
  blue: {
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    hover: "hover:border-blue-500/40",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    glow: "group-hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]",
  },
  indigo: {
    bg: "bg-indigo-500/5",
    border: "border-indigo-500/20",
    hover: "hover:border-indigo-500/40",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    glow: "group-hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]",
  },
  emerald: {
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    hover: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    glow: "group-hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]",
  },
  amber: {
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    hover: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    glow: "group-hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]",
  },
  slate: {
    bg: "bg-slate-500/5",
    border: "border-slate-500/20",
    hover: "hover:border-slate-500/40",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
    glow: "group-hover:shadow-[0_0_30px_-10px_rgba(100,116,139,0.3)]",
  },
};

export function StatsCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  variant = "blue",
  className,
}: StatsCardProps) {
  const v = variants[variant];

  return (
    <div
      className={cn(
        "xl:min-w-85 group relative p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-xl transition-all duration-500",
        v.hover,
        v.glow,
        "hover:-translate-y-1 hover:bg-card/80",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className={cn(
            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            v.iconBg,
            v.iconColor,
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={cn(
              "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border backdrop-blur-sm",
              trendUp
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20",
            )}
          >
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.2em]">
          {title}
        </h3>
        <div className="text-2xl font-bold text-foreground tracking-tight font-mono">
          {value}
        </div>
      </div>

      {/* Subtle bottom gradient sweep */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full mx-6",
          v.iconColor,
        )}
      />
    </div>
  );
}
