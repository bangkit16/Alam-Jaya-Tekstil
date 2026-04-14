import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Alam OPS",
  description: "Production System",
  manifest: "/manifest.json", // ✅ tambahan PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <head>
        {/* ✅ tambahan PWA */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#111827" />
      </head>

      <body className={`${inter.className} bg-[#f8fafc]`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
