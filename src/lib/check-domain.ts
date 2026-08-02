import { resolveMx, resolveNs, resolveTxt } from "node:dns/promises";
import { getDomain } from "tldts";
import { normalizeDomain } from "@/lib/domain";
import { checkReachable, fetchSmallText } from "@/lib/network";
import { parseBimiRecord, parseDmarcRecord } from "@/lib/records";
import { validateSvg } from "@/lib/svg";
import type { CheckSection, DomainCheckResult, ValidationIssue } from "@/lib/types";

type TxtLookup = { records: string[]; error: string | null };

async function txt(name: string): Promise<TxtLookup> {
  try {
    const records = await resolveTxt(name);
    return { records: records.map((chunks) => chunks.join("")), error: null };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (["ENODATA", "ENOTFOUND", "NXDOMAIN", "ESERVFAIL"].includes(code ?? "")) {
      return { records: [], error: null };
    }
    return {
      records: [],
      error: error instanceof Error ? error.message : "DNS lookup failed.",
    };
  }
}

async function discoverTxt(
  prefix: string,
  domain: string,
  organizationalDomain: string,
) {
  const directName = `${prefix}.${domain}`;
  const direct = await txt(directName);
  if (direct.records.length || domain === organizationalDomain) {
    return { ...direct, queryName: directName, usedFallback: false };
  }

  const fallbackName = `${prefix}.${organizationalDomain}`;
  const fallback = await txt(fallbackName);
  return { ...fallback, queryName: fallbackName, usedFallback: fallback.records.length > 0 };
}

function noRecordSection(kind: "DMARC" | "BIMI", queryName: string, error: string | null): CheckSection {
  const issue: ValidationIssue = error
    ? {
        code: `${kind.toLowerCase()}-dns-error`,
        tone: "fail",
        title: "DNS lookup failed",
        detail: "The authoritative DNS servers did not return a usable response. Try again shortly.",
      }
    : {
        code: `${kind.toLowerCase()}-missing`,
        tone: "fail",
        title: `${kind} record not found`,
        detail:
          kind === "DMARC"
            ? `Publish a TXT record at ${queryName}.`
            : `Publish a TXT record at ${queryName}.`,
      };
  return {
    status: "fail",
    title: kind,
    summary: error ? "DNS lookup could not be completed." : `No ${kind} record was found.`,
    record: null,
    queryName,
    issues: [issue],
  };
}

