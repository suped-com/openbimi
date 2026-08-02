"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardCheck, Eraser, LockKeyhole, Search } from "lucide-react";
import { StatusIcon } from "@/components/status-icon";
import { inspectEmailHeaders, type HeaderInspection } from "@/lib/headers";
import type { CheckTone } from "@/lib/types";

const sampleHeaders = `From: Example Brand <news@example.com>
Authentication-Results: mx.mailbox.example;
 dkim=pass header.i=@mail.example.com header.s=marketing;
 spf=pass smtp.mailfrom=bounce.example.com;
 dmarc=pass header.from=example.com
DKIM-Signature: v=1; a=rsa-sha256; d=mail.example.com; s=marketing;
BIMI-Location: v=BIMI1; l=https://example.com/bimi/logo.svg`;

function resultTone(result: string, aligned: boolean | null): CheckTone {
  if (result !== "pass") return "fail";
  if (aligned === false) return "warning";
  return "pass";
}

export function HeaderInspector() {
  const [source, setSource] = useState("");
  const [inspection, setInspection] = useState<HeaderInspection | null>(null);

  function inspect() {
    setInspection(inspectEmailHeaders(source));
  }

  return (
    <div className="header-inspector">
      <div className="header-input-panel">
        <div className="header-tool-heading"><div><p className="panel-label">Raw message headers</p><h2>Paste the complete received headers</h2></div><span><LockKeyhole size={15} aria-hidden="true" /> Local only</span></div>
        <p className="header-tool-help">Copy the original message source from the receiving mailbox. Headers can contain email addresses, IPs, and message IDs—review them before sharing anywhere else.</p>
        <label className="visually-hidden" htmlFor="raw-headers">Raw email headers</label>
        <textarea id="raw-headers" value={source} onChange={(event) => setSource(event.target.value)} placeholder="From: …&#10;Authentication-Results: …&#10;DKIM-Signature: …" spellCheck={false} />
        <div className="button-row header-tool-actions">
          <button className="button button--primary" type="button" onClick={inspect} disabled={!source.trim()}><Search size={17} aria-hidden="true" /> Inspect headers</button>
          <button className="button button--quiet" type="button" onClick={() => { setSource(sampleHeaders); setInspection(inspectEmailHeaders(sampleHeaders)); }}><ClipboardCheck size={17} aria-hidden="true" /> Use example</button>
          <button className="button button--quiet" type="button" onClick={() => { setSource(""); setInspection(null); }}><Eraser size={17} aria-hidden="true" /> Clear</button>
        </div>
        <p className="privacy-line">This parser runs entirely in your browser. OpenBIMI does not receive or retain the pasted header.</p>
      </div>

      {inspection && (
        <div className="header-results" aria-live="polite">
          <div className="header-result-overview"><div><p className="panel-label">Observed message</p><h2>{inspection.fromDomain || "From domain not found"}</h2><span>{inspection.receiver ? `Authentication added by ${inspection.receiver}` : "Receiving system not identified"}</span></div><CheckCircle2 size={30} aria-hidden="true" /></div>
          <div className="header-result-grid">
            {inspection.results.map((result, index) => {
              const tone = resultTone(result.result, result.aligned);
              return <article className={`header-result-card header-result-card--${tone}`} key={`${result.mechanism}-${index}`}><StatusIcon tone={tone} /><div><p>{result.mechanism.toUpperCase()}</p><h3>{result.result}</h3><span>{result.domain || "No domain reported"}</span>{result.mechanism !== "dmarc" && <small>{result.aligned === true ? "Aligned with From domain" : result.aligned === false ? "Passed but not aligned with From domain" : "Alignment could not be determined"}</small>}{result.selector && <code>selector: {result.selector}</code>}</div></article>;
            })}
          </div>
          {inspection.dkimSignatures.length > 0 && <div className="header-evidence"><p className="panel-label">DKIM signatures present</p>{inspection.dkimSignatures.map((signature, index) => <code key={index}>d={signature.domain || "unknown"}; s={signature.selector || "unknown"}</code>)}</div>}
          {inspection.bimiHeaders.length > 0 && <div className="header-evidence"><p className="panel-label">BIMI headers observed</p>{inspection.bimiHeaders.map((header) => <code key={header}>{header}</code>)}</div>}
          {inspection.warnings.map((warning) => <div className="inline-error" key={warning}>{warning}</div>)}
          <p className="header-limit-note">These results describe this one received message. They do not prove that every sender using the domain authenticates correctly, and forwarded mail can change the evidence.</p>
        </div>
      )}
    </div>
  );
}
