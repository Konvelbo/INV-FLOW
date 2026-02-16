"use client";

import { useEffect, useState } from "react";

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Mock data for the chart bars
  const data = [40, 70, 45, 90, 60, 80, 50, 95, 75, 85, 45, 100];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-white">Aperçu des Revenus</h3>
        <select className="bg-slate-950 border border-slate-800 text-slate-400 text-sm rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500 transition-colors">
          <option>Cette Année</option>
          <option>L'Année Dernière</option>
        </select>
      </div>

      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((height, index) => (
          <div
            key={index}
            className="w-full bg-blue-500/20 hover:bg-blue-500/40 rounded-t-lg transition-all duration-300 relative group"
            style={{ height: `${height}%` }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              ${height * 100}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
        {[
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Juin",
          "Juil",
          "Août",
          "Sep",
          "Oct",
          "Nov",
          "Déc",
        ].map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}
