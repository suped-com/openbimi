import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://openbimi.com"),
  title: { default: "OpenBIMI — Free BIMI setup and validation", template: "%s · OpenBIMI" },
  description: "Check a domain, validate SVG Tiny PS logos, generate BIMI records, and learn the standard—free, open source, and without an account.",
  applicationName: "OpenBIMI",
  openGraph: {
    type: "website",
    siteName: "OpenBIMI",
    title: "OpenBIMI — Put your brand in the inbox",
    description: "Free, open tools to set up, validate, and understand BIMI.",
    url: "https://openbimi.com",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "OpenBIMI — Put your brand in the inbox" }],
  },
  twitter: { card: "summary_large_image", title: "OpenBIMI — Put your brand in the inbox", description: "Free, open tools to set up, validate, and understand BIMI.", images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#faf8f1", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${plexMono.variable}`}>
      <body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><div id="main-content">{children}</div><SiteFooter /></body>
    </html>
  );
}
