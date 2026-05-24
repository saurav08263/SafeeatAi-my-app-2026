import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { CapacitorInit } from "@/components/CapacitorInit";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeEat AI - World's Smartest Food Safety App",
  description:
    "AI-powered food safety scanner. Check food combinations, detect allergens, track expiry dates, and get instant safety scores. Scan. Check. Eat Safe.",
  keywords: [
    "SafeEat",
    "AI",
    "food safety",
    "allergen detection",
    "ingredient scanner",
    "food combination",
    "expiry tracker",
    "food poisoning",
    "health app",
    "medical AI",
  ],
  authors: [{ name: "SafeEat AI" }],
  creator: "SafeEat AI",
  publisher: "SafeEat AI",
  applicationName: "SafeEat AI",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SafeEat AI",
    startupImage: [
      { url: "/logo.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/logo.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/logo.png", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/logo.png" },
    ],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: "SafeEat AI - World's Smartest Food Safety App",
    description:
      "AI-powered food safety scanner. Check combinations, detect allergens, track expiry. Scan. Check. Eat Safe.",
    type: "website",
    siteName: "SafeEat AI",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "SafeEat AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeEat AI - World's Smartest Food Safety App",
    description:
      "AI-powered food safety scanner. Scan. Check. Eat Safe.",
    images: ["/icons/icon-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://safeeat.ai"
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0fdf4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1f0e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* PWA: Android install support */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* PWA: iOS Safari full-screen support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SafeEat AI" />
        {/* iOS touch icon */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        {/* Prevent iOS from styling inputs/forms */}
        <meta name="format-detection" content="telephone=no" />
        {/* Allow PWA scope */}
        <meta name="theme-color" content="#0a1f0e" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground overflow-hidden fixed inset-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              borderRadius: '16px',
              fontSize: '14px',
              maxWidth: '90vw',
            },
          }}
        />
        <CapacitorInit />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
