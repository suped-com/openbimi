import { describe, expect, it } from "vitest";
import { buildBimiRecord, parseBimiRecord, parseDmarcRecord, parseTagRecord } from "@/lib/records";

describe("tag records", () => {
  it("parses tag-value records and catches duplicates", () => {
    const parsed = parseTagRecord("v=BIMI1; l=https://example.com/logo.svg; l=duplicate;");
    expect(parsed.tags.get("v")).toBe("BIMI1");
    expect(parsed.issues[0].code).toBe("duplicate-l");
  });
});

describe("DMARC", () => {
  it("accepts a fully enforced record", () => {
    const result = parseDmarcRecord("v=DMARC1; p=reject; pct=100;");
    expect(result.status).toBe("pass");
    expect(result.policy).toBe("reject");
  });

  it("rejects monitoring and partial coverage", () => {
    expect(parseDmarcRecord("v=DMARC1; p=none;").status).toBe("fail");
    expect(parseDmarcRecord("v=DMARC1; p=quarantine; pct=25;").status).toBe("fail");
  });
});

describe("BIMI", () => {
  it("accepts a valid HTTPS SVG location", () => {
    const result = parseBimiRecord("v=BIMI1; l=https://assets.example.com/logo.svg; a=https://assets.example.com/cert.pem;");
    expect(result.status).toBe("pass");
    expect(result.location).toBe("https://assets.example.com/logo.svg");
  });

  it("requires exact version ordering and HTTPS", () => {
    expect(parseBimiRecord("l=https://example.com/logo.svg; v=BIMI1;").status).toBe("fail");
    expect(parseBimiRecord("v=BIMI1; l=http://example.com/logo.svg;").status).toBe("fail");
  });

  it("builds a compact record", () => {
    expect(buildBimiRecord({ location: "https://example.com/logo.svg", avatarPreference: "personal" }))
      .toBe("v=BIMI1; l=https://example.com/logo.svg; avp=personal;");
  });
});
