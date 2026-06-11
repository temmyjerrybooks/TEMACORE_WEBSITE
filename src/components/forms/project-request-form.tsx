"use client";

import { useState } from "react";
import { FormField } from "./form-field";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ProjectRequestForm() {
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
          const response = await fetch("/api/project-request", {
            method: "POST",
            body: new FormData(form)
          });
          const result = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;

          if (!response.ok) {
            throw new Error(result?.error ?? "Unable to submit project request.");
          }

          form.reset();
          setStatus("success");
          setMessage(
            "Thank you for contacting TEMACORE. We have received your project request and the TEMACORE Team will review it shortly. If your inquiry is urgent, please email info@temacore.com."
          );
        } catch (error) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Unable to submit project request.");
        }
      }}
    >
      <input type="text" name="_temacore_confirm" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Company name" name="company_name" placeholder="Company name" required />
        <FormField label="Work email" name="contact_email" type="email" placeholder="name@company.com" required />
        <FormField
          kind="select"
          label="Project type"
          name="project_type"
          options={["Client portal", "CRM system", "Workflow dashboard", "Business automation", "Custom app", "Other"]}
          required
        />
        <FormField
          kind="select"
          label="Budget range"
          name="budget_range"
          options={["Under $10k", "$10k-$25k", "$25k-$75k", "$75k+", "Need guidance"]}
        />
        <FormField
          kind="select"
          label="Timeline"
          name="timeline"
          options={["Immediately", "This quarter", "Next quarter", "Exploring options"]}
        />
        <FormField label="Current tools" name="current_tools" placeholder="HubSpot, Airtable, Zendesk, spreadsheets..." />
      </div>

      <FormField
        kind="textarea"
        label="Project requirements"
        name="requirements_summary"
        placeholder="Describe users, workflows, integrations, reports, permissions, and business goals."
        required
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Project requests are stored for Supabase review and status tracking.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002"
        >
          {status === "submitting" ? "Submitting..." : "Submit Project Request"}
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
