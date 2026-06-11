"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={async () => {
        setIsSubmitting(true);
        await fetch("/api/admin/logout", {
          method: "POST"
        }).catch(() => undefined);
        router.push("/admin/login");
        router.refresh();
      }}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-bold text-blue001 transition hover:border-blue001 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {isSubmitting ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
