import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
