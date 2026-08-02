import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openbimi.com"),
  title: {
    default: "OpenBIMI — BIMI, made open",
    template: "%s · OpenBIMI",
  },
  description:
    "Free, open tools to set up, validate, and understand BIMI without an account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
