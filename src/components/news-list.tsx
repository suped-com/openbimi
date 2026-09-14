import Link from "next/link";
import { formatNewsDate, newsReadTime, type NewsArticle } from "@/content/news";

export function NewsList({ articles }: { articles: NewsArticle[] }) {
  return (
    <ol className="news-list">
      {articles.map((article) => (
        <li key={article.slug}>
          <article className="news-item">
            <div className="news-meta"><span>{article.category}</span><span>Published <time dateTime={article.published}>{formatNewsDate(article.published)}</time></span></div>
            <h2><Link href={`/news/${article.slug}`}>{article.title}</Link></h2>
            <p>{article.description}</p>
            <span className="news-read-time">{newsReadTime(article)}</span>
          </article>
        </li>
      ))}
    </ol>
  );
}
