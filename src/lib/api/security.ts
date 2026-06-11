type SpamCheckResult = {
  detected: boolean;
  reason?: string;
};

type RateLimitResult = {
  allowed: boolean;
  reason?: string;
};

const honeypotFields = ["_temacore_confirm", "_website_url", "_company_url"];

export function sanitizeInput(value: string) {
  return value.replace(/\u0000/g, "").replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export function detectBasicSpam(formData: FormData): SpamCheckResult {
  const filledHoneypot = honeypotFields.find((field) => {
    const value = formData.get(field);

    return typeof value === "string" && value.trim().length > 0;
  });

  if (filledHoneypot) {
    return {
      detected: true,
      reason: `Honeypot field was filled: ${filledHoneypot}`
    };
  }

  return { detected: false };
}

export function rateLimitPlaceholder(request: Request): RateLimitResult {
  void request;

  // Replace with a durable store-backed limiter before high-volume production use.
  return { allowed: true };
}
