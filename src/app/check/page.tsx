import type { Metadata } from "next";
import { DomainChecker } from "@/components/domain-checker";

export const metadata: Metadata = {
  title: "Free BIMI domain checker",
  description: "Check DMARC, BIMI DNS, SVG Tiny PS compatibility, and mark certificate availability for any domain.",
};

export default async function CheckPage({ searchParams }: { searchParams: Promise<{ domain?: string; selector?: string }> }) {
  const { domain = "", selector = "default" } = await searchParams;
  return (
    <main className="page-main">
      <section className="page-hero page-hero--checker">
        <div className="container narrow-container">
          <p className="eyebrow"><span /> Live public check</p>
          <h1>See what the inbox <em>can see.</em></h1>
          <p>Follow your public BIMI setup from enforced DMARC to the hosted logo and authority evidence. Nothing is stored.</p>
        </div>
      </section>
      <section className="checker-page-section">
        <div className="container"><DomainChecker initialDomain={domain} initialSelector={selector} /></div>
      </section>
    </main>
  );
}
