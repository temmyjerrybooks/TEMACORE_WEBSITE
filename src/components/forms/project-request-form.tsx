"use client";

import { useState } from "react";
import { FormField } from "./form-field";

export function ProjectRequestForm() {
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
          Project requests are structured for future Supabase review and status tracking.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002"
        >
          Submit Project Request
        </button>
      </div>

      {submitted ? (
        <p className="rounded-md bg-signal/10 px-4 py-3 text-sm font-bold text-signal">
          Request captured locally. Backend persistence will be connected after Supabase credentials are added.
        </p>
      ) : null}
    </form>
  );
}
