import React, { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { FileText, Package, Users, Eye, ArrowRight, User, Search } from "lucide-react";
import { useInvoice } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useIPCData } from "@/hooks/useIPCData";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/src/components/ui/input";

interface CombinedDashboardTabsProps {
  stats: any;
}

export function CombinedDashboardTabs({ stats }: CombinedDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"invoices" | "products" | "clients">("invoices");
  const [searchQuery, setSearchQuery] = useState("");
  const { t, language } = useLanguage();
  const { currency } = useInvoice();
  const router = useRouter();

  const { data: clients, loading: loadingClients } = useIPCData<any[]>("clients");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: currency || "XOF",
    }).format(value);

  const tabs = [
    { id: "invoices", label: t("recentInvoices") || "Factures Récentes", icon: FileText },
    { id: "products", label: t("recentProducts") || "Produits Récents", icon: Package },
    { id: "clients", label: t("clients") || "Clients", icon: Users },
  ] as const;

  const renderInvoices = () => {
    const invoices = stats.recentInvoices || [];
    const filteredInvoices = invoices.filter((inv: any) =>
      inv.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredInvoices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <FileText className="w-12 h-12 mb-4 opacity-20" />
          <p>{t("noInvoicesFound") || "Aucune facture trouvée"}.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {filteredInvoices.map((invoice: any) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-transparent hover:border-border/30 hover:bg-muted/20 transition-all cursor-pointer group"
            onClick={() => router.push(`/invoice?id=${invoice.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted border border-border group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-sans truncate">
                  {invoice.reference || t("noRef")}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 truncate">
                  <User className="w-3 h-3 shrink-0" />
                  <span className="truncate">{invoice.clientName}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-4 max-w-[40%]">
              <div className="text-sm font-bold text-primary font-mono tracking-tight truncate w-full">
                {formatCurrency(invoice.totalHT)}
              </div>
              <div className="relative h-6 w-full flex justify-end">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] px-2 py-0 h-4 border-0 font-bold uppercase tracking-widest transition-opacity duration-300",
                    "group-hover:opacity-0 pointer-events-none absolute right-0 top-1",
                    invoice.isScaled
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}
                >
                  {invoice.isScaled ? (t("scaled_badge") || "PAYÉ") : (t("waiting_badge") || "EN ATTENTE")}
                </Badge>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute right-0 top-0 translate-y-1 group-hover:translate-y-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-md hover:bg-primary/20 text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/invoice?id=${invoice.id}`);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProducts = () => {
    const products = stats.recentProducts || [];
    const filteredProducts = products.filter((p: any) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredProducts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Package className="w-12 h-12 mb-4 opacity-20" />
          <p>{t("noRecord") || "Aucun enregistrement"}.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {filteredProducts.map((product: any) => (
          <div
            key={product.id}
            onClick={() => router.push("/products")}
            className="flex justify-between items-center group bg-muted/10 hover:bg-muted/20 p-4 rounded-xl border border-transparent hover:border-border/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted border border-border group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                <Package className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-foreground truncate max-w-[160px] group-hover:text-primary transition-colors">
                  {product.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {product.type === "service" ? t("service") : t("catalog")}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-sm font-bold font-mono text-primary">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderClients = () => {
    if (loadingClients) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      );
    }

    const safeClients = clients || [];
    const filteredClients = safeClients.filter((c: any) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredClients.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Users className="w-12 h-12 mb-4 opacity-20" />
          <p>{t("noRecord") || "Aucun client trouvé"}.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {filteredClients.map((client: any) => (
          <div
            key={client.id}
            onClick={() => router.push("/clients")}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-transparent hover:border-border/30 hover:bg-muted/20 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-background border border-border group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                <Users className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-sans truncate">
                  {client.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {client.email || t("noEmail")}
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-4 max-w-[40%]">
              <div className="text-sm font-bold text-foreground font-mono tracking-tight truncate w-full">
                {formatCurrency(client.totalSpent || 0)}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                {client.paidInvoicesCount || 0} {(t("paid") || "PAYÉ").toLowerCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border border-border/40 shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden rounded-2xl w-full">
      <div className="p-4 border-b border-border/40 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-1.5 rounded-lg w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder") || "Rechercher..."}
            className="pl-9 h-9 bg-background/50 border-border/40 focus:bg-background shadow-sm rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <CardContent className="p-0">
        <div className="h-[500px] overflow-y-auto px-6 py-4 custom-scrollbar">
          {activeTab === "invoices" && renderInvoices()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "clients" && renderClients()}
        </div>
      </CardContent>
    </Card>
  );
}
