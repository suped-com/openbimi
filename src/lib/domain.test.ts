import { describe, expect, it } from "vitest";
import { isHttpsUrl, isValidDomain, isValidSelector, normalizeDomain } from "@/lib/domain";

describe("domain helpers", () => {
  it("normalises URLs and email addresses", () => {
    expect(normalizeDomain("https://WWW.Example.com/path")).toBe("www.example.com");
    expect(normalizeDomain("hello@Example.com")).toBe("example.com");
    expect(normalizeDomain("example.com.")).toBe("example.com");
  });

  it("validates public domains and selectors", () => {
    expect(isValidDomain("mail.example.com")).toBe(true);
    expect(isValidDomain("localhost")).toBe(false);
    expect(isValidDomain("-bad.example")).toBe(false);
    expect(isValidSelector("seasonal-2026")).toBe(true);
    expect(isValidSelector("bad_selector")).toBe(false);
  });

  it("only accepts plain HTTPS URLs", () => {
    expect(isHttpsUrl("https://assets.example.com/logo.svg")).toBe(true);
    expect(isHttpsUrl("http://assets.example.com/logo.svg")).toBe(false);
    expect(isHttpsUrl("https://user:pass@example.com/logo.svg")).toBe(false);
    expect(isHttpsUrl("https://example.com:8443/logo.svg")).toBe(false);
  });
});
