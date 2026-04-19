"use client";

import { useState, useEffect } from "react";
import { useInvoice } from "@/src/context/InvoiceContext";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Search,
  Users,
  Package,
  Plus,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/src/context/LanguageContext";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  firstName?: string | null;
  companyName?: string | null;
  paidInvoicesCount?: number;
  unpaidInvoicesCount?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  taxRate: number;
  type: string;
}

export default function SmartAutofill() {
  const {
    setClientName,
    setClientAddress,
    setClientContact,
    setClientPOBox,
    itemsArr,
    setItemsArr,
    setClientId,
    setClientPaidCount,
    setClientUnpaidCount,
  } = useInvoice();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"clients" | "products">("clients");
  const [search, setSearch] = useState("");

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        const endpoint = activeTab === "clients" ? "clients" : "products";

        // Use Electron IPC bridge instead of fetch API to avoid 404 offline
        // @ts-ignore
        if (window.electronAPI) {
          const userStr = localStorage.getItem("user");
          if (!userStr) return;
          const user = JSON.parse(userStr);
          const userId = user.id;
          const companyId = user.activeCompanyId || undefined;
          // @ts-ignore
          const res = await window.electronAPI.getData(endpoint, userId, companyId);
          if (res.success) {
            if (activeTab === "clients") setClients(res.data);
            else setProducts(res.data);
          }
        } else {
          // Fallback to HTTP for purely web environments (if any)
          const url =
            activeTab === "clients" ? "/api/clients" : "/api/products";
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${user.token}` },
          });

          if (res.ok) {
            const data = await res.json();
            if (activeTab === "clients") setClients(data);
            else setProducts(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch autofill data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, activeTab]);

  const fillClient = (client: Client) => {
    const fullName = `${client.firstName ? client.firstName + " " : ""}${client.name}${client.companyName ? ` - ${client.companyName}` : ""}`;
    setClientName(fullName);
    setClientAddress(client.address || "");
    setClientContact(client.phone || client.email || "");
    setClientPOBox("");
    setClientId(client.id);
    setClientPaidCount(client.paidInvoicesCount || 0);
    setClientUnpaidCount(client.unpaidInvoicesCount || 0);
    setIsOpen(false);
  };

  const addProduct = (product: Product) => {
    const newItem = {
      id: uuidv4(),
      designation: product.name,
      unit:
        product.type === "service"
          ? t("servicePrestation")
          : t("unitPriceShort"),
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price * 1,
    };
    setItemsArr([...itemsArr, newItem]);
    setIsOpen(false);
  };

  const filteredClients = clients.filter((c) => {
    const searchString = search.toLowerCase();
    const fullName = `${c.firstName || ""} ${c.name || ""}`.toLowerCase();
    return (
      fullName.includes(searchString) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchString)) ||
      (c.email && c.email.toLowerCase().includes(searchString)) ||
      (c.phone && c.phone.toLowerCase().includes(searchString))
    );
  });
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-50 z-50 rounded-full size-12 shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-0 border-2 border-indigo-400/30 transition-all hover:scale-110"
        title={t("quickAssistant")}
      >
        <Sparkles className="w-6 h-6 text-amber-300" />
      </Button>
    );
  }

  return (
    <div className="fixed right-6 top-50 z-50 w-80 bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] animate-in slide-in-from-right-8 duration-300">
      <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t("quickAssistantShort")}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex border-b border-border/50 bg-muted/20">
        <button
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "clients" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
          onClick={() => {
            setActiveTab("clients");
            setSearch("");
          }}
        >
          <Users className="w-4 h-4" /> {t("clients")}
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "products" ? "border-indigo-600 text-indigo-600" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
          onClick={() => {
            setActiveTab("products");
            setSearch("");
          }}
        >
          <Package className="w-4 h-4" /> {t("catalog")}
        </button>
      </div>

      <div className="p-3 border-b border-border/50 bg-background/50">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder={t("searchQuickAssistant").replace(
              "{type}",
              activeTab === "clients" ? t("client") : t("article"),
            )}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background h-9 text-sm rounded-xl"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-muted/10">
        {loading ? (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : activeTab === "clients" ? (
          filteredClients.length > 0 ? (
            filteredClients.map((c) => (
              <button
                key={c.id}
                onClick={() => fillClient(c)}
                className="w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors group flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-sm text-foreground group-hover:text-indigo-900 break-words mb-0.5">{`${c.firstName ? c.firstName + " " : ""}${c.name}${c.companyName ? ` (${c.companyName})` : ""}`}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {c.email || c.phone || t("noContact")}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {t("noClientFound")}
            </div>
          )
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => addProduct(p)}
              className="w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors group flex items-center justify-between"
            >
              <div className="pr-2">
                <p className="font-bold text-sm text-foreground group-hover:text-indigo-900 line-clamp-1">
                  {p.name}
                </p>
                <p className="text-xs font-mono text-indigo-600 font-bold mt-0.5">
                  {p.price.toLocaleString()} XOF
                </p>
              </div>
              <div className="shrink-0 bg-indigo-100 text-indigo-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </button>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">
            {t("noItemFound")}
          </div>
        )}
      </div>
    </div>
  );
}
