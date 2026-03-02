"use client";
import React from "react";
import { FloatingNav } from "./ui/floating-navbar";
import {
  IconBrain,
  IconClipboard,
  IconFileText,
  IconHistory,
  IconHome,
  IconLayoutDashboard,
  IconMessage,
  IconUser,
} from "@tabler/icons-react";
import { useInvoiceActions } from "../context/InvoiceContext";
import { useLanguage } from "../context/LanguageContext";
export function FloatingNavDemo() {
  const { clearInvoiceData } = useInvoiceActions();
  const { dict } = useLanguage();

  const navItems = [
    {
      title: dict.dashboard,
      url: "/dashboard",
      icon: (
        <IconLayoutDashboard className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
      id: "Dashboard",
    },
    {
      title: dict.invoice,
      url: "/invoice",
      icon: (
        <IconFileText className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
      id: "Invoice",
    },
    {
      title: dict.history,
      url: "/history",
      icon: (
        <IconHistory className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
      id: "History",
    },
    {
      title: dict.workPlanning,
      url: "/planning",
      icon: (
        <IconClipboard className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
      id: "Planning",
    },
    {
      title: dict.aiAssistant,
      url: "/ai-advisor",
      icon: <IconBrain className="h-4 w-4 text-neutral-500 dark:text-white" />,
      id: "Assistant IA",
    },
  ];

  return (
    <div className="relative w-full ">
      <FloatingNav navItems={navItems} clearInvoiceData={clearInvoiceData} />
    </div>
  );
}
