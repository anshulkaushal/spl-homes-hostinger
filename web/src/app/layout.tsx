import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { UtmCapture } from "@/components/analytics/UtmCapture";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { shouldNoindex } from "@/lib/env-flags";
import { createMetadata } from "@/lib/seo";
import { isPublicProductionUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata({
    title: "SPL Homes | Wellington builders",
    description: site.description,
    path: "/",
  }),
  metadataBase: new URL(site.url),
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NZ" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-16 font-sans md:pb-0">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: site.name,
            description: site.description,
            ...(shouldNoindex() && isPublicProductionUrl(site.url) ? {} : { url: site.url }),
            areaServed: site.region,
            sameAs: [site.instagram],
            ...(site.phone ? { telephone: site.phone } : {}),
            ...(site.email ? { email: site.email } : {}),
          }}
        />
        <SkipLink />
        <UtmCapture />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileStickyCta />
      </body>
    </html>
  );
}
