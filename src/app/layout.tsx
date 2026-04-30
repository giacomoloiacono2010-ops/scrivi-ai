import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ScriviAI - Generatore documenti professionali AI",
  description:
    "Genera email, preventivi, contratti e report professionali in italiano in 30 secondi. Usato da avvocati e commercialisti.",
  keywords:
    "generatore documenti, AI, italiano, avvocati, commercialisti, email professionali, preventivi, contratti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
        <SpeedInsights />
      </body>
    </html>
  );
}