import Link from "next/link";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/navigation";

export default function NotFound() {
  return (
    <section className="bg-paper py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue002">404</p>
          <h1 className="mt-4 text-4xl font-black text-ink md:text-5xl">Page not found</h1>
          <p className="mt-5 text-slate-600">
            The page you requested is not available. Return to the Temacore homepage or explore services.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href={routes.home} className="rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white">
              Home
            </Link>
            <Link href={routes.services} className="rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-blue001">
              Services
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
