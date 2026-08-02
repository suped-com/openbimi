"use client";

import { useEffect, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <button className={`copy-button copy-button--${status}`} type="button" onClick={copy} aria-live="polite">
      <span className="copy-button-icons" aria-hidden="true">
        <Copy className="copy-icon copy-icon--idle" size={15} />
        <Check className="copy-icon copy-icon--copied" size={15} />
        <TriangleAlert className="copy-icon copy-icon--error" size={15} />
      </span>
      {status === "copied" ? "Copied" : status === "error" ? "Copy failed" : label}
    </button>
  );
}
