import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/common/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fenixfit.es";
const OG_IMAGE = `${SITE_URL}/logo.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fenix Fit | Premium Activewear",
    template: "%s | Fenix Fit",
  },
  description:
    "Ropa deportiva premium diseñada para la atleta estética. Eleva tu rendimiento y tu estilo con Fenix Fit.",
  keywords: [
    "ropa deportiva", "activewear", "gym outfit", "leggings", "set deportivo",
    "ropa fitness", "fenix fit", "conjunto gym", "sportswear premium",
  ],
  authors: [{ name: "Fenix Fit" }],
  creator: "Fenix Fit",
  publisher: "Fenix Fit",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Fenix Fit",
    title: "Fenix Fit | Premium Activewear",
    description:
      "Ropa deportiva premium diseñada para la atleta estética. Eleva tu rendimiento y estilo con Fenix Fit.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Fenix Fit — Premium Activewear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fenix Fit | Premium Activewear",
    description: "Ropa deportiva premium para la atleta estética.",
    images: [OG_IMAGE],
    creator: "@fenixfit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
      </head>
      <body className={`${inter.variable} antialiased selection:bg-primary selection:text-white flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <CookieBanner />
      </body>
    </html>
  );
}
