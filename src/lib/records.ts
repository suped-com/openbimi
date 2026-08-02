import { isHttpsUrl } from "@/lib/domain";
import type { CheckTone, ValidationIssue } from "@/lib/types";

type ParsedTags = {
  tags: Map<string, string>;
  orderedKeys: string[];
  issues: ValidationIssue[];
};

export function parseTagRecord(record: string): ParsedTags {
  const tags = new Map<string, string>();
  const orderedKeys: string[] = [];
  const issues: ValidationIssue[] = [];

  for (const part of record.split(";")) {
    const segment = part.trim();
    if (!segment) continue;

    const separator = segment.indexOf("=");
    if (separator <= 0) {
      issues.push({
        code: "malformed-tag",
        tone: "fail",
        title: "Malformed tag",
        detail: `“${segment}” is not a key=value pair.`,
      });
      continue;
    }

    const key = segment.slice(0, separator).trim();
    const value = segment.slice(separator + 1).trim();
    if (tags.has(key)) {
      issues.push({
        code: `duplicate-${key}`,
        tone: "fail",
        title: `Duplicate ${key}= tag`,
        detail: "Each tag may appear only once.",
      });
      continue;
    }
    tags.set(key, value);
    orderedKeys.push(key);
  }

  return { tags, orderedKeys, issues };
}

export function parseDmarcRecord(record: string) {
  const parsed = parseTagRecord(record);
  const issues = [...parsed.issues];
  const version = parsed.tags.get("v");
  const policy = parsed.tags.get("p")?.toLowerCase() ?? null;
  const subdomainPolicy = parsed.tags.get("sp")?.toLowerCase() ?? null;
  const pctValue = parsed.tags.get("pct");
  const percentage = pctValue === undefined ? 100 : Number(pctValue);

  if (parsed.orderedKeys[0] !== "v" || version !== "DMARC1") {
    issues.push({
      code: "dmarc-version",
      tone: "fail",
      title: "Invalid DMARC version",
      detail: "The record must begin with v=DMARC1.",
    });
  }

  if (!policy) {
    issues.push({
      code: "dmarc-policy-missing",
      tone: "fail",
      title: "DMARC policy is missing",
      detail: "Add p=quarantine or p=reject for BIMI.",
    });
  } else if (policy === "none") {
    issues.push({
      code: "dmarc-policy-none",
      tone: "fail",
      title: "DMARC is monitoring only",
      detail: "BIMI requires an enforcement policy: p=quarantine or p=reject.",
    });
  } else if (!['quarantine', 'reject'].includes(policy)) {
    issues.push({
      code: "dmarc-policy-invalid",
      tone: "fail",
      title: "DMARC policy is invalid",
      detail: "The p= value must be none, quarantine, or reject.",
    });
  }

  if (!Number.isInteger(percentage) || percentage < 0 || percentage > 100) {
    issues.push({
      code: "dmarc-pct-invalid",
      tone: "fail",
      title: "Invalid DMARC percentage",
      detail: "pct= must be a whole number between 0 and 100.",
    });
  } else if (percentage < 100) {
    issues.push({
      code: "dmarc-pct-low",
      tone: "fail",
      title: "DMARC does not cover all mail",
      detail: "Use pct=100 for broad BIMI provider compatibility.",
    });
  }

  if (subdomainPolicy === "none") {
    issues.push({
      code: "dmarc-sp-none",
      tone: "warning",
      title: "Subdomains are not protected",
      detail: "If subdomains send mail, change sp=none to quarantine or reject.",
    });
  }

  const hasFailure = issues.some((issue) => issue.tone === "fail");
  const hasWarning = issues.some((issue) => issue.tone === "warning");
  const status: CheckTone = hasFailure ? "fail" : hasWarning ? "warning" : "pass";

  return { status, issues, policy, subdomainPolicy, percentage };
}

export function parseBimiRecord(record: string) {
  const parsed = parseTagRecord(record);
  const issues = [...parsed.issues];
  const version = parsed.tags.get("v");
  const location = parsed.tags.get("l") ?? null;
  const authority = parsed.tags.get("a") || null;
  const avatarPreference = parsed.tags.get("avp") ?? "brand";

  if (parsed.orderedKeys[0] !== "v" || version !== "BIMI1") {
    issues.push({
      code: "bimi-version",
      tone: "fail",
      title: "Invalid BIMI version",
      detail: "The record must begin with the exact value v=BIMI1.",
    });
  }

  if (location === null) {
    issues.push({
      code: "bimi-location-missing",
      tone: "fail",
      title: "Logo location is missing",
      detail: "Add an l= tag containing the HTTPS URL of the BIMI SVG.",
    });
  } else if (!location) {
    issues.push({
      code: "bimi-declined",
      tone: "fail",
      title: "This record declines BIMI",
      detail: "An empty l= value tells receivers not to display an indicator.",
    });
  } else if (!isHttpsUrl(location)) {
    issues.push({
      code: "bimi-location-https",
      tone: "fail",
      title: "Logo URL must use HTTPS",
      detail: "The l= value must be a public HTTPS URL with no credentials or custom port.",
    });
  } else if (!/\.svgz?(?:$|[?#])/i.test(location)) {
    issues.push({
      code: "bimi-location-extension",
      tone: "warning",
      title: "Logo URL does not end in .svg",
      detail: "Use a stable .svg URL for the widest compatibility.",
    });
  }

  if (authority && !isHttpsUrl(authority)) {
    issues.push({
      code: "bimi-authority-https",
      tone: "fail",
      title: "Certificate URL must use HTTPS",
      detail: "The a= value must be a public HTTPS URL with no credentials or custom port.",
    });
  }

  if (!['brand', 'personal'].includes(avatarPreference)) {
    issues.push({
      code: "bimi-avatar-preference",
      tone: "warning",
      title: "Unknown avatar preference",
      detail: "The current draft defines avp=brand or avp=personal.",
    });
  }

  const knownTags = new Set(["v", "l", "a", "avp", "lps"]);
  for (const key of parsed.orderedKeys) {
    if (!knownTags.has(key)) {
      issues.push({
        code: `unknown-${key}`,
        tone: "warning",
        title: `Unknown ${key}= tag`,
        detail: "Some receivers may ignore unrecognised BIMI tags.",
      });
    }
  }

  const hasFailure = issues.some((issue) => issue.tone === "fail");
  const hasWarning = issues.some((issue) => issue.tone === "warning");
  const status: CheckTone = hasFailure ? "fail" : hasWarning ? "warning" : "pass";

  return { status, issues, location, authority, avatarPreference };
}

export function buildBimiRecord({
  location,
  authority,
  avatarPreference,
}: {
  location: string;
  authority?: string;
  avatarPreference?: "brand" | "personal";
}) {
  const tags = [`v=BIMI1`, `l=${location}`];
  if (authority) tags.push(`a=${authority}`);
  if (avatarPreference === "personal") tags.push("avp=personal");
  return `${tags.join("; ")};`;
}
