import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatNewsDate, getNewsArticle, news, newsReadTime } from "@/content/news";
import { articleStructuredData, newsMetadata } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getNewsArticle((await params).slug);
  if (!article) notFound();
  return newsMetadata(article.title, article.description, `/news/${article.slug}`, article);
}

export default async function NewsArticlePage({ params }: Props) {
  const article = getNewsArticle((await params).slug);
  if (!article) notFound();
  return (
    <main className="news-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData(article)).replace(/</g, "\\u003c") }} />
      <article className="container news-container news-article">
        <Link className="text-link" href="/news">← All news</Link>
        <header className="news-heading">
          <div className="news-meta"><span>{article.category}</span><span>{newsReadTime(article)}</span></div>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <div className="news-dates">
            <span>Published <time dateTime={article.published}>{formatNewsDate(article.published)}</time></span>
            {article.updated && article.updated !== article.published && <span>Updated <time dateTime={article.updated}>{formatNewsDate(article.updated)}</time></span>}
            <span>Source announcement <time dateTime={article.announcementDate}>{formatNewsDate(article.announcementDate)}</time></span>
          </div>
        </header>
        <div className="news-body">
          {article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <section className="news-sources" aria-labelledby="news-sources-heading">
            <h2 id="news-sources-heading">Sources</h2>
            <ul>{article.sources.map((source) => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul>
          </section>
          <Link className="text-link" href={article.relatedLink.href}>{article.relatedLink.label} →</Link>
        </div>
      </article>
    </main>
  );
}
