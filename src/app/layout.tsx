import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import Footer from "./components/Footer";
import ThemeWrapper from "./components/ThemeWrapper";
import { siteMetadata, siteViewport } from "@/styles/metadata";
import { geistSans, geistMono } from "@/styles/fonts";

export const metadata: Metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} layout-body`}>
        <AuthProvider>
          <ThemeWrapper>
          <div className="layout-content">
            {children}
          </div>
          <Footer />
          </ThemeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
