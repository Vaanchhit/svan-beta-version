import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MobileShell } from "@/components/layout/mobile-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SVAN",
  description: "A social fashion platform for discovering outfits and shopping the pieces.",
  applicationName: "SVAN",
  appleWebApp: {
    capable: true,
    title: "SVAN",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <MobileShell>{children}</MobileShell>
        </AuthProvider>
      </body>
    </html>
  );
}
