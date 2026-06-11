import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { site } from "@/lib/data";
import { buildMetadata, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap"
});

const rootMetadata = buildMetadata({
  title: "Temacore | Global Operations and Technology Partner",
  description: site.description,
  path: "/"
});

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Temacore | Global Operations and Technology Partner",
    template: "%s | Temacore"
  },
  applicationName: "Temacore",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png"
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
