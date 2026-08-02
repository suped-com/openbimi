import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { guides } from "@/content/guides";

export const metadata: Metadata = {
  title: "BIMI setup guides",
  description: "Independent, source-linked guides to DMARC enforcement, BIMI SVG logos, DNS records, VMCs, and CMCs.",
};

export default function GuidesPage() {
  return (
    <main className="page-main">
      <section className="page-hero page-hero--guides">
        <div className="container narrow-container">
          <p className="eyebrow"><span /> Open knowledge base</p>
          <h1>Learn the standard.<br /><em>Keep the knowledge.</em></h1>
          <p>Practical BIMI guidance built from primary specifications and official provider documentation—not a sales funnel.</p>
        </div>
      </section>
      <section className="guides-section section-pad">
        <div className="container guide-card-grid">
          {guides.map((guide, index) => (
            <Link className={`guide-card guide-card--${index + 1}`} href={`/guides/${guide.slug}`} key={guide.slug}>
              <div className="guide-card-meta"><span>{guide.eyebrow}</span><span><Clock size={13} aria-hidden="true" /> {guide.readTime}</span></div>
              <div className="guide-card-icon"><BookOpen aria-hidden="true" /></div>
              <h2>{guide.title}</h2><p>{guide.description}</p>
              <span className="tool-link">Read guide <ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
        <div className="container source-policy"><div><h2>How guidance is maintained</h2><p>BIMI is still an active Internet-Draft and mailbox policies change. We label provider-specific claims, link primary sources, and review material when the public draft changes.</p></div><a className="button button--dark" href="https://github.com/suped-com/openbimi">Suggest a correction <ArrowRight size={16} aria-hidden="true" /></a></div>
      </section>
    </main>
  );
}
