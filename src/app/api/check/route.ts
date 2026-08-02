import { checkDomain } from "@/lib/check-domain";
import { isValidDomain, isValidSelector, normalizeDomain } from "@/lib/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = normalizeDomain(searchParams.get("domain") ?? "");
  const selector = (searchParams.get("selector") || "default").trim().toLowerCase();

  if (!isValidDomain(domain)) {
    return Response.json(
      { error: "Enter a valid public domain, such as example.com." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!isValidSelector(selector)) {
    return Response.json(
      { error: "The BIMI selector may contain letters, numbers, and hyphens." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await checkDomain(domain, selector);
    return Response.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Domain check failed", error);
    return Response.json(
      { error: "The check could not be completed. Please try again shortly." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
