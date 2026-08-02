import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { HeaderInspector } from "@/components/header-inspector";

export const metadata: Metadata = {
  title: "Local email authentication header inspector",
  description: "Inspect observed SPF, DKIM, and DMARC results and alignment from a received email header without uploading the message.",
};

export default function HeaderInspectorPage() {
  return <main className="page-main"><section className="page-hero page-hero--tool"><div className="container tool-hero-grid"><div><p className="eyebrow"><span /> Observed authentication</p><h1>See what one real message <em>actually passed.</em></h1><p>Public DNS shows policy. A received Authentication-Results header shows what the mailbox observed for a particular message.</p></div><div className="local-badge"><LockKeyhole aria-hidden="true" /><div><strong>Headers stay local</strong><span>Parsing happens only in your browser.</span></div></div></div></section><section className="tool-page-section"><div className="container"><HeaderInspector /></div></section></main>;
}
