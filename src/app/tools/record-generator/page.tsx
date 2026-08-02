import type { Metadata } from "next";
import { RecordGenerator } from "@/components/record-generator";

export const metadata: Metadata = {
  title: "Free BIMI record generator",
  description: "Generate the exact BIMI TXT host and value for any DNS provider, with optional VMC or CMC evidence.",
};

export default async function RecordGeneratorPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  const { domain = "" } = await searchParams;
  return (
    <main className="page-main">
      <section className="page-hero page-hero--generator"><div className="container narrow-container"><p className="eyebrow"><span /> DNS record generator</p><h1>Build it once. <em>Publish it right.</em></h1><p>Enter the public file locations and get a standards-aligned BIMI TXT record ready for any DNS provider.</p></div></section>
      <section className="tool-page-section"><div className="container"><RecordGenerator initialDomain={domain} /></div></section>
    </main>
  );
}
