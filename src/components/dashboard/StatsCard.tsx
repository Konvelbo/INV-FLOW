import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all duration-300 shadow-lg",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full border",
              trendUp
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20",
            )}
          >
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
