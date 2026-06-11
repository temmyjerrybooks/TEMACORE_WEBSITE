"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  isConfigured: boolean;
};

export function LoginForm({ isConfigured }: LoginFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <form
      className="grid gap-5 rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8"
      onSubmit={async (event) => {
        event.preventDefault();

        if (!isConfigured) {
          return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);

        setStatus("submitting");
        setMessage("");

        try {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              password: formData.get("password")
            })
          });
          const result = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;

          if (!response.ok) {
            throw new Error(result?.error ?? "Unable to sign in.");
          }

          const nextPath = new URLSearchParams(window.location.search).get("next") ?? "/admin";

          router.push(nextPath.startsWith("/admin") ? nextPath : "/admin");
          router.refresh();
        } catch (error) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Unable to sign in.");
        }
      }}
    >
      <div>
        <label className="text-sm font-bold text-ink" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={!isConfigured || status === "submitting"}
          className="mt-2 min-h-12 w-full rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:border-blue001"
          required
        />
      </div>

      <button
        type="submit"
        disabled={!isConfigured || status === "submitting"}
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {status === "submitting" ? "Signing in..." : "Sign In"}
      </button>

      {message ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message}</p>
      ) : null}
    </form>
  );
}
