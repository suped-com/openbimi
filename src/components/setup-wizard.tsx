"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Download,
  Globe2,
  ImageIcon,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { StatusIcon } from "@/components/status-icon";
import { isHttpsUrl, isValidDomain, isValidSelector, normalizeDomain } from "@/lib/domain";
import { bimiRecordNames, buildSetupRecord, detectDnsProvider, dnsProviderDetails } from "@/lib/setup";
import { traceRasterFile } from "@/lib/raster";
import { fixSvgMetadata, validateSvg } from "@/lib/svg";
import type { CheckTone, DomainCheckResult, SvgReport } from "@/lib/types";

const steps = [
  { short: "Domain", title: "Check your sending domain" },
  { short: "DMARC", title: "Review email authentication" },
  { short: "Logo", title: "Prepare your BIMI logo" },
  { short: "Record", title: "Publish the DNS record" },
  { short: "Verify", title: "Verify the public setup" },
];

type SetupWizardProps = {
  initialDomain?: string;
  initialSelector?: string;
};

function resultTone(value: boolean): CheckTone {
  return value ? "pass" : "fail";
}

function toneText(tone: CheckTone) {
  return tone === "pass" ? "Ready" : tone === "warning" ? "Review" : tone === "fail" ? "Action needed" : "Information";
}

