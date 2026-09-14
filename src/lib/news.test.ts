import { describe, expect, it } from "vitest";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { news } from "@/content/news";
import { articleStructuredData, newsMetadata, newsRss } from "@/lib/news";
import sitemap from "@/app/sitemap";

describe("news publishing contract", () => {
  it("requires unique slugs, real dates, original content, and primary source links", () => {
    expect(new Set(news.map((article) => article.slug)).size).toBe(news.length);
    for (const article of news) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      for (const date of [article.published, article.announcementDate, article.updated ?? article.published]) {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(date);
        expect(date <= new Date().toISOString().slice(0, 10)).toBe(true);
      }
      expect(article.announcementDate <= article.published).toBe(true);
      expect((article.updated ?? article.published) >= article.published).toBe(true);
      expect(article.title.trim().length).toBeGreaterThan(10);
      expect(article.description.trim().length).toBeGreaterThan(30);
      expect(article.sections.length).toBeGreaterThan(0);
      expect(article.sources.length).toBeGreaterThan(0);
      for (const source of article.sources) expect(new URL(source.url).protocol).toBe("https:");
      for (const section of article.sections) {
        expect(section.heading.trim()).not.toBe("");
        expect(section.paragraphs.every((paragraph) => paragraph.trim().length > 0)).toBe(true);
      }
    }
  });

  it("keeps public article URLs and dates consistent across metadata, schema, RSS, and sitemap", () => {
    const feed = newsRss(news);
    expect(XMLValidator.validate(feed)).toBe(true);
    const items = new XMLParser().parse(feed).rss.channel.item;
    for (const article of news) {
      const url = `https://openbimi.com/news/${article.slug}`;
      const meta = newsMetadata(article.title, article.description, `/news/${article.slug}`, article);
      expect(meta.alternates?.canonical).toBe(url);
      expect(meta.twitter).toMatchObject({ title: `${article.title} · OpenBIMI`, description: article.description });
      expect(articleStructuredData(article)["@graph"][0]).toMatchObject({ url, datePublished: `${article.published}T00:00:00Z`, dateModified: `${article.updated ?? article.published}T00:00:00Z` });
      expect(items.find((item: { link: string }) => item.link === url).pubDate).toBe(new Date(`${article.published}T00:00:00Z`).toUTCString());
      expect(sitemap().find((item) => item.url === url)?.lastModified).toBe(article.updated ?? article.published);
    }
  });

  it("escapes feed text and retains original publication dates after corrections", () => {
    const article = { ...news[0], title: "DNS & logos <update>", description: "A \"quoted\" update & correction", updated: "2026-09-16" };
    const xml = newsRss([article]);
    expect(XMLValidator.validate(xml)).toBe(true);
    const channel = new XMLParser().parse(xml).rss.channel;
    expect(channel.item.title).toBe(article.title);
    expect(channel.item.description).toBe(article.description);
    expect(channel.item.pubDate).toBe(new Date(`${article.published}T00:00:00Z`).toUTCString());
    expect(channel.lastBuildDate).toBe(new Date(`${article.updated}T00:00:00Z`).toUTCString());
    expect(XMLValidator.validate(newsRss([]))).toBe(true);
  });
});
