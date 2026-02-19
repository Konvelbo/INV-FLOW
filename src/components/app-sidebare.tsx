"use client";

import {
  Brain,
  FileText,
  History,
  LayoutDashboard,
  Target,
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
} from "./ui/sidebar";
import Link from "next/link";
import { useInvoice } from "@/src/context/InvoiceContext";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Invoice",
    url: "/invoice",
    icon: FileText,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
  {
    title: "Assistant IA",
    url: "/ai-advisor",
    icon: Brain,
  },
];

export function AppSidebar() {
  const { clearInvoiceData } = useInvoice();
  return (
    <Sidebar>
      <SidebarContent>
        <Link href="#" />
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      onClick={() => {
                        if (item.title === "Invoice") {
                          clearInvoiceData();
                        }
                      }}
                      href={item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
