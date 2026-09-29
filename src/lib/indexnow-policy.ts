export const indexNowOrigin = "https://www.temacore.com";
export const indexNowKeyPath = "/indexnow-key.txt";
export const validIndexNowKey = (key: string) => /^[a-zA-Z0-9-]{8,128}$/.test(key);

export function indexNowPayload(urls: string[], key: string, allowedUrls: string[]) {
  if (!validIndexNowKey(key)) throw new Error("INDEXNOW_KEY must contain 8-128 letters, digits or hyphens.");
  if (!urls.length || urls.length > 10000) throw new Error("Provide 1-10000 changed public URLs.");
  const allowed = new Set(allowedUrls);
  const urlList = [...new Set(urls)];
  for (const value of urlList) {
    const url = new URL(value);
    if (url.origin !== indexNowOrigin || url.username || url.password || url.search || url.hash || url.href !== value ||
        /^\/(admin|api|investors|investor-deck|client-intake|project-request)(\/|$)/i.test(url.pathname) ||
        !allowed.has(value)) {
      throw new Error(`Not an approved canonical public URL: ${value}`);
    }
  }
  return { host: new URL(indexNowOrigin).hostname, key, keyLocation: `${indexNowOrigin}${indexNowKeyPath}`, urlList };
}
