import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DomainChecker } from "@/components/domain-checker";
import { isValidDomain, normalizeDomain } from "@/lib/domain";

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const domain = normalizeDomain(decodeURIComponent((await params).domain));
  return {
    title: `${domain} BIMI readiness report`,
    description: `Public DMARC, BIMI record, hosted logo, and mark-certificate checks for ${domain}.`,
    alternates: { canonical: `/check/${encodeURIComponent(domain)}` },
  };
}

export default async function ShareableCheckPage({ params, searchParams }: { params: Promise<{ domain: string }>; searchParams: Promise<{ selector?: string }> }) {
  const domain = normalizeDomain(decodeURIComponent((await params).domain));
  const { selector = "default" } = await searchParams;
  if (!isValidDomain(domain)) notFound();

  return <main className="page-main"><section className="page-hero page-hero--checker"><div className="container narrow-container"><p className="eyebrow"><span /> Public readiness report</p><h1>{domain}</h1><p>A fresh public check of DMARC, the BIMI assertion, hosted logo, and authority evidence. Results are not stored.</p></div></section><section className="checker-page-section"><div className="container"><DomainChecker initialDomain={domain} initialSelector={selector} /></div></section></main>;
}
