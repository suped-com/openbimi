import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandMark } from "./brand-mark";

const k12Signatures = [
  'viewBox="0 0 467 472"',
  "M377 64c.39.32",
  "M238.934 80.016c.67.02",
];

describe("BrandMark", () => {
  it("keeps the React and standalone assets on the approved K1.2 geometry", () => {
    const component = renderToStaticMarkup(<BrandMark title="OpenBIMI" />);
    const standalone = readFileSync(join(process.cwd(), "public", "brandmark.svg"), "utf8");

    for (const signature of k12Signatures) {
      expect(component).toContain(signature);
      expect(standalone).toContain(signature);
    }
  });

  it("uses the requested cutout colour for inverse contexts", () => {
    const component = renderToStaticMarkup(<BrandMark cutoutColor="#151819" />);
    expect(component).toContain('fill="#151819"');
  });
});
