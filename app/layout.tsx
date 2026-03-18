import type { Metadata } from "next";
// Removed failing Google Font imports to unblock build
import "./globals.css";
import { cn } from "@/lib/utils";
import { InvoiceProvider } from "@/src/context/InvoiceContext";
import { LanguageProvider } from "@/src/context/LanguageContext";
import { Toaster } from "react-hot-toast";
import CanvasProvider from "@/src/context/canvasContext";
import { NotificationProvider } from "@/src/context/NotificationContext";
import { ThemeProvider } from "@/src/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import SessionSync from "@/src/components/SessionSync";

// Fallback variables for system fonts
const jakarta = { variable: "font-jakarta" };
const jetbrains = { variable: "font-jetbrains" };

export const metadata: Metadata = {
  title: "INV-FLOW | Invoice Management",
  description: "Modern invoice management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className="h-screen font-sans">
      <body
        className={cn(
          jakarta.variable,
          jetbrains.variable,
          "antialiased font-sans transition-colors duration-300",
          "w-full h-full bg-background text-foreground",
        )}
      >
        <Toaster />
        <LanguageProvider>
          <SessionProvider>
            <SessionSync />
            <NotificationProvider>
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
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
