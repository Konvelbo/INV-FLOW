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
    <div className="group relative p-6 rounded-2xl bg-card border border-border/50 overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-500 hover:bg-card/80">
      {/* Decorative Light Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-secondary/20 transition-colors duration-700" />

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3 rounded-xl bg-linear-to-br from-secondary to-indigo-700 text-white shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform duration-300">
          <Brain className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground font-sans tracking-tight">
          Analyses Business{" "}
          <span className="text-secondary italic font-semibold">IA</span>
        </h3>
      </div>

      <div className="space-y-4 relative z-10">
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
