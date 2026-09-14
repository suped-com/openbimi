import type { Metadata } from "next";
import type { NewsArticle } from "@/content/news";

export const newsOrigin = "https://openbimi.com";
export const newsDescription = "BIMI news and updates on inbox support, mark certificates, email authentication, and the standards behind sender logos.";

export function newsMetadata(title: string, description: string, path: string, article?: NewsArticle): Metadata {
  const url = `${newsOrigin}${path}`;
  const socialTitle = `${title} · OpenBIMI`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url, types: { "application/rss+xml": `${newsOrigin}/news/rss.xml` } },
    openGraph: {
      title: socialTitle, description, url, siteName: "OpenBIMI", locale: "en_AU",
      images: [{ url: `${newsOrigin}/opengraph-image`, width: 1200, height: 630, alt: "OpenBIMI" }],
      ...(article ? { type: "article" as const, publishedTime: `${article.published}T00:00:00Z`, modifiedTime: `${article.updated ?? article.published}T00:00:00Z`, section: article.category } : { type: "website" as const }),
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [`${newsOrigin}/opengraph-image`] },
  };
}

export function articleStructuredData(article: NewsArticle) {
  const url = `${newsOrigin}/news/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle", "@id": `${url}#article`, url,
        headline: article.title, description: article.description,
        datePublished: `${article.published}T00:00:00Z`, dateModified: `${article.updated ?? article.published}T00:00:00Z`,
        author: { "@type": "Organization", name: "OpenBIMI", url: newsOrigin },
        publisher: { "@type": "Organization", name: "OpenBIMI", url: newsOrigin },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: [`${newsOrigin}/opengraph-image`], articleSection: article.category, inLanguage: "en",
        citation: article.sources.map((source) => source.url),
      },
      {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: newsOrigin },
          { "@type": "ListItem", position: 2, name: "News", item: `${newsOrigin}/news` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };
}

export function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
}

export function newsRss(articles: NewsArticle[]) {
  const lastUpdated = articles.map((article) => article.updated ?? article.published).sort().at(-1);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>OpenBIMI News</title><link>${newsOrigin}/news</link><description>${escapeXml(newsDescription)}</description><language>en</language>
<atom:link href="${newsOrigin}/news/rss.xml" rel="self" type="application/rss+xml"/>
${lastUpdated ? `<lastBuildDate>${new Date(`${lastUpdated}T00:00:00Z`).toUTCString()}</lastBuildDate>` : ""}
${articles.map((article) => `<item><title>${escapeXml(article.title)}</title><link>${newsOrigin}/news/${article.slug}</link><guid isPermaLink="true">${newsOrigin}/news/${article.slug}</guid><description>${escapeXml(article.description)}</description><pubDate>${new Date(`${article.published}T00:00:00Z`).toUTCString()}</pubDate><category>${escapeXml(article.category)}</category></item>`).join("\n")}
</channel></rss>`;
}
