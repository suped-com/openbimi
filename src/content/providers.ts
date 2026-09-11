export type Certificate = "vmc" | "cmc" | "none";
export type Coverage = "verified" | "logo" | "approval" | "unknown" | "none";

export const certificateOptions = [
  {
    id: "vmc",
    name: "VMC",
    fullName: "Verified Mark Certificate",
    headline: "A logo. And Gmail’s blue check.",
    description:
      "For a registered trademark or another qualifying mark. An issuer verifies your organization and logo rights.",
    takeaway: "The widest documented certificate support",
  },
  {
    id: "cmc",
    name: "CMC",
    fullName: "Common Mark Certificate",
    headline: "Your logo, without a trademark.",
    description:
      "A registered trademark isn’t required. Your logo must meet the issuer’s eligibility and prior-use requirements.",
    takeaway: "Gmail logo display, without the blue check",
  },
  {
    id: "none",
    name: "No certificate",
    fullName: "Self-asserted BIMI",
    headline: "Start with your logo and DNS.",
    description:
      "Publish a compliant logo and BIMI record. Certificate-free display is available at a smaller set of providers.",
    takeaway: "A starting point for Yahoo, AOL and Fastmail",
  },
] as const satisfies ReadonlyArray<{
  id: Certificate;
  name: string;
  fullName: string;
  headline: string;
  description: string;
  takeaway: string;
}>;

export const coverageLabels: Record<Coverage, string> = {
  verified: "Logo + blue check",
  logo: "Logo",
  approval: "Approval needed",
  unknown: "Check policy",
  none: "No BIMI logo",
};

export const directorySource = "https://bimigroup.org/bimi-infographic/";

export type Provider = {
  id: string;
  name: string;
  logo: string;
  context: string;
  note: string;
  source: string;
  coverage: Record<Certificate, Coverage>;
};

export const providers: Provider[] = [
  {
    id: "gmail",
    name: "Gmail",
    logo: "gmail.png",
    context: "Google Workspace too",
    note: "Both certificates can unlock a logo. Only a VMC qualifies for Gmail’s blue verification checkmark.",
    source: "https://support.google.com/a/answer/10911320",
    coverage: { vmc: "verified", cmc: "logo", none: "none" },
  },
  {
    id: "apple",
    name: "Apple Mail",
    logo: "apple.png",
    context: "Depends on the receiving mail provider",
    note: "Requires a participating provider to validate the evidence and add BIMI headers. Apple documents VMCs, but does not explicitly name CMCs. Supported from iOS 16 / macOS 13.",
    source: "https://developer.apple.com/support/bimi/",
    coverage: { vmc: "logo", cmc: "unknown", none: "none" },
  },
  {
    id: "yahoo",
    name: "Yahoo Mail & AOL",
    logo: "yahoo.png",
    context: "Certificate optional",
    note: "For eligible bulk senders with sufficient reputation and engagement. Yahoo does not require a certificate; adding one does not guarantee display.",
    source: "https://senders.yahooinc.com/bimi/",
    coverage: { vmc: "logo", cmc: "logo", none: "logo" },
  },
  {
    id: "fastmail",
    name: "Fastmail",
    logo: "fastmail.png",
    context: "Certificate optional",
    note: "Documents support without a VMC. Requires enforced DMARC and a compliant SVG logo smaller than 16 KB.",
    source:
      "https://www.fastmail.help/hc/en-us/articles/7002542139663-Using-BIMI-in-Fastmail",
    coverage: { vmc: "logo", cmc: "logo", none: "logo" },
  },
  {
    id: "laposte",
    name: "La Poste",
    logo: "laposte.png",
    context: "laposte.net · France",
    note: "A self-asserted logo needs approval from the postmaster team. VMC support is documented; confirm the treatment of a CMC before purchasing.",
    source:
      "https://postmaster.laposte.net/contents/ajouter-le-logo-de-votre-marque-aux-e-mails-que-vous-envoyez",
    coverage: { vmc: "logo", cmc: "unknown", none: "approval" },
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    logo: "zoho.png",
    context: "VMC documented",
    note: "Zoho describes VMCs as required for its BIMI logo display. Its public guidance does not explicitly confirm CMC acceptance.",
    source:
      "https://www.zoho.com/zeptomail/glossary/what-is-verified-mark-certificate.html",
    coverage: { vmc: "logo", cmc: "unknown", none: "none" },
  },
  {
    id: "zone",
    name: "Zone Webmail",
    logo: "zone.png",
    context: "webmail.ee · Estonia",
    note: "Zone explicitly supports both VMC and CMC logos and displays them the same way. Certificate-free acceptance is not confirmed in this guidance.",
    source:
      "https://www.zone.ee/blogi/common-mark-certificate-rohkem-voimalusi-e-posti-nahtavuse-ja-turvalisuse-tostmiseks/",
    coverage: { vmc: "logo", cmc: "logo", none: "unknown" },
  },
  {
    id: "docomo",
    name: "NTT docomo",
    logo: "docomo.png",
    context: "Docomo Mail · Japan",
    note: "Docomo describes receiver validation of a VMC and logo after DMARC passes. Its launch documentation places the logo in message headers; it does not confirm CMC or certificate-free acceptance.",
    source:
      "https://www.docomo.ne.jp/binary/pdf/info/news_release/topics_240522_00.pdf",
    coverage: { vmc: "logo", cmc: "unknown", none: "unknown" },
  },
  {
    id: "outlook",
    name: "Outlook & Microsoft 365",
    logo: "microsoft.jpg",
    context: "No receiving support",
    note: "Outlook and Exchange Online do not render BIMI logos. Microsoft sending tools can still publish BIMI for recipients at other providers.",
    source:
      "https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/bimi-support",
    coverage: { vmc: "none", cmc: "none", none: "none" },
  },
];

// Adoption is not a certificate-acceptance policy. Do not extrapolate from support.
export const additionalProviders = [
  { name: "au", logo: "au.png", context: "KDDI · Japan" },
  { name: "Comcast", logo: "comcast.png", context: "United States" },
  { name: "GMX", logo: "gmx.jpg", context: "Germany" },
  { name: "Onet Poczta", logo: "onet.png", context: "Poland" },
  { name: "WEB.DE", logo: "webde.jpg", context: "Germany" },
  { name: "Zoner", logo: "zoner.png", context: "Czechia" },
  {
    name: "Cloudmark",
    logo: "cloudmark.png",
    context: "Proofpoint · mail infrastructure",
  },
];

export const consideringProviders = [
  { name: "Atmail", logo: "atmail.png" },
  { name: "BT", logo: "bt.png" },
  { name: "mail.com", logo: "mailcom.jpg" },
  { name: "Nifty", logo: "nifty.avif" },
  { name: "Qualitia", logo: "qualitia.png" },
  { name: "Seznam.cz", logo: "seznam.jpg" },
  { name: "Yahoo! Japan", logo: "yahoo-japan.png" },
];
