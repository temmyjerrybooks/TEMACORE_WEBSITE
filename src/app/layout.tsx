import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { site } from "@/lib/data";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Temacore | Global Operations and Technology Partner",
    template: "%s | Temacore"
  },
  description: site.description,
  applicationName: "Temacore",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png"
  },
  alternates: {
    canonical: site.domain
  },
  openGraph: {
    title: "Temacore | Global Operations and Technology Partner",
    description: site.description,
    url: site.domain,
    siteName: "Temacore",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
