import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const SITE_URL = "https://www.makeyourrakhi.in";
const SITE_NAME = "Make Your Rakhi";
const SITE_TITLE = "Rakhi Online for Raksha Bandhan 2026 — Design & Send a 3D Rakhi Instantly | Make Your Rakhi";
const SITE_DESCRIPTION =
  "Design and make your own rakhi online in minutes — a personalised 3D rakhi you share as an instant gift-box link for Raksha Bandhan 2026 (Friday, 28 August). No shipping, no waiting, works for siblings anywhere in India or abroad.";
const RAKSHA_BANDHAN_2026_DATE = "2026-08-28";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon`,
  description: SITE_DESCRIPTION,
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Raksha Bandhan 2026",
  startDate: RAKSHA_BANDHAN_2026_DATE,
  endDate: RAKSHA_BANDHAN_2026_DATE,
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "VirtualLocation",
    url: SITE_URL,
  },
  description: "Raksha Bandhan 2026 falls on Friday, 28 August. Design and send a 3D rakhi online at Make Your Rakhi.",
  organizer: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
