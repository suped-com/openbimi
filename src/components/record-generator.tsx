"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Cloud, Copy, FileCheck2, Globe2, ShieldCheck } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { buildBimiRecord } from "@/lib/records";
import { isHttpsUrl, isValidDomain, isValidSelector, normalizeDomain } from "@/lib/domain";

type RecordGeneratorProps = { initialDomain?: string };

export function RecordGenerator({ initialDomain = "" }: RecordGeneratorProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [selector, setSelector] = useState("default");
  const [logoUrl, setLogoUrl] = useState("");
  const [authorityUrl, setAuthorityUrl] = useState("");
  const [avatarPreference, setAvatarPreference] = useState<"brand" | "personal">("brand");

  const normalizedDomain = normalizeDomain(domain);
  const errors = {
    domain: domain && !isValidDomain(normalizedDomain) ? "Enter a valid public domain." : "",
    selector: !isValidSelector(selector) ? "Use letters, numbers, and hyphens only." : "",
    logo: logoUrl && !isHttpsUrl(logoUrl) ? "Use a public HTTPS URL with no custom port." : "",
    authority: authorityUrl && !isHttpsUrl(authorityUrl) ? "Use a public HTTPS URL with no custom port." : "",
  };
  const complete = Boolean(normalizedDomain && logoUrl && !Object.values(errors).some(Boolean));
  const host = `${selector || "default"}._bimi.${normalizedDomain || "yourdomain.com"}`;
  const value = buildBimiRecord({ location: logoUrl || "https://assets.yourdomain.com/bimi-logo.svg", authority: authorityUrl, avatarPreference });

  return (
    <div className="generator-layout">
      <form className="generator-form" onSubmit={(event) => event.preventDefault()}>
        <div className="form-section-heading"><span>1</span><div><h2>Domain and selector</h2><p>Most organisations should keep the default selector.</p></div></div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="generator-domain">Sending domain</label>
            <div className="field-with-icon"><Globe2 size={17} aria-hidden="true" /><input id="generator-domain" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="yourdomain.com" /></div>
            {errors.domain && <p className="field-error">{errors.domain}</p>}
          </div>
          <div className="field field--short">
            <label htmlFor="generator-selector">Selector</label>
            <input id="generator-selector" value={selector} onChange={(event) => setSelector(event.target.value.toLowerCase())} />
            {errors.selector && <p className="field-error">{errors.selector}</p>}
          </div>
        </div>

        <div className="form-divider" />
        <div className="form-section-heading"><span>2</span><div><h2>Hosted BIMI logo</h2><p>Use the final public URL of your validated SVG Tiny PS file.</p></div></div>
        <div className="field">
          <label htmlFor="generator-logo">SVG URL</label>
          <input id="generator-logo" type="url" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value.trim())} placeholder="https://assets.yourdomain.com/bimi-logo.svg" />
          {errors.logo ? <p className="field-error">{errors.logo}</p> : <p className="field-help">Must use HTTPS and remain publicly accessible.</p>}
        </div>

        <div className="form-divider" />
        <div className="form-section-heading"><span>3</span><div><h2>Mark certificate <em>Optional</em></h2><p>Add the PEM URL supplied by your VMC or CMC issuer.</p></div></div>
        <div className="field">
          <label htmlFor="generator-authority">VMC or CMC URL</label>
          <input id="generator-authority" type="url" value={authorityUrl} onChange={(event) => setAuthorityUrl(event.target.value.trim())} placeholder="https://assets.yourdomain.com/mark-certificate.pem" />
          {errors.authority ? <p className="field-error">{errors.authority}</p> : <p className="field-help">Optional in the core record, required by many major mailbox providers.</p>}
        </div>

        <details className="advanced-options">
          <summary>Advanced: personal avatar preference</summary>
          <div className="radio-cards">
            <label><input type="radio" name="avatar" checked={avatarPreference === "brand"} onChange={() => setAvatarPreference("brand")} /><span><strong>Brand logo</strong><small>Prefer the BIMI brand mark. This is the default.</small></span></label>
            <label><input type="radio" name="avatar" checked={avatarPreference === "personal"} onChange={() => setAvatarPreference("personal")} /><span><strong>Personal avatar</strong><small>Allow a personal avatar to take priority when supported.</small></span></label>
          </div>
        </details>
      </form>

      <aside className="record-output" aria-live="polite">
        <div className="output-heading">
          <div><p className="panel-label">Your BIMI record</p><h2>{complete ? "Ready to publish" : "Complete the fields"}</h2></div>
          <span className={`output-status${complete ? " output-status--ready" : ""}`}>{complete ? <Check size={14} aria-hidden="true" /> : null}{complete ? "Valid inputs" : "Draft"}</span>
        </div>

        <div className="dns-field">
          <div><span>Type</span><strong>TXT</strong></div>
          <CopyButton value="TXT" />
        </div>
        <div className="dns-field">
          <div><span>Host / name</span><code>{host}</code></div>
          <CopyButton value={host} />
        </div>
        <div className="dns-field dns-field--value">
          <div><span>Value / content</span><code>{value}</code></div>
          <CopyButton value={value} />
        </div>

        <div className="publish-steps">
          <p className="panel-label">Publish in any DNS provider</p>
          <ol>
            <li><span><Cloud size={16} aria-hidden="true" /></span><div><strong>Open DNS records</strong><p>Choose the zone for {normalizedDomain || "your domain"}.</p></div></li>
            <li><span><Copy size={16} aria-hidden="true" /></span><div><strong>Add a TXT record</strong><p>Paste the host and value above. In Cloudflare, keep this as DNS-only.</p></div></li>
            <li><span><FileCheck2 size={16} aria-hidden="true" /></span><div><strong>Save and recheck</strong><p>DNS changes can take several minutes—and occasionally up to 48 hours—to appear everywhere.</p></div></li>
          </ol>
        </div>

        <div className="output-note"><ShieldCheck size={18} aria-hidden="true" /><p>Before publishing, make sure DMARC is enforced at quarantine or reject for 100% of mail.</p></div>

        <Link
          className={`button button--primary button--wide${!complete ? " is-disabled" : ""}`}
          aria-disabled={!complete}
          tabIndex={complete ? undefined : -1}
          href={complete ? `/check?domain=${encodeURIComponent(normalizedDomain)}&selector=${encodeURIComponent(selector)}` : "#generator-domain"}
          onClick={(event) => { if (!complete) event.preventDefault(); }}
        >
          Check published setup <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
