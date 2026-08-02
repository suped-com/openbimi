"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  FileCode2,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { StatusIcon } from "@/components/status-icon";
import { isValidDomain, isValidSelector, normalizeDomain } from "@/lib/domain";
import type { CheckSection, CheckTone, DomainCheckResult, ValidationIssue } from "@/lib/types";

type DomainCheckerProps = {
  initialDomain?: string;
  initialSelector?: string;
  compact?: boolean;
};

function toneLabel(tone: CheckTone) {
  return tone === "pass" ? "Passed" : tone === "fail" ? "Action needed" : tone === "warning" ? "Review" : "Information";
}

function IssueList({ issues, emptyText }: { issues: ValidationIssue[]; emptyText: string }) {
  if (!issues.length) {
    return (
      <div className="result-issue result-issue--pass">
        <StatusIcon tone="pass" size={15} />
        <div><strong>{emptyText}</strong></div>
      </div>
    );
  }
  return (
    <div className="result-issues">
      {issues.map((issue) => (
        <div className={`result-issue result-issue--${issue.tone}`} key={issue.code}>
          <StatusIcon tone={issue.tone} size={15} />
          <div>
            <strong>{issue.title}</strong>
            <p>{issue.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultSection({ section }: { section: CheckSection }) {
  return (
    <article className="result-card">
      <div className="result-card-heading">
        <StatusIcon tone={section.status} />
        <div>
          <p className={`tone-label tone-label--${section.status}`}>{toneLabel(section.status)}</p>
          <h3>{section.title}</h3>
        </div>
      </div>
      <p className="result-summary">{section.summary}</p>
      <IssueList issues={section.issues} emptyText="No issues found" />
      <details className="technical-details">
        <summary>Technical details</summary>
        <p className="query-name">TXT · {section.queryName}</p>
        {section.record ? <code>{section.record}</code> : <p>No record returned.</p>}
      </details>
    </article>
  );
}

function CheckResults({ result }: { result: DomainCheckResult }) {
  const readinessLabel = result.readiness === "ready" ? "Ready for broad support" : result.readiness === "technical" ? "Core setup is valid" : "Setup needs work";
  const overallTone: CheckTone = result.readiness === "ready" ? "pass" : result.readiness === "technical" ? "warning" : "fail";
  const shareUrl = `https://openbimi.com/check?domain=${encodeURIComponent(result.domain)}${result.selector !== "default" ? `&selector=${encodeURIComponent(result.selector)}` : ""}`;

  return (
    <div className="checker-results" aria-live="polite">
      <div className={`readiness-card readiness-card--${overallTone}`}>
        <div className="score-ring" style={{ "--score": `${result.score * 3.6}deg` } as React.CSSProperties}>
          <span>{result.score}</span>
          <small>/100</small>
        </div>
        <div className="readiness-copy">
          <p className="tone-label">OpenBIMI readiness</p>
          <h2>{readinessLabel}</h2>
          <p>{result.summary}</p>
        </div>
        <CopyButton value={shareUrl} label="Copy report link" />
      </div>

      <div className="result-grid">
        <ResultSection section={result.dmarc} />
        <ResultSection section={result.bimi} />

        <article className="result-card result-card--logo">
          <div className="result-card-heading">
            <StatusIcon tone={result.logo.status} />
            <div>
              <p className={`tone-label tone-label--${result.logo.status}`}>{toneLabel(result.logo.status)}</p>
              <h3>Hosted logo</h3>
            </div>
          </div>
          {result.logo.url ? (
            <div className="logo-result-preview">
              {/* User-provided SVG hosts are intentionally unrestricted; native img keeps them in an image sandbox. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.logo.url} alt={`BIMI logo published by ${result.domain}`} />
            </div>
          ) : (
            <div className="logo-result-empty"><FileCode2 size={28} aria-hidden="true" /> No SVG published</div>
          )}
          <p className="result-summary">{result.logo.summary}</p>
          {result.logo.error && <div className="inline-error">{result.logo.error}</div>}
          {result.logo.report && (
            <IssueList issues={result.logo.report.issues} emptyText="SVG passes all checks" />
          )}
          <Link className="text-link" href="/tools/svg-validator">
            Validate another SVG <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </article>

        <article className="result-card">
          <div className="result-card-heading">
            <StatusIcon tone={result.authority.status} />
            <div>
              <p className={`tone-label tone-label--${result.authority.status}`}>{toneLabel(result.authority.status)}</p>
              <h3>Mark certificate</h3>
            </div>
          </div>
          <p className="result-summary">{result.authority.summary}</p>
          {result.authority.url && (
            <a className="text-link break-link" href={result.authority.url} target="_blank" rel="noreferrer">
              Open certificate <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
          <div className="provider-note">
            <ShieldCheck size={19} aria-hidden="true" />
            <p>Gmail and several other major providers require a VMC or CMC before displaying the logo.</p>
          </div>
          <Link className="text-link" href="/guides/mark-certificates">
            Understand certificates <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </article>
      </div>

      <div className="result-actions">
        <div>
          <strong>Next step</strong>
          <p>{result.readiness === "needs-work" ? "Use the generator to prepare a corrected BIMI record." : "Recheck after any DNS change; propagation may take up to 48 hours."}</p>
        </div>
        <Link className="button button--dark" href={`/tools/record-generator?domain=${encodeURIComponent(result.domain)}`}>
          Open record generator <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <p className="check-disclaimer">OpenBIMI checks public configuration, not sending reputation or per-message authentication. A passing result cannot guarantee display in every inbox.</p>
    </div>
  );
}

export function DomainChecker({ initialDomain = "", initialSelector = "default", compact = false }: DomainCheckerProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [selector, setSelector] = useState(initialSelector);
  const [result, setResult] = useState<DomainCheckResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hasAutoRun = useRef(false);

  const runCheck = useCallback(async (domainValue: string, selectorValue: string) => {
    const normalized = normalizeDomain(domainValue);
    if (!isValidDomain(normalized)) {
      setError("Enter a valid public domain, such as example.com.");
      return;
    }
    if (!isValidSelector(selectorValue)) {
      setError("The selector may contain letters, numbers, and hyphens.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`/api/check?domain=${encodeURIComponent(normalized)}&selector=${encodeURIComponent(selectorValue)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The check failed.");
      setDomain(normalized);
      setResult(payload as DomainCheckResult);
      if (!compact) {
        window.history.replaceState(null, "", `/check?domain=${encodeURIComponent(normalized)}${selectorValue !== "default" ? `&selector=${encodeURIComponent(selectorValue)}` : ""}`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The check failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [compact]);

  useEffect(() => {
    if (initialDomain && !hasAutoRun.current) {
      hasAutoRun.current = true;
      void runCheck(initialDomain, initialSelector);
    }
  }, [initialDomain, initialSelector, runCheck]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runCheck(domain, selector);
  }

  return (
    <div className={`domain-checker${compact ? " domain-checker--compact" : ""}`}>
      <form className="checker-form" onSubmit={submit} action="/check" method="get" noValidate>
        <label htmlFor={compact ? "hero-domain" : "check-domain"}>Domain to check</label>
        <div className="checker-input-row">
          <div className="domain-input-wrap">
            <Search size={19} aria-hidden="true" />
            <input
              id={compact ? "hero-domain" : "check-domain"}
              name="domain"
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="yourdomain.com"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              aria-describedby={error ? "domain-error" : undefined}
            />
          </div>
          <button className="button button--primary" type="submit" disabled={loading}>
            {loading ? <RefreshCw className="spin" size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
            {loading ? "Checking…" : "Check domain"}
          </button>
        </div>
        <details className="selector-options">
          <summary>Using a custom selector?</summary>
          <label htmlFor={compact ? "hero-selector" : "check-selector"}>BIMI selector</label>
          <input
            id={compact ? "hero-selector" : "check-selector"}
            name="selector"
            value={selector}
            onChange={(event) => setSelector(event.target.value.toLowerCase())}
          />
        </details>
        {error && <p className="form-error" id="domain-error" role="alert">{error}</p>}
        <p className="privacy-line">No account. We only query public DNS and published BIMI files.</p>
      </form>
      {loading && (
        <div className="checking-state" role="status">
          <div className="checking-orbit"><span /></div>
          <div><strong>Following the public trail</strong><p>Checking DMARC, BIMI, the hosted logo, and certificate.</p></div>
        </div>
      )}
      {result && <CheckResults result={result} />}
    </div>
  );
}
