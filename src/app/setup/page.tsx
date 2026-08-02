import type { Metadata } from "next";
import { SetupWizard } from "@/components/setup-wizard";

export const metadata: Metadata = {
  title: "Free guided BIMI setup wizard",
  description: "Diagnose DMARC, prepare a BIMI SVG, build the exact DNS record, and verify your setup without an account.",
};

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ domain?: string; selector?: string }> }) {
  const { domain = "", selector = "default" } = await searchParams;

  return (
    <main className="page-main setup-page">
      <section className="setup-hero">
        <div className="container narrow-container">
          <p className="eyebrow"><span /> Guided setup · No account</p>
          <h1>Set up BIMI, one clear step at a time.</h1>
          <p>Start with your sending domain. We’ll diagnose the public requirements, prepare your logo locally, generate the exact DNS record, and verify what you publish.</p>
        </div>
      </section>
      <section className="setup-section">
        <div className="container">
          <SetupWizard initialDomain={domain} initialSelector={selector} />
        </div>
      </section>
    </main>
  );
}
