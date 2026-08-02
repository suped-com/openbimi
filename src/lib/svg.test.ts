import { describe, expect, it } from "vitest";
import { fixSvgMetadata, validateSvg } from "@/lib/svg";

const validSvg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny-ps" width="96" height="96" viewBox="0 0 96 96"><title>Example</title><desc>Example logo</desc><rect width="96" height="96" fill="#000"/></svg>`;

describe("SVG validation", () => {
  it("accepts a minimal Tiny PS document", () => {
    const report = validateSvg(validSvg);
    expect(report.valid).toBe(true);
    expect(report.compatible).toBe(true);
  });

  it("rejects scripts, animation, raster images, and external references", () => {
    const source = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><animate/><image href="https://example.com/a.png"/></svg>`;
    const codes = validateSvg(source).issues.map((issue) => issue.code);
    expect(codes).toContain("forbidden-script");
    expect(codes).toContain("forbidden-animate");
    expect(codes).toContain("forbidden-image");
    expect(codes).toContain("external-reference");
  });

  it("warns on a non-square canvas", () => {
    const report = validateSvg(validSvg.replace('viewBox="0 0 96 96"', 'viewBox="0 0 120 96"'));
    expect(report.issues.some((issue) => issue.code === "svg-aspect-ratio")).toBe(true);
  });

  it("fixes safe metadata without changing artwork", () => {
    const source = `<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 96 96"><rect width="96" height="96"/></svg>`;
    const fixed = fixSvgMetadata(source, "Acme & Co");
    expect(fixed).toContain('version="1.2"');
    expect(fixed).toContain('baseProfile="tiny-ps"');
    expect(fixed).toContain("<title>Acme &amp; Co</title>");
    expect(fixed).not.toContain(' x="0"');
    expect(validateSvg(fixed).valid).toBe(true);
  });
});
