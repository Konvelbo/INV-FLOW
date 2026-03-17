import { AppSidebar } from "@/src/components/app-sidebare";
import Topbar from "@/src/components/Topbar";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";
import { PageTransition } from "@/src/components/PageTransition";

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 overflow-x-hidden bg-background">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
