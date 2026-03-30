import { Suspense } from "react";
import { AppSidebar } from "@/src/components/app-sidebare";
import Topbar from "@/src/components/Topbar";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";
import { PageTransition } from "@/src/components/PageTransition";
import { SubscriptionProvider } from "@/src/context/SubscriptionContext";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen overflow-hidden">
            <Topbar />
            <main
              id="main-page"
              className="flex-1 overflow-y-auto overflow-x-hidden bg-background"
            >
              <Suspense>
                <PageTransition>{children}</PageTransition>
              </Suspense>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SubscriptionProvider>
  );
}

