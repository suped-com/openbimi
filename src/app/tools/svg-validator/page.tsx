import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { SvgValidator } from "@/components/svg-validator";

export const metadata: Metadata = {
  title: "Free BIMI SVG validator",
  description: "Validate SVG Tiny PS structure, security restrictions, size, accessibility, and mailbox compatibility locally in your browser.",
};

export default function SvgValidatorPage() {
  return (
    <main className="page-main">
      <section className="page-hero page-hero--tool">
        <div className="container tool-hero-grid"><div><p className="eyebrow"><span /> SVG Tiny PS validator</p><h1>Make your logo <em>inbox-safe.</em></h1><p>Check the restricted BIMI SVG profile, catch unsafe content, preview the crop, and fix safe metadata issues.</p></div><div className="local-badge"><LockKeyhole aria-hidden="true" /><div><strong>Your artwork stays local</strong><span>The file never leaves your browser.</span></div></div></div>
      </section>
      <section className="tool-page-section"><div className="container"><SvgValidator /></div></section>
    </main>
  );
}
