import { getSiteUrl } from "@/lib/seo";

type IndexNowResult = {
  submitted: boolean;
  status?: number;
  reason?: string;
};

export async function submitIndexNowUrls(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return {
      submitted: false,
      reason: "INDEXNOW_KEY is not configured."
    };
  }

  const siteUrl = getSiteUrl();
  const host = new URL(siteUrl).hostname;

  // To enable IndexNow, add INDEXNOW_KEY and serve the matching key file at /{key}.txt.
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${siteUrl}/${key}.txt`,
      urlList: urls
    })
  });

  return {
    submitted: response.ok,
    status: response.status,
    reason: response.ok ? undefined : await response.text().catch(() => "IndexNow request failed.")
  };
}
