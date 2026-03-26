"use client";

import {
  Brain,
  FileText,
  History,
  LayoutDashboard,
  ClipboardList,
  ChevronRight,
  Users,
  Package,
  Wallet,
  Settings,
  HelpCircle,
  MessageSquare,
  Send,
  Star,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import { useInvoiceActions } from "@/src/context/InvoiceContext";
import { useLanguage } from "@/src/context/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "react-hot-toast";
import { useIPCAction } from "@/hooks/useIPCAction";

import { handleActionRequest } from "@/electron/data-handlers";

export const AppSidebar = React.memo(function AppSidebar() {
  const { clearInvoiceData } = useInvoiceActions();
  const { dict, t } = useLanguage();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { performAction, loading: actionLoading } = useIPCAction();

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    try {
      // 1. Store in Backend
      const userStr = localStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      // const res = await fetch("/api/feedback", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...(token && { Authorization: `Bearer ${token}` }),
      //   },
      //   body: JSON.stringify({ content: feedback, rating }),
      const res = await performAction("feedback", "create", {
        content: feedback,
        rating,
        contactEmail: "",
      });

      if (res.success) {
        toast.success("Mérci pour votre retour !");
        setIsFeedbackOpen(false);
        setFeedback("");
        setRating(5);
      } else {
        toast.error("Erreur lors de l'envoi du feedback");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    {
      title: dict.dashboard,
      url: "/dashboard",
      icon: LayoutDashboard,
      id: "Dashboard",
      color: "text-blue-500",
    },
    {
      title: dict.invoice,
      url: "/invoice",
      icon: FileText,
      id: "Invoice",
      color: "text-emerald-500",
    },
    {
      title: dict.history,
      url: "/history",
      icon: History,
      id: "History",
      color: "text-amber-500",
    },
    {
      title: dict.clients,
      url: "/clients",
      icon: Users,
      id: "Clients",
      color: "text-orange-500",
    },
    {
      title: dict.productsServices,
      url: "/products",
      icon: Package,
      id: "Products",
      color: "text-indigo-500",
    },
    {
      title: dict.expenses,
      url: "/expenses",
      icon: Wallet,
      id: "Expenses",
      color: "text-red-500",
    },
    {
      title: dict.workPlanning,
      url: "/planning",
      icon: ClipboardList,
      id: "Planning",
      color: "text-rose-500",
    },
    {
      title: dict.aiAssistant,
      url: "/ai-advisor",
      icon: Brain,
      id: "Assistant IA",
      color: "text-violet-500",
    },
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-sidebar-border bg-sidebar sticky top-0 h-screen"
    >
      <SidebarContent className="p-4 space-y-8">
        {/*<div className="px-2 mb-6">
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
            className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
          >
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span className="text-white font-black text-sm">IF</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold tracking-tighter text-lg bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                INV-FLOW
              </span>
            )}
          </motion.div>
        </div>*/}

        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground/50">
              {t("mainMenu")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "relative h-12  transition-all duration-300 group overflow-hidden",
                        isActive ? "bg-primary/10" : "hover:bg-muted/50",
                      )}
                    >
                      <Link
                        id="sidebare-link"
                        onClick={() => {
                          if (item.id === "Invoice") {
                            clearInvoiceData();
                          }
                        }}
                        href={item.url}
                        className="flex items-center gap-4 w-full"
                      >
                        <div
                          className={cn(
                            "relative size-5 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center",
                            isActive ? item.color : "text-muted-foreground",
                          )}
                        >
                          <item.icon className="size-5" />
                          {isActive && (
                            <motion.div
                              layoutId="active-glow"
                              className="absolute -inset-2 bg-current opacity-20 blur-lg rounded-full"
                            />
                          )}
                        </div>

                        {!isCollapsed && (
                          <span
                            className={cn(
                              "font-bold text-sm tracking-tight transition-colors duration-300",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          >
                            {item.title}
                          </span>
                        )}

                        {isActive && !isCollapsed && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute right-0 w-1 h-full bg-primary rounded-full"
                          />
                        )}

                        {!isCollapsed && (
                          <ChevronRight className="ml-auto size-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground/50" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-2 py-4 space-y-4">
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
              <DialogTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all duration-300",
                    "bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 group",
                  )}
                >
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <HelpCircle className="size-4" />
                  </div>
                  {!isCollapsed && (
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      Besoin d&apos;aide ?
                    </span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card border-border/50 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="size-5 text-primary" />
                    Envoyer un retour
                  </DialogTitle>
                  <DialogDescription>
                    Votre avis nous aide à améliorer l&apos;application.
                    Décrivez votre problème ou suggestion ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6 text-foreground">
                  <div className="space-y-4 text-center">
                    <Label className="text-sm font-bold opacity-70">
                      Quelle note donneriez-vous à l&apos;application ?
                    </Label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transition-transform active:scale-95 hover:scale-110"
                        >
                          <Star
                            className={cn(
                              "size-8 transition-colors",
                              star <= rating
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground/30",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                      Votre message
                    </Label>
                    <Textarea
                      placeholder="Comment pouvons-nous nous améliorer ?"
                      className="min-h-[120px] bg-background border-border/50 shadow-inner rounded-xl resize-none focus:ring-primary/20"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic bg-primary/5 p-3 rounded-lg border border-primary/10">
                    Note : Votre retour sera directement enregistré et envoyé à
                    notre équipe.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsFeedbackOpen(false)}
                    className="rounded-xl"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSendFeedback}
                    className="rounded-xl bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20 min-w-[120px]"
                    disabled={!feedback.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    Envoyer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
              <div className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-mono tracking-widest uppercase">
                v1.0.4-obsidian
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
});
