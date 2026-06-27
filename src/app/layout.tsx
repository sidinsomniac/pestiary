import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SwRegistrar from "@/components/shell/SwRegistrar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pestiary — AI Pest Identification",
  description:
    "Pestiary identifies household pests from a plain-language description, explains the evidence, recommends a treatment with an estimated quote, and drafts a ready-to-send bilingual reply.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pestiary",
  },
  openGraph: {
    title: "Pestiary",
    description:
      "Describe a pest problem and let Pestiary identify it, explain why, and recommend a fix.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f9d57",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
        <SwRegistrar />
      </body>
    </html>
  );
}
