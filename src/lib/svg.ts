import { XMLValidator } from "fast-xml-parser";
import type { SvgReport, ValidationIssue } from "@/lib/types";

const forbiddenElements = [
  "script",
  "animate",
  "animateMotion",
  "animateTransform",
  "set",
  "foreignObject",
  "iframe",
  "audio",
  "video",
  "image",
];

function getRootAttributes(source: string) {
  const match = source.match(/<svg\b([^>]*)>/i);
  if (!match) return { root: null, attributes: new Map<string, string>() };

  const attributes = new Map<string, string>();
  const attributePattern = /([:\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g;
  for (const item of match[1].matchAll(attributePattern)) {
    attributes.set(item[1], item[3]);
  }
  return { root: match[0], attributes };
}

function textContent(source: string, tag: string) {
  const match = source.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1].replace(/<[^>]+>/g, "").trim() || null;
}

export function validateSvg(source: string): SvgReport {
  const bytes = new TextEncoder().encode(source).byteLength;
  const issues: ValidationIssue[] = [];
  const xmlResult = XMLValidator.validate(source, {
    allowBooleanAttributes: false,
    unpairedTags: [],
  });

  if (xmlResult !== true) {
    issues.push({
      code: "xml-invalid",
      tone: "fail",
      title: "The SVG is not valid XML",
      detail: xmlResult.err.msg || "The document could not be parsed.",
    });
  }

  const { root, attributes } = getRootAttributes(source);
  if (!root) {
    issues.push({
      code: "svg-root",
      tone: "fail",
      title: "SVG root element not found",
      detail: "The document must contain a top-level <svg> element.",
    });
  }

  if (/<!DOCTYPE|<!ENTITY/i.test(source)) {
    issues.push({
      code: "xml-entities",
      tone: "fail",
      title: "Document types and entities are not allowed",
      detail: "Remove DOCTYPE and ENTITY declarations from the SVG.",
    });
  }

  if (attributes.get("version") !== "1.2") {
    issues.push({
      code: "svg-version",
      tone: "fail",
      title: "Set SVG version to 1.2",
      detail: 'The root element must include version="1.2".',
      fixable: true,
    });
  }

  if (attributes.get("baseProfile") !== "tiny-ps") {
    issues.push({
      code: "svg-profile",
      tone: "fail",
      title: "Set the Tiny PS profile",
      detail: 'The root element must include baseProfile="tiny-ps".',
      fixable: true,
    });
  }

  if (attributes.has("x") || attributes.has("y")) {
    issues.push({
      code: "svg-position",
      tone: "fail",
      title: "Remove root x and y attributes",
      detail: "SVG Tiny PS does not allow x= or y= on the root element.",
      fixable: true,
    });
  }

  const title = textContent(source, "title");
  const description = textContent(source, "desc");
  if (!title) {
    issues.push({
      code: "svg-title",
      tone: "fail",
      title: "Add a title",
      detail: "Include a <title> containing the organisation or brand name.",
      fixable: true,
    });
  }
  if (!description) {
    issues.push({
      code: "svg-description",
      tone: "warning",
      title: "Add an accessible description",
      detail: "A short <desc> improves accessibility and Gmail compatibility.",
      fixable: true,
    });
  }

  for (const element of forbiddenElements) {
    if (new RegExp(`<${element}\\b`, "i").test(source)) {
      issues.push({
        code: `forbidden-${element.toLowerCase()}`,
        tone: "fail",
        title: `<${element}> is not allowed`,
        detail: "BIMI logos cannot contain scripts, animation, embedded raster images, or interactive content.",
      });
    }
  }

  const hrefPattern = /(?:href|xlink:href)\s*=\s*["']\s*([^"']+)["']/gi;
  for (const match of source.matchAll(hrefPattern)) {
    if (!match[1].startsWith("#")) {
      issues.push({
        code: "external-reference",
        tone: "fail",
        title: "External reference found",
        detail: "BIMI SVGs may only reference elements inside the same document.",
      });
      break;
    }
  }

  if (/url\(\s*["']?(?!#)/i.test(source) || /@import/i.test(source)) {
    issues.push({
      code: "external-style-reference",
      tone: "fail",
      title: "External style reference found",
      detail: "Remove imported styles and external url() references.",
    });
  }

  if (bytes > 32 * 1024) {
    issues.push({
      code: "svg-size",
      tone: "warning",
      title: "File is larger than 32 KB",
      detail: "Reduce unnecessary metadata and path complexity for broad mailbox compatibility.",
    });
  }

  const viewBox = attributes.get("viewBox") ?? attributes.get("viewbox") ?? null;
  if (!viewBox) {
    issues.push({
      code: "svg-viewbox",
      tone: "warning",
      title: "Add a square viewBox",
      detail: "A viewBox helps the logo scale consistently across inboxes.",
    });
  } else {
    const values = viewBox.trim().split(/[\s,]+/).map(Number);
    if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
      issues.push({
        code: "svg-viewbox-invalid",
        tone: "fail",
        title: "The viewBox is invalid",
        detail: "Use four numeric values, for example viewBox=\"0 0 96 96\".",
      });
    } else if (Math.abs(values[2] - values[3]) > 0.001) {
      issues.push({
        code: "svg-aspect-ratio",
        tone: "warning",
        title: "The canvas is not square",
        detail: "BIMI logos should use a square aspect ratio.",
      });
    }
  }

  const width = attributes.get("width") ?? null;
  const height = attributes.get("height") ?? null;
  if (width?.includes("%") || height?.includes("%")) {
    issues.push({
      code: "svg-relative-size",
      tone: "warning",
      title: "Use absolute pixel dimensions",
      detail: "Gmail recommends width and height in absolute pixels, at least 96 × 96.",
    });
  }

  const hasFailure = issues.some((issue) => issue.tone === "fail");
  const hasWarning = issues.some((issue) => issue.tone === "warning");

  if (!hasFailure && !hasWarning) {
    issues.push({
      code: "svg-ready",
      tone: "pass",
      title: "BIMI-ready SVG",
      detail: "No structural or compatibility issues were found.",
    });
  }

  return {
    valid: !hasFailure,
    compatible: !hasFailure && !hasWarning,
    issues,
    stats: { bytes, title, viewBox, width, height },
  };
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function fixSvgMetadata(source: string, brandName: string) {
  const { root } = getRootAttributes(source);
  if (!root) return source;

  let nextRoot = root
    .replace(/\s(?:x|y)\s*=\s*(["']).*?\1/gi, "")
    .replace(/\sversion\s*=\s*(["']).*?\1/i, "")
    .replace(/\sbaseProfile\s*=\s*(["']).*?\1/i, "");
  nextRoot = nextRoot.replace(/>$/, ' version="1.2" baseProfile="tiny-ps">');

  let output = source.replace(root, nextRoot);
  const safeName = escapeXml(brandName.trim() || "Brand logo");
  const additions: string[] = [];
  if (!textContent(output, "title")) additions.push(`<title>${safeName}</title>`);
  if (!textContent(output, "desc")) additions.push(`<desc>${safeName} brand indicator</desc>`);
  if (additions.length) output = output.replace(nextRoot, `${nextRoot}${additions.join("")}`);
  return output;
}
