"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Percent,
  DollarSign,
  Download,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  taxRate: number;
  type: "service" | "product";
}

export default function ProductsPage({
  isComponent,
}: { isComponent?: boolean } = {}) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    taxRate: "0",
    type: "service",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/products/${editingId}` : "/api/products";

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        taxRate: parseFloat(formData.taxRate),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? t("itemUpdated") : t("itemAdded"));
        setIsDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error(t("saveError"));
      }
    } catch (error) {
      console.error("Error saving product", error);
      toast.error(t("unexpectedError"));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("itemDeleteWarning").replace("{name}", name)))
      return;
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        toast.success(t("itemDeleted"));
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      taxRate: product.taxRate.toString(),
      type: product.type,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      taxRate: "0",
      type: "service",
    });
  };

  const handleExport = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const response = await fetch("/api/export/products", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "catalogue_export.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export error", err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div
      className={
        isComponent
          ? "w-full"
          : "min-h-full min-w-full bg-background text-foreground p-5 md:p-10 lg:p-16 pt-28 md:pt-28 lg:pt-28 relative pb-20"
      }
    >
      <div
        className={
          isComponent
            ? "space-y-6 w-full"
            : "max-w-7xl mx-auto space-y-10 relative z-10 w-full"
        }
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
          {!isComponent && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-10 bg-indigo-500 rounded-full" />
                <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">
                  {t("catalog")}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent font-sans">
                {t("productsServices")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl font-sans">
                {t("catalogDesc")}
              </p>
            </div>
          )}
          {isComponent && <div />}

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="gap-2 font-bold"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              {t("exportCsv")}
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="font-bold gap-2">
                  <Plus className="w-4 h-4" />
                  {t("newItem")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card border border-border/50 text-foreground backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? t("editItem") : t("newItem")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("catalogAddDesc")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">{t("type")}</Label>
                      <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as "service" | "product",
                          })
                        }
                      >
                        <option value="service">{t("servicePrestation")}</option>
                        <option value="product">{t("productMaterial")}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("itemNameLabel")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        {t("optionalDescription")}
                      </Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="bg-background"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">{t("unitPriceHt")} *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            required
                            className="bg-background pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxRate">{t("taxRateLabel")}</Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="taxRate"
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={formData.taxRate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                taxRate: e.target.value,
                              })
                            }
                            className="bg-background pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full font-bold">
                      {editingId
                        ? t("saveChanges")
                        : t("addToCatalog")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-4 animate-fade-in-up delay-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("searchCatalog")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up delay-200">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-card/50 border-border/50">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group relative bg-card/60 backdrop-blur-xl border border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 rounded-3xl overflow-hidden flex flex-col h-full animate-fade-in-up"
              >
                {/* Visual Accent */}
                <div className={cn(
                  "absolute top-0 left-0 w-full h-1.5 transition-opacity duration-500",
                  product.type === "service" ? "bg-linear-to-r from-blue-500 to-indigo-500" : "bg-linear-to-r from-purple-500 to-pink-500"
                )} />
                <CardHeader className="p-7 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "p-3 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                      product.type === "service"
                        ? "bg-blue-500/10 text-blue-500 shadow-blue-500/5 border border-blue-500/10"
                        : "bg-purple-500/10 text-purple-500 shadow-purple-500/5 border border-purple-500/10"
                    )}>
                      {product.type === "service" ? <Zap className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>

                    <div className="flex gap-2">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        product.type === "service"
                          ? "bg-blue-500/5 text-blue-500 border-blue-500/10"
                          : "bg-purple-500/5 text-purple-500 border-purple-500/10",
                      )}>
                        {product.type === "service" ? t("service") : t("catalog")}
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-1 mt-[-4px]">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                          onClick={() => openEdit(product)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </CardTitle>
                    {product.description && (
                      <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem] leading-relaxed font-medium opacity-70">
                        {product.description}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-7 pt-0 mt-auto">
                  <div className="relative p-5 rounded-2xl bg-muted/20 border border-border/40 overflow-hidden group/price">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full -mr-12 -mt-12 transition-all duration-500 group-hover/price:bg-primary/10" />

                    <div className="flex items-end justify-between relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block">
                          {t("unitPriceShort")}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-foreground tracking-tighter">
                            {product.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-black text-primary uppercase">
                            CFA
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">
                          {t("tax")}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-background/50 border border-border/50 text-[10px] font-bold text-foreground">
                          {product.taxRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">{t("noCatalogItem")}</p>
              <Button
                variant="link"
                onClick={() => setIsDialogOpen(true)}
                className="mt-2 text-primary gap-1"
              >
                <Plus className="w-4 h-4" /> {t("addFirstItem")}
              </Button>
            </div>
          )
          }
        </div >
      </div >
    </div >
  );
}
