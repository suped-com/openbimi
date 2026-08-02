import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "BIMI mailbox-provider support matrix", description: "Source-linked BIMI support and certificate requirements for Gmail, Apple Mail, Yahoo, Fastmail, and Outlook." };

const providers = [
  {
    name: "Gmail",
    status: "Supported",
    tone: "pass",
    evidence: "VMC or CMC required",
    details: "DMARC must use quarantine or reject at full coverage. Gmail accepts VMC and CMC evidence; the verified checkmark is associated with VMC senders.",
    source: "https://support.google.com/a/answer/10911320",
    sourceLabel: "Google Workspace Admin Help",
  },
  {
    name: "Apple Mail",
    status: "Supported",
    tone: "pass",
    evidence: "Evidence and strong authentication",
    details: "Supported in iOS 16, iPadOS 16, macOS Ventura 13 or later, and iCloud.com. Apple describes digitally certified logos and evidence documents.",
    source: "https://support.apple.com/en-gb/108340",
    sourceLabel: "Apple Support",
  },
  {
    name: "Yahoo Mail / AOL",
    status: "Supported with local policy",
    tone: "pass",
    evidence: "Certificate not stated as mandatory",
    details: "Yahoo documents a valid BIMI SVG, enforced DMARC, bulk sending, and sufficient reputation and engagement. Display remains a local decision.",
    source: "https://senders.yahooinc.com/faqs/",
    sourceLabel: "Yahoo Sender Hub",
  },
  {
    name: "Fastmail",
    status: "Supported",
    tone: "pass",
    evidence: "VMC optional",
    details: "Fastmail documents enforced DMARC, SVG Tiny PS, and a logo below 16 KB. It treats a VMC as optional while noting that other receivers can require one.",
    source: "https://www.fastmail.help/hc/en-us/articles/7002542139663-Using-BIMI-in-Fastmail",
    sourceLabel: "Fastmail Help",
  },
  {
    name: "Outlook / Exchange Online",
    status: "No receiver rendering documented",
    tone: "fail",
    evidence: "Not supported as a receiving client",
    details: "Microsoft support material says Exchange Online and Outlook do not currently render BIMI as receivers. Some Microsoft sending products can publish BIMI for other inboxes.",
    source: "https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/bimi-support",
    sourceLabel: "Microsoft Learn",
  },
] as const;

export default function ProvidersPage() {
  return <InfoPage eyebrow="Provider matrix" title={<>One standard.<br /><em>Different inbox rules.</em></>} intro="A valid BIMI record is only the shared starting point. Every mailbox provider can apply its own evidence, reputation, volume, and display policies." updated="2 August 2026">
    <section><div className="provider-revision"><div><span>Validation baseline</span><strong>draft-brand-indicators-for-message-identification-14</strong></div><a href="https://datatracker.ietf.org/doc/draft-brand-indicators-for-message-identification/" target="_blank" rel="noreferrer">Active Internet-Draft <ArrowUpRight size={14} aria-hidden="true" /></a></div></section>
    <section><h2>Mailbox-provider matrix</h2><div className="provider-table-wrap"><table className="provider-table"><thead><tr><th>Provider</th><th>Receiver support</th><th>Evidence path</th><th>Important local rules</th><th>Primary source</th></tr></thead><tbody>{providers.map((provider) => <tr key={provider.name}><th scope="row">{provider.name}</th><td><span className={`provider-status provider-status--${provider.tone}`}>{provider.tone === "pass" ? <CheckCircle2 size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" />}{provider.status}</span></td><td>{provider.evidence}</td><td>{provider.details}</td><td><a href={provider.source} target="_blank" rel="noreferrer">{provider.sourceLabel} <ArrowUpRight size={13} aria-hidden="true" /></a></td></tr>)}</tbody></table></div></section>
    <section><h2>How to read this matrix</h2><div className="info-card-grid info-card-grid--three"><div className="info-card"><CheckCircle2 aria-hidden="true" /><h3>Supported is not guaranteed</h3><p>It means the provider documents or operates BIMI. It does not promise display for a particular sender or message.</p></div><div className="info-card"><CircleHelp aria-hidden="true" /><h3>Evidence varies</h3><p>Some providers require a VMC or CMC. Others can use a self-asserted logo but still apply local policy.</p></div><div className="info-card"><ArrowUpRight aria-hidden="true" /><h3>Primary sources win</h3><p>When this page and a linked provider document disagree, follow the provider’s current documentation and report the mismatch.</p></div></div></section>
    <section className="info-callout"><div><h2>Provider policy changed?</h2><p>Open a correction with the official source and its effective date.</p></div><a className="button button--dark" href="https://github.com/suped-com/openbimi/issues/new" target="_blank" rel="noreferrer">Suggest correction</a></section>
  </InfoPage>;
}
