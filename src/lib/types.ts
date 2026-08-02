export type CheckTone = "pass" | "warning" | "fail" | "info";

export type ValidationIssue = {
  code: string;
  tone: CheckTone;
  title: string;
  detail: string;
  fixable?: boolean;
};

export type SvgReport = {
  valid: boolean;
  compatible: boolean;
  issues: ValidationIssue[];
  stats: {
    bytes: number;
    title: string | null;
    viewBox: string | null;
    width: string | null;
    height: string | null;
  };
};

export type CheckSection = {
  status: CheckTone;
  title: string;
  summary: string;
  record: string | null;
  queryName: string;
  issues: ValidationIssue[];
};

export type DomainCheckResult = {
  domain: string;
  organizationalDomain: string;
  selector: string;
  checkedAt: string;
  readiness: "ready" | "technical" | "needs-work";
  score: number;
  summary: string;
  dmarc: CheckSection & {
    policy: string | null;
    subdomainPolicy: string | null;
    percentage: number;
    usedFallback: boolean;
  };
  bimi: CheckSection & {
    location: string | null;
    authority: string | null;
    avatarPreference: string;
    usedFallback: boolean;
  };
  logo: {
    status: CheckTone;
    summary: string;
    url: string | null;
    contentType: string | null;
    report: SvgReport | null;
    error: string | null;
  };
  authority: {
    status: CheckTone;
    summary: string;
    url: string | null;
    reachable: boolean;
  };
  infrastructure: {
    hasSpf: boolean;
    hasMx: boolean;
    nameservers: string[];
  };
};
