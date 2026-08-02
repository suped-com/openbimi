import { AlertTriangle, Check, Info, X } from "lucide-react";
import type { CheckTone } from "@/lib/types";

export function StatusIcon({ tone, size = 18 }: { tone: CheckTone; size?: number }) {
  const Icon = tone === "pass" ? Check : tone === "fail" ? X : tone === "warning" ? AlertTriangle : Info;
  return (
    <span className={`status-icon status-icon--${tone}`} aria-hidden="true">
      <Icon size={size} strokeWidth={2.3} />
    </span>
  );
}
