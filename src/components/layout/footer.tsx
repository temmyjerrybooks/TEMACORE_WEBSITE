import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { footerNavigation, routes } from "@/lib/navigation";
import { services, site } from "@/lib/data";
import { Container } from "@/components/ui/container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer text-slate-300">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href={routes.home} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-lg font-black text-blue001">
              T
            </span>
            <span>
              <span className="block text-xl font-black text-white">Temacore</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/70">
                Operations + Technology
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
            Temacore helps companies run cleaner operations with remote teams, outsourcing workflows, and practical business technology.
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition hover:text-white">
              <Mail className="h-4 w-4 text-blue-300" aria-hidden="true" />
              {site.email}
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-300" aria-hidden="true" />
              US-registered, globally delivered
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Services</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`${routes.services}/${service.slug}`}
                  className="transition hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Company</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            {footerNavigation.company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">Start</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            {footerNavigation.action.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Admin route prepared</p>
            <Link href={routes.admin} className="mt-2 inline-block text-sm text-blue-200 hover:text-white">
              Dashboard placeholder
            </Link>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col gap-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Copyright {year} Temacore. All rights reserved.</p>
          <p>Built for secure, scalable operations and technology delivery.</p>
        </Container>
      </div>
    </footer>
  );
}
