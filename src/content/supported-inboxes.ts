export type Support = "yes" | "no" | "unconfirmed" | "approval" | "varies";
export type EvidenceSource = { label: string; url: string };
export type SupportedInbox = {
  id: string;
  name: string;
  detail: string;
  logo: string;
  vmc: Support;
  cmc: Support;
  noCertificate: Support;
  note: string;
  sources: EvidenceSource[];
};

export const reviewedOn = "14 September 2026";
export const adoptionSource = "https://bimigroup.org/bimi-infographic/";
const yahooSource = {
  label: "Yahoo",
  url: "https://senders.yahooinc.com/bimi/",
};
const digicertSource = {
  label: "DigiCert",
  url: "https://www.digicert.com/tls-ssl/verified-mark-certificates",
};

// See docs/supported-inboxes-research.md for the evidence and classification rules.
// Certificate-free display does not establish CMC validation.
export const supportedInboxes: SupportedInbox[] = [
  {
    id: "gmail",
    name: "Gmail",
    detail: "Also Google Workspace",
    logo: "gmail.png",
    vmc: "yes",
    cmc: "yes",
    noCertificate: "no",
    note: "VMC: logo + blue checkmark. CMC: logo only.",
    sources: [
      {
        label: "Google",
        url: "https://knowledge.workspace.google.com/admin/security/set-up-bimi",
      },
    ],
  },
  {
    id: "apple",
    name: "Apple Mail",
    detail: "Mail app / iCloud",
    logo: "apple.png",
    vmc: "yes",
    cmc: "unconfirmed",
    noCertificate: "no",
    note: "Needs a participating mail provider to verify the evidence. Apple does not explicitly confirm CMCs.",
    sources: [
      { label: "Apple", url: "https://developer.apple.com/support/bimi/" },
    ],
  },
  {
    id: "yahoo",
    name: "Yahoo Mail / AOL",
    detail: "Bulk senders",
    logo: "yahoo.png",
    vmc: "yes",
    cmc: "unconfirmed",
    noCertificate: "yes",
    note: "Certificate-free logos depend on reputation and engagement. VMCs inform eligibility; CMC validation is not documented.",
    sources: [yahooSource],
  },
  {
    id: "fastmail",
    name: "Fastmail",
    detail: "Web and apps",
    logo: "fastmail.png",
    vmc: "yes",
    cmc: "unconfirmed",
    noCertificate: "yes",
    note: "Certificate-free display is supported. SVG must be under 16 KB; CMC validation is not explicitly documented.",
    sources: [
      {
        label: "Fastmail",
        url: "https://www.fastmail.help/hc/en-us/articles/7002542139663-Using-BIMI-in-Fastmail",
      },
      digicertSource,
    ],
  },
  {
    id: "zone",
    name: "Zone Webmail",
    detail: "webmail.ee",
    logo: "zone.png",
    vmc: "yes",
    cmc: "yes",
    noCertificate: "no",
    note: "Explicitly requires a VMC or CMC, with aligned DMARC and a valid DKIM signature.",
    sources: [
      { label: "Zone", url: "https://www.zone.ee/help/en/kb/bimi-en/" },
    ],
  },
  {
    id: "laposte",
    name: "La Poste",
    detail: "laposte.net",
    logo: "laposte.png",
    vmc: "yes",
    cmc: "approval",
    noCertificate: "approval",
    note: "Without a VMC, request postmaster approval. A CMC is not documented as a substitute for that approval.",
    sources: [
      {
        label: "La Poste",
        url: "https://postmaster.laposte.net/contents/ajouter-le-logo-de-votre-marque-aux-e-mails-que-vous-envoyez",
      },
    ],
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    detail: "VMC documented",
    logo: "zoho.png",
    vmc: "yes",
    cmc: "unconfirmed",
    noCertificate: "no",
    note: "Zoho describes VMCs as required. No explicit receiver policy confirming CMC acceptance was found.",
    sources: [
      {
        label: "Zoho",
        url: "https://www.zoho.com/zeptomail/glossary/what-is-verified-mark-certificate.html",
      },
      digicertSource,
    ],
  },
  {
    id: "au",
    name: "au Mail",
    detail: "au.com / ezweb.ne.jp",
    logo: "au.png",
    vmc: "yes",
    cmc: "unconfirmed",
    noCertificate: "unconfirmed",
    note: "KDDI documents VMC verification. CMC and certificate-free policies are not specified.",
    sources: [
      {
        label: "KDDI",
        url: "https://www.au.com/information/topic/mobile/2023-024/",
      },
    ],
  },
  {
    id: "docomo",
    name: "NTT docomo",
    detail: "Docomo Mail",
    logo: "docomo.png",
    vmc: "yes",
    cmc: "unconfirmed",
    noCertificate: "unconfirmed",
    note: "Documents VMC validation and logos in message headers. Other certificate options are not specified.",
    sources: [
      {
        label: "Docomo (PDF)",
        url: "https://www.docomo.ne.jp/binary/pdf/info/news_release/topics_240522_00.pdf",
      },
    ],
  },
  {
    id: "zoner",
    name: "Zoner / Zmail",
    detail: "Czechia",
    logo: "zoner.png",
    vmc: "yes",
    cmc: "no",
    noCertificate: "no",
    note: "Published receiver rules require a VMC to prove the right to use the logo.",
    sources: [
      {
        label: "Zoner",
        url: "https://napoveda.czechia.com/clanek/podpora-bimi-a-vmc-v-zmailu/",
      },
    ],
  },
  {
    id: "onet",
    name: "Onet Poczta",
    detail: "Poland",
    logo: "onet.png",
    vmc: "yes",
    cmc: "unconfirmed",
    noCertificate: "unconfirmed",
    note: "DigiCert lists VMC compatibility. Onet confirms BIMI, but does not publish its other certificate rules.",
    sources: [
      {
        label: "Onet",
        url: "https://pomoc.poczta.onet.pl/bimi-or-brand-indicators-for-message-identification/bimi-w-onet-poczcie/dyeb0tz",
      },
      digicertSource,
    ],
  },
  {
    id: "gmx",
    name: "GMX",
    detail: "Listed by BIMI Group",
    logo: "gmx.jpg",
    vmc: "unconfirmed",
    cmc: "unconfirmed",
    noCertificate: "unconfirmed",
    note: "BIMI is listed, but certificate rules are not confirmed. The separate trustedDialog service is not evidence of BIMI coverage.",
    sources: [{ label: "BIMI Group", url: adoptionSource }],
  },
  {
    id: "webde",
    name: "WEB.DE",
    detail: "Listed by BIMI Group",
    logo: "webde.jpg",
    vmc: "unconfirmed",
    cmc: "unconfirmed",
    noCertificate: "unconfirmed",
    note: "BIMI is listed, but certificate rules are not confirmed. The directory’s linked provider page is no longer available.",
    sources: [{ label: "BIMI Group", url: adoptionSource }],
  },
  {
    id: "comcast",
    name: "Comcast / Xfinity",
    detail: "comcast.net",
    logo: "comcast.png",
    vmc: "varies",
    cmc: "varies",
    noCertificate: "varies",
    note: "Accounts moved to Yahoo use Yahoo’s rules. Certificate policies for remaining legacy accounts are unconfirmed.",
    sources: [
      {
        label: "Xfinity",
        url: "https://www.xfinity.com/support/articles/yahoo-email-migration-overview",
      },
      yahooSource,
    ],
  },
  {
    id: "outlook",
    name: "Outlook / Microsoft 365",
    detail: "No BIMI display",
    logo: "microsoft.jpg",
    vmc: "no",
    cmc: "no",
    noCertificate: "no",
    note: "Listed as not supporting BIMI. Logos from other Microsoft features are separate.",
    sources: [{ label: "BIMI Group", url: adoptionSource }],
  },
];

export const consideringInboxes = [
  "Atmail",
  "BT",
  "mail.com",
  "Nifty",
  "Qualitia",
  "Seznam.cz",
  "Yahoo! Japan",
];
