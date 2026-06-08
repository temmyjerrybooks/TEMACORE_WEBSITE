import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type InfoCardProps = {
  title: string;
  body: string;
  icon?: LucideIcon;
  href?: string;
  meta?: string;
  className?: string;
};

export function InfoCard({ title, body, icon: Icon, href, meta, className }: InfoCardProps) {
  const content = (
    <div
      className={cn(
        "group h-full rounded-lg border border-line bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-blue001/25 hover:shadow-[0_24px_70px_rgba(25,39,114,0.12)]",
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        {Icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue001/10 text-blue001">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        ) : null}
        {href ? (
          <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue002" />
        ) : null}
      </div>
      {meta ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-signal">
          {meta}
        </p>
      ) : null}
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
