import type { Metadata } from "next";
import { RecordGenerator } from "@/components/record-generator";

export const metadata: Metadata = {
  title: "Free BIMI DNS record builder",
  description: "Build the exact BIMI TXT host and value for any DNS provider, with optional VMC or CMC evidence.",
};

export default async function RecordToolPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  const { domain = "" } = await searchParams;
  return <main className="page-main"><section className="page-hero"><div className="container narrow-container"><p className="eyebrow"><span /> BIMI record builder</p><h1>Build the record. <em>Keep control.</em></h1><p>Generate the exact TXT host and value, then publish it yourself in any DNS provider.</p></div></section><section className="tool-page-section"><div className="container"><RecordGenerator initialDomain={domain} /></div></section></main>;
}
