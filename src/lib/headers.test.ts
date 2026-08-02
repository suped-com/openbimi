import { describe, expect, it } from "vitest";
import { inspectEmailHeaders } from "@/lib/headers";

const sample = `From: Example <news@example.com>
Authentication-Results: mx.example.net;
 dkim=pass header.i=@mail.example.com header.s=marketing;
 spf=pass smtp.mailfrom=bounce.example.com;
 dmarc=pass header.from=example.com
DKIM-Signature: v=1; a=rsa-sha256; d=mail.example.com; s=marketing;
BIMI-Location: v=BIMI1; l=https://example.com/logo.svg`;

describe("email header inspector", () => {
  it("parses observed authentication and relaxed alignment", () => {
    const result = inspectEmailHeaders(sample);
    expect(result.fromDomain).toBe("example.com");
    expect(result.receiver).toBe("mx.example.net");
    expect(result.results).toEqual(expect.arrayContaining([
      expect.objectContaining({ mechanism: "dkim", result: "pass", domain: "mail.example.com", selector: "marketing", aligned: true }),
      expect.objectContaining({ mechanism: "spf", result: "pass", domain: "bounce.example.com", aligned: true }),
      expect.objectContaining({ mechanism: "dmarc", result: "pass", domain: "example.com" }),
    ]));
    expect(result.bimiHeaders).toHaveLength(1);
  });

  it("warns when receiver authentication evidence is absent", () => {
    const result = inspectEmailHeaders("From: Sender <sender@example.com>");
    expect(result.warnings[0]).toContain("Authentication-Results");
  });
});
