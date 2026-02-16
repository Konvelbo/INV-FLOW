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

export function AIInsightCard() {
  return (
    <div className="p-6 rounded-2xl bg-linear-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
          <Brain className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          Analyses Business IA
        </h3>
      </div>

      <div className="space-y-4">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {insight.type === "opportunity" && (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                )}
                {insight.type === "warning" && (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                {insight.type === "tip" && (
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm mb-1">
                  {insight.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
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
