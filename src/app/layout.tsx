import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Space_Mono } from "next/font/google";
import MountainAirCanvas from "@/components/MountainAirCanvas";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.restauraciontecnoambiental.com"),
  title: {
    default: "Trazabilidad Ecológica Blockchain | Proyecto SGR-SC-001-2025",
    template: "%s | Trazabilidad Ecológica SGR-SC-001-2025",
  },
  description:
    "Plataforma oficial de notarización digital e integridad ambiental on-chain para la restauración ecológica de la cuenca Quebrada Chupaderos, Villamaría, Caldas. 10.900 árboles e inmutabilidad en Avalanche Mainnet.",
  keywords: [
    "Restauración Ecológica",
    "Blockchain",
    "Avalanche Mainnet",
    "Trazabilidad Ambiental",
    "Villamaría Caldas",
    "SGR-SC-001-2025",
    "Más Progreso ESP",
    "Aquamaná",
    "GM Holding",
    "Notarización Digital",
    "SHA-256",
    "IPFS",
  ],
  authors: [{ name: "GM Holding & Más Progreso E.S.P." }],
  creator: "GM Holding",
  publisher: "Alcaldía de Villamaría & Más Progreso E.S.P.",
  icons: {
    icon: [
      { url: "/isotype.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/isotype.png",
    apple: "/isotype.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.restauraciontecnoambiental.com",
    title: "🌿 Trazabilidad Ecológica Blockchain | Proyecto SGR-SC-001-2025",
    description:
      "Trazabilidad ambiental inmutable en la red Avalanche Mainnet. Auditoría de 10.900 árboles y 8 lotes en Villamaría, Caldas. Notarización SHA-256 e IPFS.",
    siteName: "Trazabilidad Ecológica Villamaría Blockchain",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Trazabilidad Ecológica Blockchain - SGR-SC-001-2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🌿 Trazabilidad Ecológica Blockchain | Proyecto SGR-SC-001-2025",
    description:
      "Plataforma oficial de integridad ambiental en Avalanche Mainnet. Auditoría on-chain de 10.900 árboles en Villamaría, Caldas.",
    images: ["/og-banner.png"],
    creator: "@gmholding",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${outfit.variable} ${spaceMono.variable} h-full antialiased scroll-smooth overflow-x-hidden w-full max-w-full`}
    >
      <body className="min-h-full flex flex-col relative bg-[#060a15] text-[#eef2f9] overflow-x-hidden w-full max-w-full">
        <MountainAirCanvas />
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-full overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
