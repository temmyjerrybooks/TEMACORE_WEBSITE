"use client";

import { useState } from "react";
import { FormField } from "./form-field";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function TalentApplicationForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  return (
    <form
      className="grid gap-6 rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        setStatus("submitting");
        setMessage("");

        try {
          const response = await fetch("/api/talent-application", {
            method: "POST",
            body: new FormData(form)
          });
          const result = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;

          if (!response.ok) {
            throw new Error(result?.error ?? "Unable to submit application.");
          }

          form.reset();
          setStatus("success");
          setMessage(
            "Thank you for contacting TEMACORE. We have received your application and the TEMACORE Team will review it shortly. If your inquiry is urgent, please email info@temacore.com."
          );
        } catch (error) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Unable to submit application.");
        }
      }}
    >
      <input type="text" name="_temacore_confirm" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Full name" name="full_name" placeholder="Full name" required />
        <FormField label="Email" name="email" type="email" placeholder="name@email.com" required />
        <FormField label="Country" name="country" placeholder="Country" />
        <FormField
          kind="select"
          label="Role interest"
          name="role_interest"
          options={[
            "Virtual assistant",
            "Customer support",
            "Operations coordinator",
            "Back-office analyst",
            "CRM/admin specialist",
            "Software developer"
          ]}
          required
        />
        <FormField
          kind="select"
          label="Experience level"
          name="experience_level"
          options={["Entry", "Intermediate", "Senior", "Lead"]}
        />
        <FormField
          kind="select"
          label="Availability"
          name="availability"
          options={["Full time", "Part time", "Contract", "Flexible"]}
        />
      </div>
      <FormField label="Portfolio or LinkedIn" name="portfolio_url" type="url" placeholder="https://..." />
      <FormField
        kind="textarea"
        label="Relevant experience"
        name="experience_summary"
        placeholder="Share tools, industries, remote work history, and strengths."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Our team reviews applications and follows up when a suitable opportunity is available.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002"
        >
          {status === "submitting" ? "Submitting..." : "Join Talent Pool"}
        </button>
      </div>

      {message ? (
        <p className={`rounded-md px-4 py-3 text-sm font-bold ${status === "error" ? "bg-red-50 text-red-700" : "bg-signal/10 text-signal"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
