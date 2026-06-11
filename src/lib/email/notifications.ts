type NotificationField = {
  label: string;
  value?: string | string[] | null;
};

type NotificationPayload = {
  subject: string;
  heading: string;
  fields: NotificationField[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatValue(value?: string | string[] | null) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not provided";
  }

  return value || "Not provided";
}

function buildText({ heading, fields }: NotificationPayload) {
  const lines = fields.map((field) => `${field.label}: ${formatValue(field.value)}`);

  return [heading, "", ...lines].join("\n");
}

function buildHtml({ heading, fields }: NotificationPayload) {
  const rows = fields
    .map((field) => {
      const value = escapeHtml(formatValue(field.value)).replaceAll("\n", "<br />");

      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-size:13px;font-weight:700;vertical-align:top;width:190px;">${escapeHtml(field.label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:14px;line-height:1.5;">${value}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <div style="background:#192772;color:#ffffff;padding:20px 24px;">
          <p style="margin:0;color:#bfdbfe;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">TEMACORE</p>
          <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;">${escapeHtml(heading)}</h1>
        </div>
        <table style="border-collapse:collapse;width:100%;">
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

export async function sendSubmissionNotification(payload: NotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return false;
  }

  const from = process.env.NOTIFICATION_EMAIL_FROM ?? "TEMACORE <info@temacore.com>";
  const to = process.env.NOTIFICATION_EMAIL_TO ?? "info@temacore.com";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: payload.subject,
      text: buildText(payload),
      html: buildHtml(payload)
    })
  }).catch((error) => {
    console.error("Email notification request failed", error);

    return null;
  });

  if (!response) {
    return false;
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");

    console.error("Email notification failed", response.status, errorBody);
    return false;
  }

  return true;
}
