export type Guide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  readTime: string;
  intro: string;
  source: { label: string; href: string };
  sections: Array<{
    title: string;
    body: string[];
    bullets?: string[];
    callout?: string;
  }>;
};

export const guides: Guide[] = [
  {
    slug: "bimi-setup",
    title: "Set up BIMI from start to finish",
    description: "A practical four-step path from enforced DMARC to a published BIMI assertion.",
    eyebrow: "Start here",
    readTime: "8 min",
    intro: "BIMI lets a domain publish a preferred brand indicator for participating inboxes. It builds on strong email authentication; it does not replace it, and publishing a logo does not force a mailbox provider to display it.",
    source: { label: "BIMI Group implementation guide", href: "https://bimigroup.org/implementation-guide/" },
    sections: [
      {
        title: "1. Enforce DMARC",
        body: ["Your organisational domain and sending domains need a DMARC policy at enforcement. For broad mailbox compatibility, use p=quarantine or p=reject and apply it to 100% of mail."],
        bullets: ["Authenticate every legitimate sending source with aligned SPF or DKIM.", "Move gradually from p=none only after reviewing DMARC reports.", "Protect subdomains with sp=quarantine or sp=reject if they send mail."],
        callout: "Changing DMARC can affect mail delivery. Inventory every sender before moving to enforcement.",
      },
      {
        title: "2. Prepare the logo",
        body: ["BIMI uses the SVG Tiny Portable/Secure profile. The root SVG element needs version=\"1.2\" and baseProfile=\"tiny-ps\", along with a brand title. Scripts, animation, external resources, and embedded raster images are not allowed."],
        bullets: ["Use a square canvas and centre the artwork.", "Prefer a solid background and keep the file below 32 KB.", "Add a useful <desc> element for accessibility."],
      },
      {
        title: "3. Decide on a mark certificate",
        body: ["A Verified Mark Certificate (VMC) validates a qualifying registered trademark. A Common Mark Certificate (CMC) supports marks that meet the issuer’s requirements without the same trademark path."],
        bullets: ["The core BIMI record can be published without a certificate.", "Gmail and several other major providers require a VMC or CMC for display.", "Certificate issuers determine eligibility and supply the PEM evidence document."],
      },
      {
        title: "4. Publish and test",
        body: ["Publish one TXT record at default._bimi.yourdomain.com. Its value starts with v=BIMI1, includes the HTTPS logo URL in l=, and can include the certificate URL in a=."],
        bullets: ["Keep the SVG and certificate available over trusted HTTPS.", "Wait for DNS propagation, then run the OpenBIMI domain checker.", "Test real authenticated mail and remember that each provider applies its own display policy."],
      },
    ],
  },
  {
    slug: "dmarc",
    title: "DMARC requirements for BIMI",
    description: "Understand enforcement, alignment, percentages, and subdomain policy before publishing a logo.",
    eyebrow: "Foundation",
    readTime: "7 min",
    intro: "BIMI only becomes meaningful after a message passes DMARC. Receivers use that authentication result and the domain’s enforcement policy before considering a published indicator.",
    source: { label: "Current BIMI Internet-Draft", href: "https://datatracker.ietf.org/doc/html/draft-brand-indicators-for-message-identification" },
    sections: [
      {
        title: "What enforcement means",
        body: ["A policy of p=none only requests reports; it does not ask receivers to quarantine or reject unauthenticated mail. BIMI therefore expects quarantine or reject. OpenBIMI checks for pct=100 because that is the most widely documented provider requirement."],
        bullets: ["p=quarantine: ask receivers to treat failing mail as suspicious.", "p=reject: ask receivers not to accept failing mail.", "pct=100: apply the requested policy to all relevant mail."],
      },
      {
        title: "Alignment is checked per message",
        body: ["A public DNS checker can inspect policy, but it cannot prove that a particular message passes DMARC. At least one authentication path must align with the visible From domain: SPF alignment or DKIM alignment."],
        callout: "A green DNS report is not a substitute for examining the Authentication-Results header on real messages.",
      },
      {
        title: "Roll out safely",
        body: ["Start by identifying every platform that sends as your domain. Use aggregate DMARC reports to find authentication gaps, fix or remove unknown sources, then increase enforcement in controlled steps."],
        bullets: ["Do not copy a reject policy blindly onto a production domain.", "Make sure marketing, support, invoicing, CRM, and transactional platforms are included.", "Keep report destinations maintained and monitor changes after enforcement."],
      },
    ],
  },
  {
    slug: "svg-logo",
    title: "Create a BIMI-compatible SVG logo",
    description: "The Tiny PS requirements, common export problems, and practical compatibility guidance.",
    eyebrow: "Logo guide",
    readTime: "6 min",
    intro: "A normal website SVG is not automatically suitable for BIMI. The Portable/Secure profile removes features that could load remote content or behave interactively inside a mail client.",
    source: { label: "BIMI Group SVG guidance", href: "https://bimigroup.org/creating-bimi-svg-logo-files/" },
    sections: [
      {
        title: "Required structure",
        body: ["The document must be valid XML with an SVG root. Set version=\"1.2\" and baseProfile=\"tiny-ps\", remove root x and y attributes, and include a title that identifies the brand."],
        bullets: ["No script or animation elements.", "No external links, fonts, stylesheets, or resources.", "No embedded raster <image> elements.", "No interactive foreignObject or iframe content."],
      },
      {
        title: "Design for unpredictable crops",
        body: ["Mailbox providers can render an indicator as a circle, rounded square, or other mask. Use a square viewBox, centre important artwork, and leave generous space around the edges."],
        bullets: ["A solid background is more reliable than transparency.", "Outlined text is safer than relying on a font.", "Keep contrast strong at small inbox sizes."],
      },
      {
        title: "Gmail compatibility details",
        body: ["Google recommends absolute width and height values of at least 96 pixels, a file no larger than 32 KB, a centred mark, and a useful description element."],
        callout: "Use the free OpenBIMI SVG validator before hosting the final file. It can safely fix profile metadata, but it will not redesign unsupported artwork.",
      },
    ],
  },
  {
    slug: "mark-certificates",
    title: "VMCs, CMCs, and self-asserted BIMI",
    description: "What mark certificates prove, when providers require them, and where they fit in the record.",
    eyebrow: "Certificates",
    readTime: "5 min",
    intro: "A mark certificate is authority evidence: it connects an organisation and a logo through a certificate issuer. It is separate from the TLS certificate used by the web server hosting the files.",
    source: { label: "Google Workspace BIMI setup", href: "https://support.google.com/a/answer/10911320" },
    sections: [
      {
        title: "Verified Mark Certificate (VMC)",
        body: ["A VMC is generally based on a qualifying registered trademark. The issuer validates the organisation, domain, and mark under its current programme rules."],
      },
      {
        title: "Common Mark Certificate (CMC)",
        body: ["A CMC offers another evidence path for eligible marks that do not use the VMC trademark route. Issuers still apply identity, domain, and mark validation requirements."],
      },
      {
        title: "Self-asserted BIMI",
        body: ["The BIMI record format permits an empty or absent a= value, but provider support for self-asserted logos is limited. A technically correct record without evidence may work with some receivers and remain invisible with others."],
        callout: "OpenBIMI can validate the public URL and record syntax. Only an authorised issuer can determine certificate eligibility or validate a certificate application.",
      },
      {
        title: "Publishing the evidence document",
        body: ["Your issuer supplies a PEM file and hosting instructions. Serve it from a stable HTTPS URL, include any required certificate chain in the expected order, then add that URL to the BIMI a= tag."],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
