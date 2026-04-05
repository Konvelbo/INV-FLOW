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
  Lock,
  Crown,
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
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSubscription } from "@/src/context/SubscriptionContext";
import { usePricingRedirect } from "@/hooks/usePricingRedirect";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    id: "Dashboard",
    color: "text-blue-500",
  },
  {
    title: "Invoice",
    url: "/invoice",
    icon: FileText,
    id: "Invoice",
    color: "text-emerald-500",
  },
  {
    title: "History",
    url: "/history",
    icon: History,
    id: "History",
    color: "text-amber-500",
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
    id: "Clients",
    color: "text-orange-500",
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    id: "Products",
    color: "text-indigo-500",
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: Wallet,
    id: "Expenses",
    color: "text-red-500",
  },
  {
    title: "Planning",
    url: "/planning",
    icon: ClipboardList,
    id: "Planning",
    color: "text-rose-500",
  },
  {
    title: "Assistant IA",
    url: "/ai-advisor",
    icon: Brain,
    id: "Assistant IA",
    color: "text-violet-500",
  },
];

export const AppSidebar = React.memo(function AppSidebar() {
  const { clearInvoiceData } = useInvoiceActions();
  const { dict, t } = useLanguage();
  const { redirectToPricing, checkAIAccess } = usePricingRedirect();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [appVersion, setAppVersion] = useState("v1.0.4");
  const { subscription } = useSubscription();

  useEffect(() => {
    if (window.electronAPI?.getVersion) {
      window.electronAPI
        .getVersion()
        .then((v: string) => setAppVersion(`v${v}`));
    }
  }, []);

  // Update menu item titles with current dictionary
  const localizedMenuItems = menuItems.map(item => ({
    ...item,
    title: (dict as any)[item.id.toLowerCase().replace(" ", "")] || item.title
  }));

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-sidebar-border bg-sidebar sticky top-0 h-screen"
    >
      <SidebarContent className="p-4 space-y-8">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground/50">
              {t("mainMenu")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {localizedMenuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "relative h-12 transition-all duration-300 group overflow-hidden",
                        isActive ? "bg-primary/10" : "hover:bg-muted/50",
                      )}
                    >
                      <Link
                        id="sidebare-link"
                        onClick={(e) => {
                          if (item.id === "Assistant IA") {
                            // e.preventDefault();
                            if (!subscription?.hasAIAccess) {
                              redirectToPricing({
                                message:
                                  dict?.aiAccessDenied ||
                                  "L'Assistant IA est réservé aux abonnés Premium.",
                              });
                              return;
                            }
                          }
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

                        {/* Lock icon for AI Assistant on free plan */}
                        {item.id === "Assistant IA" &&
                          !subscription?.hasAIAccess &&
                          !isCollapsed && (
                            <Lock className="size-3 ml-auto text-muted-foreground/50 flex-shrink-0" />
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

        {/* Bottom: version only */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-2 py-4">
            {/* Daily invoice counter — free plan only */}
            {!subscription?.hasUnlimitedInvoices &&
              subscription &&
              !isCollapsed && (
                <div className="mb-4 px-3 py-2 rounded-xl bg-muted/40 border border-border/30">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-muted-foreground font-bold">
                      {dict.invoicesToday || "Factures aujourd'hui"}
                    </span>
                    <span className="text-[10px] font-black text-foreground">
                      {subscription.dailyInvoiceCount}/
                      {subscription.dailyInvoiceLimit}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        subscription.dailyInvoiceCount /
                          (subscription.dailyInvoiceLimit || 6) >=
                          1
                          ? "bg-destructive"
                          : subscription.dailyInvoiceCount /
                            (subscription.dailyInvoiceLimit || 6) >=
                            0.7
                            ? "bg-yellow-500"
                            : "bg-primary",
                      )}
                      style={{
                        width: `${Math.min(100, (subscription.dailyInvoiceCount / (subscription.dailyInvoiceLimit || 6)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

            <div className="flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
              <div className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-mono tracking-widest uppercase">
                {appVersion}-obsidian
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
});
