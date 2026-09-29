import { validIndexNowKey } from "@/lib/indexnow-policy";

export const dynamic = "force-dynamic";

export function GET() {
  const key = process.env.INDEXNOW_KEY ?? "";
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!validIndexNowKey(key)) return new Response("Not found", { status: 404, headers });
  return new Response(key, { headers });
}
