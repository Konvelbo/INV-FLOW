import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientProviders } from "./client-providers";

export const metadata: Metadata = {
  title: "Essor | Invoice Management",
  description: "Next-generation invoice management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className="h-screen font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Capriola&family=Literata:ital,opsz,wght@0,7..72,300..700;1,7..72,300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "antialiased font-sans transition-colors duration-300",
          "w-full h-full bg-background text-foreground",
        )}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

