export const intakeUnavailableMessage =
  "We couldn't confirm your submission. Your details are still in this form. Please try again shortly, or email info@temacore.com.";

type IntakeResult = { ok: true } | { ok: false; error: string };

export async function submitClientIntake(
  formData: FormData,
  request: typeof fetch = fetch
): Promise<IntakeResult> {
  try {
    const response = await request("/api/client-intake", {
      method: "POST",
      body: formData
    });
    const result: unknown = await response.json().catch(() => null);
    const payload = result && typeof result === "object" ? result as Record<string, unknown> : null;

    if (response.ok && payload?.ok === true) return { ok: true };

    // Keep useful validation/rate-limit feedback, but never show server internals.
    if ([400, 429].includes(response.status) && typeof payload?.error === "string") {
      return { ok: false, error: payload.error };
    }

    return { ok: false, error: intakeUnavailableMessage };
  } catch {
    // A lost response can be ambiguous: do not clear the form or retry a POST.
    return { ok: false, error: intakeUnavailableMessage };
  }
}
