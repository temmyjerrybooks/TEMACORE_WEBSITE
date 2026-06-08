import type { ReactNode } from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  body: string;
  children?: ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, body, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden bg-footer py-20 text-white md:py-28", className)}>
      <div className="absolute inset-0 bg-command-grid opacity-30 animate-pulse-grid" />
      <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue002/20 blur-3xl" />
      <Container className="relative z-10">
        <div className="max-w-4xl">
          {eyebrow ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-50/90">
            {body}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
