"use client";

import {
  Brain,
  FileText,
  History,
  LayoutDashboard,
  ClipboardList,
  ChevronRight,
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
import React from "react";

export const AppSidebar = React.memo(function AppSidebar() {
  const { clearInvoiceData } = useInvoiceActions();
  const { dict } = useLanguage();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
      collapsible="icon"
      className="border-r border-border/40 bg-card/30 backdrop-blur-xl"
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
              Menu Principal
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
      </SidebarContent>
    </Sidebar>
  );
});
