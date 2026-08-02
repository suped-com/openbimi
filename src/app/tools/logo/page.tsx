import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { SvgValidator } from "@/components/svg-validator";

export const metadata: Metadata = {
  title: "Free BIMI logo converter and validator",
  description: "Convert PNG, JPEG, or WebP artwork locally, validate SVG Tiny PS, preview inbox masks, and download the prepared BIMI logo.",
};

export default function LogoToolPage() {
  return <main className="page-main"><section className="page-hero page-hero--tool"><div className="container tool-hero-grid"><div><p className="eyebrow"><span /> Logo converter + Tiny PS validator</p><h1>Turn brand artwork into an <em>inbox-safe SVG.</em></h1><p>Trace raster artwork locally, validate the restricted BIMI SVG profile, inspect mask previews, and approve the final result.</p></div><div className="local-badge"><LockKeyhole aria-hidden="true" /><div><strong>Your artwork stays local</strong><span>Files never leave your browser.</span></div></div></div></section><section className="tool-page-section"><div className="container"><SvgValidator /></div></section></main>;
}
