"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { routes, mainNavigation } from "@/lib/navigation";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button-link";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === routes.home ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between page-padding">
        <Link href={routes.home} className="flex items-center gap-3" aria-label="Temacore home">
          <Image
            src="/logo.png"
            alt="TEMACORE logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-md object-cover shadow-[0_12px_30px_rgba(25,39,114,0.26)]"
            priority
          />
          <span className="leading-none">
            <span className="block text-xl font-black tracking-tight text-ink">TEMACORE</span>
            <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              TECHNOLOGY SOLUTIONS
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {mainNavigation.map((item) => {
            if (item.href === routes.services) {
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue001/5 hover:text-blue001",
                      isActive(item.href) && "bg-blue001/10 text-blue001"
                    )}
                  >
                    Services
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.slug}
                            href={`${routes.services}/${service.slug}`}
                            className="flex gap-3 rounded-md p-3 transition hover:bg-paper"
                          >
                            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue001/10 text-blue001">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block text-sm font-bold text-ink">
                                {service.title}
                              </span>
                              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                                {service.summary}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue001/5 hover:text-blue001",
                  isActive(item.href) && "bg-blue001/10 text-blue001"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={routes.clientIntake}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-blue001/20 px-4 py-2 text-sm font-bold text-blue001 transition hover:border-blue001 hover:bg-blue001 hover:text-white"
          >
            Client Intake
          </Link>
          <ButtonLink href={routes.contact} className="min-h-11 px-4 py-2">
            Book Consultation
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-ink lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-ink/60 lg:hidden">
          <div className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex h-[76px] items-center justify-between border-b border-line px-5">
              <Link href={routes.home} className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/logo.png"
                  alt="TEMACORE logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-md object-cover"
                />
                <span className="text-lg font-black text-ink">TEMACORE</span>
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="rounded-lg border border-line bg-paper p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                  <ShieldCheck className="h-4 w-4 text-signal" aria-hidden="true" />
                  US-registered global delivery partner
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Operations teams, outsourcing workflows, and business software for growing companies.
                </p>
              </div>

              <nav className="mt-6 grid gap-1" aria-label="Mobile navigation">
                <Link
                  href={routes.home}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-bold text-ink hover:bg-paper"
                >
                  Home
                </Link>
                {mainNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-bold text-ink hover:bg-paper"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Services
                </p>
                <div className="grid gap-1">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`${routes.services}/${service.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-paper hover:text-blue001"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-line p-5">
              <ButtonLink href={routes.clientIntake} variant="outline" onClick={() => setMobileOpen(false)}>
                Client Intake
              </ButtonLink>
              <ButtonLink href={routes.contact} onClick={() => setMobileOpen(false)}>
                Book Consultation
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
