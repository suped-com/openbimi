import { buildBimiRecord } from "@/lib/records";

export type DnsProvider =
  | "cloudflare"
  | "route53"
  | "godaddy"
  | "namecheap"
  | "google"
  | "vercel"
  | "other";

const providers: Record<DnsProvider, { name: string; hint: string }> = {
  cloudflare: {
    name: "Cloudflare",
    hint: "Open DNS > Records, choose Add record, select TXT, and keep the record DNS-only.",
  },
  route53: {
    name: "Amazon Route 53",
    hint: "Open the hosted zone, create a TXT record, and paste the value inside a single value field.",
  },
  godaddy: {
    name: "GoDaddy",
    hint: "Open Manage DNS, add a TXT record, and enter only the host label shown below.",
  },
  namecheap: {
    name: "Namecheap",
    hint: "Open Advanced DNS, add a TXT Record, and enter only the host label shown below.",
  },
  google: {
    name: "Google Cloud DNS",
    hint: "Open the managed zone, add a TXT record set, and paste the value as one string.",
  },
  vercel: {
    name: "Vercel DNS",
    hint: "Open the domain in Vercel, add a TXT record, and enter only the host label shown below.",
  },
  other: {
    name: "your DNS provider",
    hint: "Create a TXT record. Some DNS panels want the full name; others automatically append your domain.",
  },
};

export function detectDnsProvider(nameservers: string[]): DnsProvider {
  const value = nameservers.join(" ").toLowerCase();
  if (value.includes("cloudflare.com")) return "cloudflare";
  if (value.includes("awsdns-")) return "route53";
  if (value.includes("domaincontrol.com")) return "godaddy";
  if (value.includes("registrar-servers.com")) return "namecheap";
  if (value.includes("googledomains.com") || value.includes("google.com")) return "google";
  if (value.includes("vercel-dns.com") || value.includes("zeit-world")) return "vercel";
  return "other";
}

export function dnsProviderDetails(provider: DnsProvider) {
  return providers[provider];
}

export function bimiRecordNames(domain: string, selector = "default") {
  return {
    host: `${selector}._bimi`,
    fqdn: `${selector}._bimi.${domain}`,
  };
}

export function buildSetupRecord(location: string, authority?: string) {
  return buildBimiRecord({ location, authority: authority || undefined });
}
