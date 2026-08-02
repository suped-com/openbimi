import { getDomain } from "tldts";

export type HeaderAuthResult = {
  mechanism: "dkim" | "spf" | "dmarc";
  result: string;
  domain: string | null;
  selector: string | null;
  aligned: boolean | null;
};

export type HeaderInspection = {
  fromDomain: string | null;
  receiver: string | null;
  results: HeaderAuthResult[];
  dkimSignatures: Array<{ domain: string | null; selector: string | null }>;
  bimiHeaders: string[];
  warnings: string[];
};

function unfoldHeaders(source: string) {
  return source.replace(/\r\n/g, "\n").replace(/\n[ \t]+/g, " ");
}

function headerMap(source: string) {
  const map = new Map<string, string[]>();
  for (const line of unfoldHeaders(source).split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    map.set(name, [...(map.get(name) ?? []), value]);
  }
  return map;
}

function cleanDomain(value?: string | null) {
  return value?.trim().replace(/^@/, "").replace(/[;>),]+$/, "").toLowerCase() || null;
}

function domainFromAddress(value?: string) {
  const match = value?.match(/@([a-z0-9.-]+)(?:>|\s|$)/i);
  return cleanDomain(match?.[1]);
}

function aligned(left: string | null, right: string | null) {
  if (!left || !right) return null;
  const leftOrg = getDomain(left, { allowPrivateDomains: true }) || left;
  const rightOrg = getDomain(right, { allowPrivateDomains: true }) || right;
  return leftOrg.toLowerCase() === rightOrg.toLowerCase();
}

function tag(value: string, name: string) {
  return value.match(new RegExp(`(?:^|[;\\s])${name}=([^;\\s]+)`, "i"))?.[1] ?? null;
}

export function inspectEmailHeaders(source: string): HeaderInspection {
  const headers = headerMap(source);
  const fromDomain = domainFromAddress(headers.get("from")?.[0]);
  const authentication = headers.get("authentication-results") ?? [];
  const results: HeaderAuthResult[] = [];

  for (const line of authentication) {
    const matches = [...line.matchAll(/(?:^|;)\s*(dkim|spf|dmarc)=([a-z0-9_-]+)/gi)];
    for (let index = 0; index < matches.length; index += 1) {
      const match = matches[index];
      const mechanism = match[1].toLowerCase() as HeaderAuthResult["mechanism"];
      const segment = line.slice(match.index, matches[index + 1]?.index ?? line.length);
      const domain = mechanism === "dkim"
        ? cleanDomain(tag(segment, "header.d") || tag(segment, "header.i")?.split("@").pop())
        : mechanism === "spf"
          ? domainFromAddress(tag(segment, "smtp.mailfrom") || "") || cleanDomain(tag(segment, "smtp.mailfrom"))
          : cleanDomain(tag(segment, "header.from"));
      results.push({
        mechanism,
        result: match[2].toLowerCase(),
        domain,
        selector: mechanism === "dkim" ? cleanDomain(tag(segment, "header.s")) : null,
        aligned: mechanism === "dmarc" ? null : aligned(fromDomain, domain),
      });
    }
  }

  const dkimSignatures = (headers.get("dkim-signature") ?? []).map((value) => ({
    domain: cleanDomain(tag(value, "d")),
    selector: cleanDomain(tag(value, "s")),
  }));
  const bimiHeaders = [...headers.entries()]
    .filter(([name]) => name.startsWith("bimi-") || name === "bimi")
    .flatMap(([name, values]) => values.map((value) => `${name}: ${value}`));
  const warnings: string[] = [];
  if (!fromDomain) warnings.push("No RFC5322.From domain could be parsed.");
  if (!authentication.length) warnings.push("No Authentication-Results header was found. Inspect the raw source from the receiving mailbox, not the sent copy.");
  if (authentication.length && !results.length) warnings.push("Authentication-Results was present, but no DKIM, SPF, or DMARC result could be parsed.");

  return {
    fromDomain,
    receiver: authentication[0]?.split(";", 1)[0]?.trim() || null,
    results,
    dkimSignatures,
    bimiHeaders,
    warnings,
  };
}
