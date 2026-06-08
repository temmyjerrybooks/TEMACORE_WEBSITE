"use client";

import { useState } from "react";
import { services } from "@/lib/data";
import { FormField } from "./form-field";

export function ClientIntakeForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="grid gap-6 rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Company name" name="company_name" placeholder="Acme Operations LLC" required />
        <FormField label="Website" name="website" type="url" placeholder="https://example.com" />
        <FormField label="Primary contact" name="contact_name" placeholder="Full name" required />
        <FormField label="Work email" name="email" type="email" placeholder="name@company.com" required />
        <FormField
          kind="select"
          label="Primary region"
          name="region"
          options={["United States", "Canada", "United Kingdom", "European Union", "Other"]}
          required
        />
        <FormField
          kind="select"
          label="Expected monthly volume"
          name="monthly_volume"
          options={["Under 100 tasks", "100-500 tasks", "500-2,000 tasks", "2,000+ tasks", "Not sure yet"]}
        />
      </div>

      <fieldset className="rounded-lg border border-line p-5">
        <legend className="px-2 text-sm font-bold text-ink">Services needed</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {services.map((service) => (
            <label key={service.slug} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" name="services_needed" value={service.slug} className="h-4 w-4 rounded border-line text-blue002" />
              {service.title}
            </label>
          ))}
        </div>
      </fieldset>

      <FormField
        kind="textarea"
        label="Current workflow or pain point"
        name="workflow_summary"
        placeholder="Describe the work, current tools, bottlenecks, and what success should look like."
        required
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Submissions are currently staged for future Supabase storage and admin review.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002"
        >
          Submit Intake
        </button>
      </div>

      {submitted ? (
        <p className="rounded-md bg-signal/10 px-4 py-3 text-sm font-bold text-signal">
          Intake captured locally. Supabase persistence will be connected in the next backend phase.
        </p>
      ) : null}
    </form>
  );
}
