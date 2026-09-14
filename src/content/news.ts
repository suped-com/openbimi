export type NewsArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  published: string;
  updated?: string;
  announcementDate: string;
  sections: { heading: string; paragraphs: string[] }[];
  sources: { label: string; url: string }[];
  relatedLink: { label: string; href: string };
};

const articles: NewsArticle[] = [
  {
    slug: "bimi-group-local-part-selector-guidance",
    title: "BIMI Group explains sender-specific logos with the lps tag",
    description: "July guidance explains how DNS can select different BIMI logos for addresses on one domain, with support depending on the receiving provider.",
    category: "Standards",
    published: "2026-09-14",
    announcementDate: "2026-07-23",
    sections: [
      {
        heading: "What the guidance covers",
        paragraphs: [
          "On 23 July 2026, the BIMI Group published guidance on the lps (Local-part as Selector) tag. It describes selecting a logo from the sender address through DNS, without adding a BIMI-Selector header to outgoing messages.",
          "This can help organisations that want separate branding for marketing and support addresses on the same domain, or want to limit logo display to selected addresses.",
        ],
      },
      {
        heading: "What to check before using it",
        paragraphs: [
          "Receiver support is still developing. A provider that does not implement lps ignores it and evaluates the standard BIMI record, so the default record still matters.",
          "Before changing production DNS, verify support with your target mailbox providers and test the intended sender addresses. The guidance explains an existing mechanism; it does not announce universal inbox support or a new requirement for senders.",
        ],
      },
    ],
    sources: [{ label: "BIMI Group: Local-part as Selector guidance, 23 July 2026", url: "https://bimigroup.org/how-the-bimi-lps-tag-lets-you-display-different-logos/" }],
    relatedLink: { label: "Check supported inboxes", href: "/supported-inboxes" },
  },
  {
    slug: "bimi-group-logo-change-certificate-guidance",
    title: "BIMI Group outlines certificate steps for a logo change",
    description: "March guidance explains why a BIMI rebrand needs coordinated changes to the logo, mark certificate, and DNS record.",
    category: "Certificates",
    published: "2026-09-14",
    announcementDate: "2026-03-03",
    sections: [
      {
        heading: "Why the update matters",
        paragraphs: [
          "The BIMI Group published logo-change guidance on 3 March 2026. For deployments using a VMC or CMC, replacing the hosted SVG alone is insufficient: the mark certificate is tied to the specific logo.",
          "Teams planning a rebrand should include their certificate authority in the rollout. The updated artwork and supporting evidence need to be assessed before the replacement certificate is issued.",
        ],
      },
      {
        heading: "Plan the change together",
        paragraphs: [
          "Prepare and validate the new SVG, arrange the matching certificate, and make both files publicly accessible before updating the BIMI record. Keep the existing configuration working while the replacement is prepared.",
          "After the DNS change, check that the record and files resolve correctly, then test with the mailbox providers your audience uses. Cached logos and provider policies can affect display. This is maintenance guidance for a rebrand, not a new certificate deadline.",
        ],
      },
    ],
    sources: [{ label: "BIMI Group: Logo update guidance, 3 March 2026", url: "https://bimigroup.org/how-to-update-your-bimi-logo/" }],
    relatedLink: { label: "Validate your BIMI logo", href: "/tools/logo" },
  },
];

export const news = [...articles].sort((a, b) => b.published.localeCompare(a.published) || b.announcementDate.localeCompare(a.announcementDate) || a.slug.localeCompare(b.slug));

export function getNewsArticle(slug: string) {
  return news.find((article) => article.slug === slug);
}

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function newsReadTime(article: NewsArticle) {
  const words = article.sections.flatMap((section) => [section.heading, ...section.paragraphs]).join(" ").split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}
