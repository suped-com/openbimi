import { NewsList } from "@/components/news-list";
import { news } from "@/content/news";
import { newsDescription, newsMetadata, newsOrigin } from "@/lib/news";

export const metadata = newsMetadata("BIMI news", newsDescription, "/news");

export default function NewsPage() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: "BIMI news", description: newsDescription, url: `${newsOrigin}/news`,
    mainEntity: { "@type": "ItemList", itemListElement: news.map((article, index) => ({ "@type": "ListItem", position: index + 1, name: article.title, url: `${newsOrigin}/news/${article.slug}` })) },
  };
  return (
    <main className="news-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <div className="container news-container">
        <header className="news-heading">
          <h1>BIMI news</h1>
          <p>Updates on inbox support, mark certificates, and email authentication.</p>
          <a className="text-link" href="/news/rss.xml">RSS feed</a>
        </header>
        <NewsList articles={news} />
      </div>
    </main>
  );
}
