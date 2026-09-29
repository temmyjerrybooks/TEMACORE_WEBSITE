import { services } from "@/lib/data";
import { routes } from "@/lib/navigation";
import { indexNowOrigin, indexNowPayload } from "@/lib/indexnow-policy";

type IndexNowResult = { submitted: boolean; status?: number; reason?: string };

// Explicit server-side opt-in only; never called by page rendering or builds.
export async function submitIndexNowUrls(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return { submitted: false, reason: "INDEXNOW_KEY is not configured." };
  try {
    const allowed = [...Object.values(routes), ...services.map(s => `${routes.services}/${s.slug}`)]
      .map(path => `${indexNowOrigin}${path}`);
    const payload = indexNowPayload(urls, key, allowed);
    const proof = await fetch(payload.keyLocation, { redirect: "error", signal: AbortSignal.timeout(15000) });
    if (!proof.ok || (await proof.text()).trim() !== key) return { submitted: false, reason: "Production key verification failed." };
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(payload)
    });
    return { submitted: response.status === 200 || response.status === 202, status: response.status,
      reason: response.status === 202 ? "Received; key validation pending. Indexing is not guaranteed." : response.status === 200 ? "Received; indexing is not guaranteed." : "IndexNow rejected the request." };
  } catch (error) {
    return { submitted: false, reason: error instanceof Error ? error.message : "IndexNow request failed." };
  }
}
