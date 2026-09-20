"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeLanguageProvider } from "@/context/ThemeLanguageContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeLanguageProvider>
        {children}
      </ThemeLanguageProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--border)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "var(--primary-foreground)",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "var(--destructive-foreground)",
            },
          },
        }}
      />
    </SessionProvider>
  );
}