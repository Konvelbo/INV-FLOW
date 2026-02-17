import { Brain, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

interface Insight {
  id: string;
  type: "opportunity" | "warning" | "tip";
  title: string;
  description: string;
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Opportunité de Revenu",
    description:
      "Basé sur les données de l'an dernier, le mois prochain voit habituellement une hausse de 20% des services. Envisagez une promotion.",
  },
  {
    id: "2",
    type: "warning",
    title: "Alerte Dépenses",
    description:
      "Les coûts des services publics sont 15% plus élevés que la moyenne ce trimestre. Vérifiez les anomalies.",
  },
  {
    id: "3",
    type: "tip",
    title: "Optimisation Fiscale",
    description:
      "Vous avez 2 000 € de dépenses potentiellement déductibles qui n'ont pas encore été catégorisées.",
  },
];

export function AIInsightCard({ stats }: { stats?: any }) {
  const dynamicInsights: Insight[] = [];

  if (stats) {
    if (Number(stats.growth) > 10) {
      dynamicInsights.push({
        id: "growth",
        type: "opportunity",
        title: "Croissance Exceptionnelle",
        description: `Performance en hausse de ${stats.growth}% ce mois-ci. Votre stratégie porte ses fruits !`,
      });
    } else if (Number(stats.growth) < 0) {
      dynamicInsights.push({
        id: "decline",
        type: "warning",
        title: "Vigilance Revenus",
        description: `Baisse de ${Math.abs(Number(stats.growth))}% détectée. Une analyse des factures impayées est conseillée.`,
      });
    }

    if (stats.invoiceCount > 5) {
      dynamicInsights.push({
        id: "volume",
        type: "tip",
        title: "Conseil Automatisation",
        description:
          "Le volume de facturation augmente. Pensez à vérifier l'état des relances.",
      });
    }
  }

  const displayInsights =
    dynamicInsights.length > 0 ? dynamicInsights : mockInsights;

  return (
    <div className="group relative p-6 rounded-2xl bg-slate-900/40 border border-indigo-500/20 overflow-hidden backdrop-blur-md">
      {/* Decorative Light Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-700" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_-5px_rgba(99,102,241,0.5)]">
          <Brain className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">
          Analyses Business{" "}
          <span className="text-indigo-400 italic font-medium">IA</span>
        </h3>
      </div>

      <div className="space-y-4 relative z-10">
        {displayInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group/item"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                {insight.type === "opportunity" && (
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                )}
                {insight.type === "warning" && (
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {insight.type === "tip" && (
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm mb-1 group-hover/item:text-indigo-300 transition-colors">
                  {insight.title}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
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
