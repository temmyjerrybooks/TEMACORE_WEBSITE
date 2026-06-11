"use client";

import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RunSeoAuditButtonProps = {
  enabled: boolean;
};

export function RunSeoAuditButton({ enabled }: RunSeoAuditButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <div className="grid gap-3">
      <button
        type="button"
        disabled={!enabled || status === "running"}
        onClick={async () => {
          setStatus("running");
          setMessage("");

          try {
            const response = await fetch("/api/admin/seo/run-audit", {
              method: "POST"
            });
            const result = (await response.json().catch(() => null)) as {
              error?: string;
              issues_found?: number;
              overall_score?: number;
            } | null;

            if (!response.ok) {
              throw new Error(result?.error ?? "Unable to run SEO audit.");
            }

            setStatus("success");
            setMessage(
              `Audit complete. Score: ${result?.overall_score ?? "recorded"}. Issues found: ${
                result?.issues_found ?? "recorded"
              }.`
            );
            router.refresh();
          } catch (error) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Unable to run SEO audit.");
          }
        }}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <RefreshCcw className={`h-4 w-4 ${status === "running" ? "animate-spin" : ""}`} aria-hidden="true" />
        {status === "running" ? "Running Audit..." : "Run SEO Audit"}
      </button>

      {!enabled ? (
        <p className="text-xs font-semibold leading-5 text-slate-500">
          Configure Supabase storage before running the audit from the dashboard.
        </p>
      ) : null}

      {message ? (
        <p
          className={`rounded-md px-4 py-3 text-sm font-bold ${
            status === "error" ? "bg-red-50 text-red-700" : "bg-signal/10 text-signal"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
