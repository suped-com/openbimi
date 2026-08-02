import { describe, expect, it } from "vitest";
import { bimiRecordNames, buildSetupRecord, detectDnsProvider, dnsProviderDetails } from "@/lib/setup";

describe("setup helpers", () => {
  it("detects common DNS providers from authoritative nameservers", () => {
    expect(detectDnsProvider(["ada.ns.cloudflare.com", "bob.ns.cloudflare.com"])).toBe("cloudflare");
    expect(detectDnsProvider(["ns-123.awsdns-45.net"])).toBe("route53");
    expect(detectDnsProvider(["ns1.vercel-dns.com"])).toBe("vercel");
    expect(detectDnsProvider(["ns1.example.net"])).toBe("other");
  });

  it("builds provider-safe host and full record names", () => {
    expect(bimiRecordNames("example.com")).toEqual({
      host: "default._bimi",
      fqdn: "default._bimi.example.com",
    });
    expect(bimiRecordNames("example.com", "marketing").fqdn).toBe("marketing._bimi.example.com");
  });

  it("builds self-asserted and certified BIMI values", () => {
    expect(buildSetupRecord("https://example.com/logo.svg")).toBe(
      "v=BIMI1; l=https://example.com/logo.svg;",
    );
    expect(buildSetupRecord("https://example.com/logo.svg", "https://example.com/cert.pem")).toBe(
      "v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/cert.pem;",
    );
  });

  it("returns plain-language provider instructions", () => {
    expect(dnsProviderDetails("cloudflare").name).toBe("Cloudflare");
    expect(dnsProviderDetails("other").hint).toContain("TXT record");
  });
});
