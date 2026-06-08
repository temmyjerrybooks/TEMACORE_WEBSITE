"use client";

import { useState } from "react";
import { FormField } from "./form-field";

export function TalentApplicationForm() {
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
          Talent applications include status fields for future screening workflows.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002"
        >
          Join Talent Pool
        </button>
      </div>

      {submitted ? (
        <p className="rounded-md bg-signal/10 px-4 py-3 text-sm font-bold text-signal">
          Application captured locally. Supabase storage will be activated in the backend phase.
        </p>
      ) : null}
    </form>
  );
}
