import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Info } from "lucide-react";
import { getGuide, guides } from "@/content/guides";

type GuidePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const currentIndex = guides.findIndex((item) => item.slug === slug);
  const nextGuide = guides[(currentIndex + 1) % guides.length];

  return (
    <main className="page-main guide-page">
      <header className="guide-hero">
        <div className="container guide-container">
          <Link className="back-link" href="/guides"><ArrowLeft size={15} aria-hidden="true" /> All guides</Link>
          <div className="guide-meta"><span>{guide.eyebrow}</span><span><Clock size={14} aria-hidden="true" /> {guide.readTime} read</span><span>Reviewed 2 Aug 2026</span></div>
          <h1>{guide.title}</h1><p>{guide.intro}</p>
          <a className="source-link" href={guide.source.href} target="_blank" rel="noreferrer">Primary source: {guide.source.label} <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </header>
      <article className="guide-body">
        <div className="container guide-container">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              {section.callout && <aside><Info size={19} aria-hidden="true" /><p>{section.callout}</p></aside>}
            </section>
          ))}
          <div className="guide-next"><span>Continue learning</span><Link href={`/guides/${nextGuide.slug}`}><strong>{nextGuide.title}</strong><ArrowRight aria-hidden="true" /></Link></div>
        </div>
      </article>
    </main>
  );
}
