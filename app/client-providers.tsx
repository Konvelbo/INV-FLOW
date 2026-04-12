"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { InvoiceProvider } from "@/src/context/InvoiceContext";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { NotificationProvider } from "@/src/context/NotificationContext";
import CanvasProvider from "@/src/context/canvasContext";
import { ThemeProvider } from "@/src/components/theme-provider";
import UpdateManager from "@/src/components/UpdateManager";
import AutomationWatcher from "@/src/components/AutomationWatcher";
import { cn } from "@/lib/utils";

const jakarta = { variable: "font-jakarta" };
const jetbrains = { variable: "font-jetbrains" };

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      <LanguageProvider>
        <NotificationProvider>
          <UpdateManager />
          <AutomationWatcher />
          <CanvasProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <InvoiceProvider>{children}</InvoiceProvider>
            </ThemeProvider>
          </CanvasProvider>
        </NotificationProvider>
      </LanguageProvider>
    </>
  );
}
