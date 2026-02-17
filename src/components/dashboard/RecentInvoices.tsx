"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { FileText, User, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

interface RecentInvoice {
  id: string;
  reference: string;
  clientName: string;
  totalHT: number;
  isScaled: boolean;
  createdAt: string;
}

export function RecentInvoices({ invoices }: { invoices: RecentInvoice[] }) {
  const router = useRouter();

  if (!invoices || invoices.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Factures Récentes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-slate-500">
          <FileText className="w-12 h-12 mb-4 opacity-20" />
          <p>Aucune facture trouvée.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-100 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Factures Récentes
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          onClick={() => router.push("/history")}
        >
          Voir tout
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
            onClick={() => router.push(`/invoice?id=${invoice.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                  {invoice.reference || "Sans Référence"}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {invoice.clientName}
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <div className="text-sm font-bold text-emerald-400">
                {invoice.totalHT.toLocaleString()} FCFA
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-slate-600 font-mono">
                  {new Date(invoice.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
                <Badge
                  variant="outline"
                  className={`text-[9px] px-1.5 py-0 h-4 border-0 ${
                    invoice.isScaled
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {invoice.isScaled ? "Scalé" : "En attente"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
