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
        "group relative p-5 rounded-2xl bg-slate-900/40 border backdrop-blur-md transition-all duration-500",
        v.border,
        v.bg,
        v.hover,
        v.glow,
        className,
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <div
          className={cn(
            "p-2.5 rounded-xl transition-colors duration-300",
            v.iconBg,
            v.iconColor,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={cn(
              "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tight rounded-full border",
              trendUp
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20",
            )}
          >
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          {title}
        </h3>
        <div className="text-xl font-black text-white tracking-tight">
          {value}
        </div>
      </div>

      {/* Subtle bottom gradient sweep */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-linear-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          v.iconColor,
        )}
      />
    </div>
  );
}
