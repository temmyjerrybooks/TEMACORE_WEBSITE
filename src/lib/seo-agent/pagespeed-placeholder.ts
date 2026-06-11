export type PageSpeedPlaceholderResult = {
  enabled: boolean;
  message: string;
};

export function getPageSpeedIntegrationStatus(): PageSpeedPlaceholderResult {
  if (!process.env.PAGESPEED_INSIGHTS_API_KEY) {
    return {
      enabled: false,
      message:
        "Google PageSpeed Insights is not connected. The SEO Agent currently uses Basic Response Performance only."
    };
  }

  return {
    enabled: true,
    message:
      "Google PageSpeed Insights credentials are configured, but the integration is intentionally not activated until the audit adapter is added."
  };
}