export async function checkDomain(input: string, selector = "default"): Promise<DomainCheckResult> {
  const domain = normalizeDomain(input);
  const organizationalDomain = getDomain(domain, { allowPrivateDomains: true }) ?? domain;

  const [dmarcLookup, bimiLookup, rootTxt, mx, nameservers] = await Promise.all([
    discoverTxt("_dmarc", domain, organizationalDomain),
    discoverTxt(`${selector}._bimi`, domain, organizationalDomain),
    txt(domain),
    resolveMx(domain).catch(() => []),
    resolveNs(domain).catch(() => []),
  ]);

  let dmarc: DomainCheckResult["dmarc"];
  if (dmarcLookup.records.length !== 1) {
    const base = noRecordSection("DMARC", dmarcLookup.queryName, dmarcLookup.error);
    if (dmarcLookup.records.length > 1) {
      base.summary = "Multiple DMARC records were found.";
      base.issues = [{
        code: "dmarc-multiple",
        tone: "fail",
        title: "Multiple DMARC records",
        detail: "DMARC permits exactly one policy record. Combine the records before enabling BIMI.",
      }];
    }
    dmarc = {
      ...base,
      policy: null,
      subdomainPolicy: null,
      percentage: 100,
      usedFallback: dmarcLookup.usedFallback,
    };
  } else {
    const parsed = parseDmarcRecord(dmarcLookup.records[0]);
    dmarc = {
      status: parsed.status,
      title: "DMARC enforcement",
      summary:
        parsed.status === "pass"
          ? "DMARC is enforced for 100% of mail."
          : "The DMARC policy does not yet meet BIMI requirements.",
      record: dmarcLookup.records[0],
      queryName: dmarcLookup.queryName,
      issues: parsed.issues,
      policy: parsed.policy,
      subdomainPolicy: parsed.subdomainPolicy,
      percentage: parsed.percentage,
      usedFallback: dmarcLookup.usedFallback,
    };
  }

  let bimi: DomainCheckResult["bimi"];
  if (bimiLookup.records.length !== 1) {
    const base = noRecordSection("BIMI", bimiLookup.queryName, bimiLookup.error);
    if (bimiLookup.records.length > 1) {
      base.summary = "Multiple BIMI records were found.";
      base.issues = [{
        code: "bimi-multiple",
        tone: "fail",
        title: "Multiple BIMI records",
        detail: "A selector must resolve to exactly one BIMI record.",
      }];
    }
    bimi = {
      ...base,
      location: null,
      authority: null,
      avatarPreference: "brand",
      usedFallback: bimiLookup.usedFallback,
    };
  } else {
    const parsed = parseBimiRecord(bimiLookup.records[0]);
    bimi = {
      status: parsed.status,
      title: "BIMI assertion",
      summary:
        parsed.status === "pass"
          ? "The BIMI assertion record is well formed."
          : "The BIMI assertion needs attention.",
      record: bimiLookup.records[0],
      queryName: bimiLookup.queryName,
      issues: parsed.issues,
      location: parsed.location,
      authority: parsed.authority,
      avatarPreference: parsed.avatarPreference,
      usedFallback: bimiLookup.usedFallback,
    };
  }

  const logoPromise: Promise<DomainCheckResult["logo"]> = bimi.location?.startsWith("https://")
    ? (async () => {
        try {
          const remote = await fetchSmallText(bimi.location as string);
          const report = validateSvg(remote.text);
          const contentType = remote.contentType?.split(";", 1)[0].trim().toLowerCase() ?? null;
          if (contentType && !["image/svg+xml", "text/xml", "application/xml", "application/octet-stream"].includes(contentType)) {
            report.issues.unshift({
              code: "svg-content-type",
              tone: "warning",
              title: "Unexpected content type",
              detail: `The server returns ${contentType}; image/svg+xml is preferred.`,
            });
            report.compatible = false;
          }
          return {
            status: report.valid ? (report.compatible ? "pass" : "warning") : "fail",
            summary: report.valid
              ? report.compatible
                ? "The hosted SVG passes all OpenBIMI checks."
                : "The hosted SVG is valid with compatibility warnings."
              : "The hosted SVG does not meet BIMI requirements.",
            url: bimi.location,
            contentType,
            report,
            error: null,
          };
        } catch (error) {
          return {
            status: "fail",
            summary: "The hosted SVG could not be retrieved securely.",
            url: bimi.location,
            contentType: null,
            report: null,
            error: error instanceof Error ? error.message : "The logo fetch failed.",
          };
        }
      })()
    : Promise.resolve({
        status: "fail",
        summary: "No logo URL is available.",
        url: bimi.location,
        contentType: null,
        report: null,
        error: null,
      });

  const [logo, authorityReachable] = await Promise.all([
    logoPromise,
    bimi.authority ? checkReachable(bimi.authority) : Promise.resolve(false),
  ]);
  const authority: DomainCheckResult["authority"] = bimi.authority
    ? {
        status: authorityReachable ? "pass" : "fail",
        summary: authorityReachable
          ? "The mark certificate URL is reachable."
          : "The mark certificate URL could not be reached.",
        url: bimi.authority,
        reachable: authorityReachable,
      }
    : {
        status: "warning",
        summary: "No VMC or CMC is published. Many major mailbox providers require one.",
        url: null,
        reachable: false,
      };

  const corePass = dmarc.status === "pass" && bimi.status !== "fail" && logo.status !== "fail";
  const readiness = corePass ? (authority.status === "pass" ? "ready" : "technical") : "needs-work";
  const scoreParts = [
    dmarc.status === "pass" ? 30 : dmarc.status === "warning" ? 18 : 0,
    bimi.status === "pass" ? 25 : bimi.status === "warning" ? 17 : 0,
    logo.status === "pass" ? 25 : logo.status === "warning" ? 17 : 0,
    authority.status === "pass" ? 20 : 5,
  ];
  const score = scoreParts.reduce((total, value) => total + value, 0);

  return {
    domain,
    organizationalDomain,
    selector,
    checkedAt: new Date().toISOString(),
    readiness,
    score,
    summary:
      readiness === "ready"
        ? "The public BIMI setup is technically complete, including a reachable mark certificate."
        : readiness === "technical"
          ? "The core BIMI configuration is valid. A mark certificate is still needed for broad mailbox support."
          : "One or more required BIMI setup steps still need attention.",
    dmarc,
    bimi,
    logo,
    authority,
    infrastructure: {
      hasSpf: rootTxt.records.some((record) => /^v=spf1(?:\s|$)/i.test(record)),
      hasMx: mx.length > 0,
      nameservers,
    },
  };
}
