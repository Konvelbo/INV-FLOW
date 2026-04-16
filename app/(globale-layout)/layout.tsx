import { Suspense } from "react";
import { AppSidebar } from "@/src/components/app-sidebare";
import Topbar from "@/src/components/Topbar";
import { PageTransition } from "@/src/components/PageTransition";
import { SubscriptionProvider } from "@/src/context/SubscriptionContext";
import { InvoiceListener } from "@/src/components/InvoiceListener";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <InvoiceListener />
          <main
            id="main-page"
            className="flex-1 overflow-y-auto overflow-x-hidden bg-background"
          >
            <Suspense>
              <PageTransition>{children}</PageTransition>
            </Suspense>
          </main>
        </div>
      </div>
    </SubscriptionProvider>
  );
}