function ReadinessCard({ tone, title, value, detail }: { tone: CheckTone; title: string; value: string; detail: string }) {
  return (
    <article className={`setup-summary-card setup-summary-card--${tone}`}>
      <StatusIcon tone={tone} size={18} />
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

export function SetupWizard({ initialDomain = "", initialSelector = "default" }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [domain, setDomain] = useState(initialDomain);
  const [selector, setSelector] = useState(initialSelector);
  const [checkResult, setCheckResult] = useState<DomainCheckResult | null>(null);
  const [verifyResult, setVerifyResult] = useState<DomainCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const [brandName, setBrandName] = useState("");
  const [logoSvg, setLogoSvg] = useState("");
  const [logoReport, setLogoReport] = useState<SvgReport | null>(null);
  const [logoName, setLogoName] = useState("");
  const [processingLogo, setProcessingLogo] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [wasTraced, setWasTraced] = useState(false);
  const [traceApproved, setTraceApproved] = useState(false);
  const [useHostedLogo, setUseHostedLogo] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const [logoUrl, setLogoUrl] = useState("");
  const [certificateMode, setCertificateMode] = useState<"self" | "certified">("self");
  const [authorityUrl, setAuthorityUrl] = useState("");

  const normalizedDomain = normalizeDomain(domain);
  const provider = detectDnsProvider(checkResult?.infrastructure.nameservers ?? []);
  const providerDetails = dnsProviderDetails(provider);
  const names = bimiRecordNames(normalizedDomain, selector);
  const recordValue = buildSetupRecord(logoUrl, certificateMode === "certified" ? authorityUrl : undefined);
  const recordReady = isHttpsUrl(logoUrl) && (certificateMode === "self" || isHttpsUrl(authorityUrl));
  const logoReady = useHostedLogo || Boolean(logoReport?.valid && (!wasTraced || traceApproved));
  const logoPreview = useMemo(
    () => logoSvg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}` : "",
    [logoSvg],
  );

  function openStep(next: number) {
    setStep(next);
    setFurthestStep((current) => Math.max(current, next));
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.requestAnimationFrame(() => document.querySelector(".setup-workspace")?.scrollIntoView({ behavior, block: "start" }));
  }

  async function runDomainCheck(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const nextDomain = normalizeDomain(domain);
    if (!isValidDomain(nextDomain)) {
      setError("Enter a valid public domain, such as example.com.");
      return;
    }
    if (!isValidSelector(selector)) {
      setError("The selector may contain letters, numbers, and hyphens.");
      return;
    }

    setChecking(true);
    setError("");
    try {
      const response = await fetch(`/api/check?domain=${encodeURIComponent(nextDomain)}&selector=${encodeURIComponent(selector)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The domain check failed.");
      const result = payload as DomainCheckResult;
      setDomain(nextDomain);
      setCheckResult(result);
      setVerifyResult(null);
      if (result.logo.url) {
        setLogoUrl(result.logo.url);
        setUseHostedLogo(true);
      }
      if (result.authority.url) {
        setAuthorityUrl(result.authority.url);
        setCertificateMode("certified");
      }
      openStep(1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The domain check failed.");
    } finally {
      setChecking(false);
    }
  }

  async function loadLogo(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setLogoError("Choose a file smaller than 10 MB.");
      return;
    }
    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    const isRaster = ["image/png", "image/jpeg", "image/webp"].includes(file.type);
    if (!isSvg && !isRaster) {
      setLogoError("Choose an SVG, PNG, JPEG, or WebP file.");
      return;
    }

    setProcessingLogo(true);
    setLogoError("");
    setTraceApproved(false);
    try {
      const source = isSvg ? await file.text() : await traceRasterFile(file);
      const prepared = isSvg ? source : fixSvgMetadata(source, brandName || normalizedDomain);
      const report = validateSvg(prepared);
      setLogoSvg(prepared);
      setLogoReport(report);
      setLogoName(isSvg ? file.name : `${file.name.replace(/\.[^.]+$/, "")}-bimi.svg`);
      setWasTraced(!isSvg);
      setUseHostedLogo(false);
    } catch (caught) {
      setLogoError(caught instanceof Error ? caught.message : "The logo could not be processed.");
    } finally {
      setProcessingLogo(false);
    }
  }

  function onLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void loadLogo(file);
    event.target.value = "";
  }

  function applySafeFixes() {
    const fixed = fixSvgMetadata(logoSvg, brandName || normalizedDomain);
    setLogoSvg(fixed);
    setLogoReport(validateSvg(fixed));
  }

  function downloadLogo() {
    const blob = new Blob([logoSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = logoName || "bimi-logo.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function verify() {
    setVerifying(true);
    setError("");
    try {
      const response = await fetch(`/api/check?domain=${encodeURIComponent(normalizedDomain)}&selector=${encodeURIComponent(selector)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The verification check failed.");
      setVerifyResult(payload as DomainCheckResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The verification check failed.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="setup-shell">
      <nav className="setup-progress" aria-label="Setup progress">
        <p className="setup-progress-label">Your setup path</p>
        <div className="setup-mobile-progress-copy" aria-live="polite">
          <span>Step {step + 1} of {steps.length}</span>
          <strong>{steps[step].short}: {steps[step].title}</strong>
        </div>
        <ol>
          {steps.map((item, index) => {
            const available = index <= furthestStep;
            const complete = index < step || furthestStep > index;
            return (
              <li key={item.short} className={index === step ? "is-current" : complete ? "is-complete" : ""}>
                <button type="button" disabled={!available} onClick={() => openStep(index)} aria-current={index === step ? "step" : undefined} aria-label={`${index === step ? "Current step" : complete ? "Completed step" : "Step"} ${index + 1}: ${item.title}`}>
                  <span>{complete ? <Check size={14} aria-hidden="true" /> : index + 1}</span>
                  <div><strong>{item.short}</strong><small>{item.title}</small></div>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="setup-privacy-note"><LockKeyhole size={16} aria-hidden="true" /><p><strong>Private by design</strong>Your logo is processed in this browser. It is not uploaded to OpenBIMI.</p></div>
      </nav>

      <div className="setup-workspace">
        <div className="setup-step-heading">
          <p>Step {step + 1} of {steps.length}</p>
          <h2>{steps[step].title}</h2>
        </div>

        {step === 0 && (
          <section className="setup-panel">
            <div className="setup-panel-copy">
              <h3>Start with the domain in your From address</h3>
              <p>We query public DNS only. The result tells the next steps which requirements already pass and which DNS provider appears authoritative.</p>
            </div>
            <form className="setup-domain-form" onSubmit={runDomainCheck} noValidate>
              <div className="field">
                <label htmlFor="setup-domain">Sending domain</label>
                <div className="field-with-icon"><Globe2 size={18} aria-hidden="true" /><input id="setup-domain" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="example.com" autoCapitalize="none" autoCorrect="off" spellCheck={false} /></div>
                <p className="field-help">Use example.com, not a full email address or web page URL.</p>
              </div>
              <div className="field">
                <label htmlFor="setup-selector">BIMI selector</label>
                <input id="setup-selector" value={selector} onChange={(event) => setSelector(event.target.value.toLowerCase())} />
                <p className="field-help">Most domains should keep “default”.</p>
              </div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="setup-actions setup-actions--end">
                <button className="button button--primary" type="submit" disabled={checking}>
                  {checking ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
                  {checking ? "Checking public setup…" : "Check and continue"}
                </button>
              </div>
            </form>
          </section>
        )}

        {step === 1 && checkResult && (
          <section className="setup-panel">
            <div className="setup-panel-copy setup-panel-copy--split">
              <div><h3>Authentication diagnosis for {checkResult.domain}</h3><p>BIMI depends on enforced DMARC. SPF and MX are useful infrastructure signals, but passing BIMI still depends on aligned authentication for every legitimate sender. <Link href="/tools/headers">Inspect a received message header.</Link></p></div>
              <span className={`setup-score setup-score--${checkResult.dmarc.status}`}><strong>{checkResult.score}</strong>/100</span>
            </div>
            <div className="setup-summary-grid">
              <ReadinessCard tone={checkResult.dmarc.status} title="DMARC" value={checkResult.dmarc.policy ? `p=${checkResult.dmarc.policy}` : "Not enforced"} detail={checkResult.dmarc.summary} />
              <ReadinessCard tone={resultTone(checkResult.infrastructure.hasSpf)} title="SPF signal" value={checkResult.infrastructure.hasSpf ? "Record found" : "Not found"} detail="OpenBIMI checks for a public SPF record; it cannot prove every message aligns." />
              <ReadinessCard tone={resultTone(checkResult.infrastructure.hasMx)} title="Mail routing" value={checkResult.infrastructure.hasMx ? "MX found" : "No MX found"} detail="This helps confirm the domain has public mail infrastructure." />
              <ReadinessCard tone={checkResult.bimi.status} title="Existing BIMI" value={checkResult.bimi.record ? "Record found" : "Not published"} detail={checkResult.bimi.summary} />
            </div>
            <div className="setup-provider-box">
              <Globe2 size={20} aria-hidden="true" />
              <div><p>Likely DNS provider</p><strong>{providerDetails.name}</strong><span>{checkResult.infrastructure.nameservers.length ? checkResult.infrastructure.nameservers.join(" · ") : "No authoritative nameservers returned."}</span></div>
            </div>
            {checkResult.dmarc.status !== "pass" && (
              <div className="setup-warning"><AlertTriangle size={19} aria-hidden="true" /><p><strong>Do not rush DMARC enforcement.</strong> First confirm every legitimate sender passes aligned SPF or DKIM, then roll out quarantine or reject safely. <Link href="/guides/dmarc">Read the DMARC guide.</Link></p></div>
            )}
            <div className="setup-actions">
              <button className="button button--quiet" type="button" onClick={() => openStep(0)}><ArrowLeft size={16} aria-hidden="true" /> Change domain</button>
              <button className="button button--primary" type="button" onClick={() => openStep(2)}>Prepare logo <ArrowRight size={16} aria-hidden="true" /></button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="setup-panel">
            <div className="setup-panel-copy"><h3>Upload a logo or use an already-hosted BIMI SVG</h3><p>SVG files are validated as-is. PNG, JPEG, and WebP files are traced into a simplified vector locally, then must be visually approved by you.</p></div>
            <div className="field setup-brand-field"><label htmlFor="setup-brand-name">Brand name for SVG accessibility</label><input id="setup-brand-name" value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder={normalizedDomain || "Example brand"} /></div>
            <input ref={fileInput} className="visually-hidden" type="file" accept="image/svg+xml,.svg,image/png,image/jpeg,image/webp" onChange={onLogoChange} />
            {!logoSvg ? (
              <button className="setup-logo-drop" type="button" onClick={() => fileInput.current?.click()} disabled={processingLogo}>
                {processingLogo ? <LoaderCircle className="spin" size={36} aria-hidden="true" /> : <UploadCloud size={36} aria-hidden="true" />}
                <strong>{processingLogo ? "Preparing your logo…" : "Choose an SVG, PNG, JPEG, or WebP"}</strong>
                <span>Processed locally · 10 MB input limit · no upload</span>
              </button>
            ) : (
              <div className="setup-logo-workspace">
                <div className="setup-logo-preview">
                  <p className="panel-label">Mask previews</p>
                  <div className="setup-preview-grid">
                    <div className="setup-preview-tile"><img src={logoPreview} alt="Square preview of the prepared logo" /></div>
                    <div className="setup-preview-tile setup-preview-tile--circle"><img src={logoPreview} alt="Circular preview of the prepared logo" /></div>
                    <div className="setup-preview-tile setup-preview-tile--dark"><img src={logoPreview} alt="Dark-background preview of the prepared logo" /></div>
                  </div>
                  <p>{wasTraced ? "This is an automatic approximation. Compare curves, counters, colours, and fine lettering before approval." : "Preview the artwork at small sizes and inside a circular crop."}</p>
                </div>
                <div className="setup-logo-report">
                  <div className="panel-heading"><div><p className="panel-label">Validation report</p><h3>{logoReport?.valid ? "Structurally valid" : "Changes required"}</h3></div><StatusIcon tone={logoReport?.valid ? "pass" : "fail"} /></div>
                  <dl className="setup-logo-stats"><div><dt>File</dt><dd>{logoName}</dd></div><div><dt>Size</dt><dd>{logoReport ? `${(logoReport.stats.bytes / 1024).toFixed(1)} KB` : "—"}</dd></div><div><dt>ViewBox</dt><dd>{logoReport?.stats.viewBox || "Missing"}</dd></div></dl>
                  <div className="setup-issue-list">
                    {logoReport?.issues.map((issue) => <div key={issue.code} className={`setup-issue setup-issue--${issue.tone}`}><StatusIcon tone={issue.tone} size={14} /><div><strong>{issue.title}</strong><span>{issue.detail}</span></div></div>)}
                  </div>
                  {wasTraced && <label className="setup-approval"><input type="checkbox" checked={traceApproved} onChange={(event) => setTraceApproved(event.target.checked)} /><span><strong>I visually approve this trace</strong>The traced image still matches the intended brand artwork.</span></label>}
                  <div className="button-row setup-logo-actions">
                    <button className="button button--quiet" type="button" onClick={() => fileInput.current?.click()}><ImageIcon size={16} aria-hidden="true" /> Replace</button>
                    {logoReport?.issues.some((issue) => issue.fixable) && <button className="button button--quiet" type="button" onClick={applySafeFixes}><ShieldCheck size={16} aria-hidden="true" /> Fix metadata</button>}
                    <button className="button button--dark" type="button" onClick={downloadLogo}><Download size={16} aria-hidden="true" /> Download SVG</button>
                  </div>
                </div>
              </div>
            )}
            {logoError && <p className="form-error" role="alert">{logoError}</p>}
            <label className="setup-existing-toggle"><input type="checkbox" checked={useHostedLogo} onChange={(event) => setUseHostedLogo(event.target.checked)} /><span><strong>I already have a hosted, BIMI-ready SVG</strong>You’ll enter its public HTTPS address in the next step.</span></label>
            <div className="setup-actions">
              <button className="button button--quiet" type="button" onClick={() => openStep(1)}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
              <button className="button button--primary" type="button" disabled={!logoReady} onClick={() => openStep(3)}>Build record <ArrowRight size={16} aria-hidden="true" /></button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="setup-panel">
            <div className="setup-panel-copy"><h3>Host the SVG, then add one TXT record</h3><p>Use stable public HTTPS URLs with no login, redirect chain, or expiring token. OpenBIMI does not change DNS on your behalf.</p></div>
            <div className="setup-beta-note"><BadgeCheck size={20} aria-hidden="true" /><p><strong>Managed hosting is planned for beta.</strong> For this anonymous alpha, download the validated SVG and host it on your own HTTPS origin or CDN.</p></div>
            <div className="setup-record-form">
              <div className="field"><label htmlFor="setup-logo-url">Hosted SVG URL</label><input id="setup-logo-url" type="url" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder={`https://${normalizedDomain}/bimi/logo.svg`} /><p className="field-help">Must be a public HTTPS address. A stable .svg path is best.</p>{logoUrl && !isHttpsUrl(logoUrl) && <p className="field-error">Enter a valid HTTPS URL with no credentials or custom port.</p>}</div>
              <fieldset className="setup-certificate-fieldset"><legend>Authority evidence</legend><div className="setup-choice-grid">
                <label className={certificateMode === "self" ? "is-selected" : ""}><input type="radio" name="certificate-mode" checked={certificateMode === "self"} onChange={() => setCertificateMode("self")} /><span><strong>Self-asserted</strong>Free and technically valid, but major inbox support is limited.</span></label>
                <label className={certificateMode === "certified" ? "is-selected" : ""}><input type="radio" name="certificate-mode" checked={certificateMode === "certified"} onChange={() => setCertificateMode("certified")} /><span><strong>VMC or CMC</strong>Use a certificate already issued by an accepted mark authority. OpenBIMI does not sell certificates.</span></label>
              </div></fieldset>
              {certificateMode === "certified" && <div className="field"><label htmlFor="setup-authority-url">Certificate PEM URL</label><input id="setup-authority-url" type="url" value={authorityUrl} onChange={(event) => setAuthorityUrl(event.target.value)} placeholder={`https://${normalizedDomain}/bimi/certificate.pem`} />{authorityUrl && !isHttpsUrl(authorityUrl) && <p className="field-error">Enter a valid public HTTPS URL.</p>}</div>}
            </div>
            <div className="setup-dns-box">
              <div className="setup-dns-heading"><div><p className="panel-label">Publish with {providerDetails.name}</p><h3>Create this TXT record</h3></div>{recordReady && <span><CheckCircle2 size={15} aria-hidden="true" /> Ready to copy</span>}</div>
              <p className="setup-provider-hint">{providerDetails.hint}</p>
              <div className="dns-field"><div><span>Type</span><strong>TXT</strong></div></div>
              <div className="dns-field"><div><span>Host / name</span><strong>{names.host}</strong><small>Full name: {names.fqdn}</small></div><CopyButton value={names.host} /></div>
              <div className="dns-field dns-field--value"><div><span>Value</span><code>{recordValue}</code></div><CopyButton value={recordValue} /></div>
              <div className="dns-field"><div><span>TTL</span><strong>Auto or 300 seconds while testing</strong></div></div>
            </div>
            <div className="setup-actions">
              <button className="button button--quiet" type="button" onClick={() => openStep(2)}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
              <button className="button button--primary" type="button" disabled={!recordReady} onClick={() => openStep(4)}>I’ve published it <ArrowRight size={16} aria-hidden="true" /></button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="setup-panel">
            <div className="setup-panel-copy"><h3>Check what is visible publicly</h3><p>DNS changes can appear quickly or take up to 48 hours depending on caches and the previous TTL. Rechecking is safe.</p></div>
            <div className="setup-verify-summary">
              <div><span>Domain</span><strong>{normalizedDomain}</strong></div><div><span>Record name</span><strong>{names.fqdn}</strong></div><div><span>Expected value</span><code>{recordValue}</code></div>
            </div>
            <div className="setup-verify-action">
              <button className="button button--primary" type="button" disabled={verifying} onClick={() => void verify()}>{verifying ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : <RefreshCw size={18} aria-hidden="true" />}{verifying ? "Checking public DNS…" : "Verify setup now"}</button>
              <p>This runs a fresh check of DMARC, the BIMI TXT record, hosted logo, and certificate URL.</p>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {verifyResult && (
              <div className={`setup-verdict setup-verdict--${verifyResult.readiness}`}>
                <div className="setup-verdict-score"><strong>{verifyResult.score}</strong><span>/100</span></div>
                <div><p>{verifyResult.readiness === "ready" ? "Public setup is ready" : verifyResult.readiness === "technical" ? "Core setup is technically valid" : "More work is still needed"}</p><h3>{verifyResult.summary}</h3><div className="setup-verdict-statuses"><span><StatusIcon tone={verifyResult.dmarc.status} size={14} /> DMARC: {toneText(verifyResult.dmarc.status)}</span><span><StatusIcon tone={verifyResult.bimi.status} size={14} /> BIMI: {toneText(verifyResult.bimi.status)}</span><span><StatusIcon tone={verifyResult.logo.status} size={14} /> Logo: {toneText(verifyResult.logo.status)}</span><span><StatusIcon tone={verifyResult.authority.status} size={14} /> Certificate: {toneText(verifyResult.authority.status)}</span></div></div>
              </div>
            )}
            <div className="setup-disclaimer"><AlertTriangle size={18} aria-hidden="true" /><p>A passing public check does not guarantee display. Mailbox providers also apply reputation, volume, certificate, and local eligibility policies.</p></div>
            <div className="setup-actions">
              <button className="button button--quiet" type="button" onClick={() => openStep(3)}><ArrowLeft size={16} aria-hidden="true" /> Back to record</button>
              <Link className="button button--dark" href={`/check?domain=${encodeURIComponent(normalizedDomain)}${selector !== "default" ? `&selector=${encodeURIComponent(selector)}` : ""}`}>Open full report <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
