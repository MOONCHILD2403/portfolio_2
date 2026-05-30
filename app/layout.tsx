import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Cormorant_Garamond,
  IBM_Plex_Mono,
  Manrope, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Yashas Bajaj | Full-Stack Developer & Systems Engineer",
  description:
    "Portfolio for Yashas Bajaj showcasing full-stack engineering, systems design, and performance-focused product work.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var stored = window.localStorage.getItem("theme");
                var system = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
                document.documentElement.dataset.theme = stored || system;
              } catch (error) {
                document.documentElement.dataset.theme = "dark";
              }
            })();
          `}
        </Script>
      </head>
      <body
        className={`${headingFont.variable} ${monoFont.variable} ${bodyFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
