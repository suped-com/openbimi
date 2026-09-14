import { news } from "@/content/news";
import { newsRss } from "@/lib/news";

export const dynamic = "force-static";

export function GET() {
  return new Response(newsRss(news), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600", "X-Content-Type-Options": "nosniff" },
  });
}
