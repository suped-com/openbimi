"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  FileCode2,
  RefreshCw,
  Sparkles,
  Upload,
} from "lucide-react";
import { StatusIcon } from "@/components/status-icon";
import { fixSvgMetadata, validateSvg } from "@/lib/svg";
import type { SvgReport } from "@/lib/types";

const sampleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" viewBox="0 0 96 96" version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg">
  <title>Example brand</title>
  <desc>A blue circle containing the letter B</desc>
  <rect width="96" height="96" rx="48" fill="#1f49ca"/>
  <path fill="#fff" d="M31 20h20c13 0 21 6 21 17 0 6-3 11-8 14 7 3 11 9 11 17 0 13-9 20-24 20H31V20zm17 27c7 0 11-3 11-8s-4-8-11-8h-4v16h4zm2 30c8 0 12-3 12-10 0-6-4-9-12-9h-6v19h6z"/>
</svg>`;

function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export function SvgValidator() {
  const [source, setSource] = useState("");
  const [filename, setFilename] = useState("");
  const [brandName, setBrandName] = useState("");
  const [report, setReport] = useState<SvgReport | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function inspect(nextSource: string, nextFilename: string) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(new Blob([nextSource], { type: "image/svg+xml" }));
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    setSource(nextSource);
    setFilename(nextFilename);
    setReport(validateSvg(nextSource));
  }

  function readFile(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      setReport({
        valid: false,
        compatible: false,
        issues: [{ code: "file-type", tone: "fail", title: "Choose an SVG file", detail: "BIMI does not support PNG, JPEG, PDF, or AI files." }],
        stats: { bytes: file.size, title: null, viewBox: null, width: null, height: null },
      });
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
      setPreviewUrl("");
      setSource("");
      setFilename(file.name);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => inspect(String(reader.result ?? ""), file.name);
    reader.readAsText(file);
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    readFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    readFile(event.dataTransfer.files?.[0]);
  }

  function applyFixes() {
    const fixed = fixSvgMetadata(source, brandName);
    inspect(fixed, filename.replace(/\.svg$/i, "-bimi.svg") || "logo-bimi.svg");
  }

  function download() {
    const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename || "logo-bimi.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const fixable = report?.issues.some((issue) => issue.fixable);

  return (
    <div className="validator-app">
      <div
        className={`drop-zone${dragging ? " drop-zone--active" : ""}`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <input ref={inputRef} type="file" accept=".svg,image/svg+xml" onChange={onInput} hidden />
        <div className="drop-icon"><Upload size={25} aria-hidden="true" /></div>
        <h2>Drop your logo SVG here</h2>
        <p>Validation happens locally in your browser. Your artwork is never uploaded.</p>
        <div className="drop-actions">
          <button className="button button--primary" type="button" onClick={() => inputRef.current?.click()}>
            Choose SVG
          </button>
          <button className="button button--quiet" type="button" onClick={() => inspect(sampleSvg, "example-bimi.svg")}>
            Try an example
          </button>
        </div>
      </div>

      {report && (
        <div className="validator-results" aria-live="polite">
          <div className="validator-summary">
            <div className={`validator-verdict validator-verdict--${report.valid ? report.compatible ? "pass" : "warning" : "fail"}`}>
              <StatusIcon tone={report.valid ? report.compatible ? "pass" : "warning" : "fail"} size={23} />
              <div>
                <p>{filename || "SVG file"}</p>
                <h2>{report.valid ? report.compatible ? "Ready for BIMI" : "Valid with warnings" : "Changes required"}</h2>
              </div>
            </div>
            <dl className="file-stats">
              <div><dt>File size</dt><dd>{formatBytes(report.stats.bytes)}</dd></div>
              <div><dt>Canvas</dt><dd>{report.stats.viewBox || "Not set"}</dd></div>
              <div><dt>Title</dt><dd>{report.stats.title || "Missing"}</dd></div>
            </dl>
          </div>

          <div className="validator-workspace">
            <div className="logo-preview-panel">
              <p className="panel-label">Inbox preview</p>
              <div className="inbox-preview">
                <div className="avatar-shell">
                  {previewUrl ? (
                    // Blob URLs are created from the user-selected local file and cannot use Next image optimisation.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Preview of the selected BIMI logo" />
                  ) : <FileCode2 aria-hidden="true" />}
                </div>
                <div><strong>Your brand</strong><p>Important message preview…</p></div>
                <span>10:24</span>
              </div>
              <p className="preview-note">Providers may crop logos as circles or rounded squares. Keep key artwork centred with breathing room.</p>
            </div>

            <div className="validation-list-panel">
              <div className="panel-heading">
                <div><p className="panel-label">Validation report</p><h3>{report.issues.length} check{report.issues.length === 1 ? "" : "s"}</h3></div>
                {report.valid && <span className="mini-success"><Check size={14} aria-hidden="true" /> Structurally valid</span>}
              </div>
              <div className="validation-list">
                {report.issues.map((issue) => (
                  <div className={`validation-item validation-item--${issue.tone}`} key={issue.code}>
                    <StatusIcon tone={issue.tone} size={15} />
                    <div><strong>{issue.title}</strong><p>{issue.detail}</p></div>
                    {issue.fixable && <span>Auto-fixable</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="validator-actions">
            {fixable && (
              <div className="fixer-fields">
                <label htmlFor="brand-name">Brand name for title and description</label>
                <input id="brand-name" value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Your brand" />
              </div>
            )}
            <div className="button-row">
              {fixable && (
                <button className="button button--primary" type="button" onClick={applyFixes}>
                  <Sparkles size={17} aria-hidden="true" /> Fix safe metadata issues
                </button>
              )}
              {source && (
                <button className="button button--dark" type="button" onClick={download}>
                  <Download size={17} aria-hidden="true" /> Download SVG
                </button>
              )}
              <button className="button button--quiet" type="button" onClick={() => inputRef.current?.click()}>
                <RefreshCw size={16} aria-hidden="true" /> Choose another
              </button>
            </div>
            {fixable && <p>Automatic fixes only update safe metadata. Unsupported artwork, scripts, raster images, and external references must be removed in your design tool.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
