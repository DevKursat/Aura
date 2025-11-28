import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers";
import { ServiceWorkerRegistration, InstallPrompt, OfflineIndicator } from "@/components/pwa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura - Mistik Yaşam Tarzı Asistanınız",
  description: "Kahve falı, tarot, astroloji, meditasyon ve daha fazlası. Geleceğinizi keşfedin.",
  keywords: ["fal", "tarot", "astroloji", "kahve falı", "meditasyon", "burç", "rüya yorumu"],
  authors: [{ name: "Aura Team" }],
  openGraph: {
    title: "Aura - Mistik Yaşam Tarzı Asistanınız",
    description: "Kahve falı, tarot, astroloji, meditasyon ve daha fazlası.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aura",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ServiceWorkerRegistration />
          <OfflineIndicator />
          {children}
          <InstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
