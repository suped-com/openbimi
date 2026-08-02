import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Code2,
  FileCode2,
  Globe2,
  LockKeyhole,
  Search,
  Sparkles,
} from "lucide-react";
import { DomainChecker } from "@/components/domain-checker";

const faqs = [
  ["Is OpenBIMI really free?", "Yes. The checker, record generator, SVG validator, and guides are free and open source. There is no account or usage paywall."],
  ["Will a passing check guarantee my logo appears?", "No. BIMI gives providers a verified signal, but each mailbox provider decides whether and how to display an indicator using its own reputation and eligibility policies."],
  ["Do I need a VMC or CMC?", "The core BIMI record supports self-asserted logos, but Gmail and several other major providers require a mark certificate. Support without one is limited."],
  ["Does OpenBIMI change my DNS?", "No. We inspect public records and generate values for you to copy. You stay in control of every DNS change."],
];

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="container home-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Free · Open source · Private by design</p>
            <h1>Put your brand <em>in the inbox.</em></h1>
            <p className="hero-lede">Set up BIMI with clear, independent tools that check every public requirement—without an account, a sales call, or a black box.</p>
            <div className="hero-points">
              <span><CheckCircle2 size={16} aria-hidden="true" /> Live DNS and logo checks</span>
              <span><CheckCircle2 size={16} aria-hidden="true" /> Exact records to publish</span>
              <span><CheckCircle2 size={16} aria-hidden="true" /> Nothing stored</span>
            </div>
          </div>
          <div className="hero-checker-card">
            <div className="checker-card-top">
              <div><span className="live-dot" /> Live public check</div>
              <span>No sign-in</span>
            </div>
            <h2>Is your domain ready for BIMI?</h2>
            <p>Check DMARC, the BIMI record, hosted SVG, and mark certificate in one pass.</p>
            <DomainChecker compact />
          </div>
        </div>
        <div className="container hero-trust-line">
          <span>Built around the public standard</span>
          <span><LockKeyhole size={15} aria-hidden="true" /> No credentials requested</span>
          <span><Code2 size={15} aria-hidden="true" /> Apache 2.0</span>
          <a href="https://github.com/suped-com/openbimi">Inspect every line <ArrowRight size={14} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="tool-section section-pad" id="tools">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow"><span /> The open toolkit</p><h2>Everything between “maybe” and <em>published.</em></h2></div>
            <p>Each tool works on its own. Together they cover the full public BIMI setup path.</p>
          </div>
          <div className="tool-grid">
            <Link className="tool-card tool-card--blue" href="/check">
              <span className="tool-number">01</span><div className="tool-icon"><Search aria-hidden="true" /></div>
              <h3>Domain checker</h3><p>Follow the public chain from DMARC policy to assertion record, hosted SVG, and certificate.</p>
              <span className="tool-link">Check a domain <ArrowRight size={16} aria-hidden="true" /></span>
              <div className="mini-dns-card" aria-hidden="true"><span><i /> DMARC enforced</span><span><i /> BIMI record found</span><span><i /> SVG Tiny PS valid</span></div>
            </Link>
            <Link className="tool-card tool-card--butter" href="/tools/svg-validator">
              <span className="tool-number">02</span><div className="tool-icon"><FileCode2 aria-hidden="true" /></div>
              <h3>SVG validator</h3><p>Inspect your logo locally for Tiny PS structure, unsafe content, file size, and inbox compatibility.</p>
              <span className="tool-link">Validate a logo <ArrowRight size={16} aria-hidden="true" /></span>
              <div className="mini-logo-card" aria-hidden="true"><div className="mini-brand-mark">B</div><span>tiny-ps</span><span>32 KB max</span></div>
            </Link>
            <Link className="tool-card tool-card--coral" href="/tools/record-generator">
              <span className="tool-number">03</span><div className="tool-icon"><Sparkles aria-hidden="true" /></div>
              <h3>Record generator</h3><p>Build a correct TXT name and value, then copy both into any DNS provider.</p>
              <span className="tool-link">Build your record <ArrowRight size={16} aria-hidden="true" /></span>
              <div className="mini-record-card" aria-hidden="true"><small>TXT</small><code>v=BIMI1; l=https://…</code></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="how-section section-pad">
        <div className="container how-grid">
          <div className="how-intro">
            <p className="eyebrow eyebrow--light"><span /> The whole path</p>
            <h2>Four steps.<br /><em>No mystery.</em></h2>
            <p>BIMI sits on top of healthy email authentication. OpenBIMI shows what is public, what is missing, and what still needs a human decision.</p>
            <Link className="button button--light" href="/guides/bimi-setup">Read the complete guide <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ol className="steps-list">
            <li><span>1</span><div><div className="step-icon"><LockKeyhole aria-hidden="true" /></div><h3>Enforce DMARC</h3><p>Authenticate legitimate mail and move the policy to quarantine or reject at full coverage.</p></div></li>
            <li><span>2</span><div><div className="step-icon"><FileCode2 aria-hidden="true" /></div><h3>Prepare the SVG</h3><p>Convert the logo to the restricted Tiny PS profile and design for small, masked crops.</p></div></li>
            <li><span>3</span><div><div className="step-icon"><BadgeCheck aria-hidden="true" /></div><h3>Add authority evidence</h3><p>Use a VMC or CMC when the mailbox providers you care about require certification.</p></div></li>
            <li><span>4</span><div><div className="step-icon"><Globe2 aria-hidden="true" /></div><h3>Publish and verify</h3><p>Add the BIMI TXT record, wait for DNS propagation, and check the public result.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="truth-section section-pad">
        <div className="container truth-grid">
          <div className="truth-graphic" aria-hidden="true"><div className="truth-ring"><div className="truth-mark">B</div><span className="orbit-chip orbit-chip--one">DMARC</span><span className="orbit-chip orbit-chip--two">SVG</span><span className="orbit-chip orbit-chip--three">DNS</span></div></div>
          <div className="truth-copy">
            <p className="eyebrow"><span /> Honest by design</p>
            <h2>A passing record is a signal, <em>not a promise.</em></h2>
            <p>Mailbox providers still apply reputation, volume, certificate, and local display policies. OpenBIMI separates technical validity from provider eligibility so you know exactly what a result proves.</p>
            <ul><li><CheckCircle2 aria-hidden="true" /> Current public DNS and file validation</li><li><CheckCircle2 aria-hidden="true" /> Clear standards versus provider-specific guidance</li><li><CheckCircle2 aria-hidden="true" /> No invented guarantee that a logo will appear</li></ul>
          </div>
        </div>
      </section>

      <section className="faq-section section-pad">
        <div className="container faq-grid">
          <div><p className="eyebrow"><span /> Straight answers</p><h2>Questions, <em>answered.</em></h2><p>Still unsure? Ask in the public project discussion—someone else probably has the same question.</p><a className="text-link" href="https://github.com/suped-com/openbimi/discussions">Open discussions <ArrowRight size={15} aria-hidden="true" /></a></div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner"><div><p>Ready when you are.</p><h2>Start with the domain you send from.</h2></div><Link className="button button--light" href="/check">Run the free check <ArrowRight size={17} aria-hidden="true" /></Link></div>
      </section>
    </main>
  );
}
