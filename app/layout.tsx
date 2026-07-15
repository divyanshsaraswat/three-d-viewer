import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { getSiteUrl, siteConfig } from "@/utils/seo";
import AppShell from "./AppShell";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap"
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} | Circular Building Materials`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [
    {
      name: siteConfig.creator,
      url: "https://www.linkedin.com/in/imdivyanshmv/",
    },
  ],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Future of Circular Architecture`,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon-weinix.svg",
        width: 512,
        height: 512,
        alt: "WEINIX - Sustainable Building Materials",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Circular Architectural Surfaces`,
    description: siteConfig.description,
    images: ["/icon-weinix.svg"],
  },
  verification: {
    google: "f7k4DkIBSy0kmjx2ihTGl_LDk3gptMt723sb_5zyEaE",
    other: {
      "msvalidate.01": "966437E0860F623EEE48C92F82EDD383",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content="Weinix" />
        <meta property="og:url" content="https://www.weinix.com/" />
        <meta property="og:image" content="https://www.weinix.com/icon-weinix.svg" />
        <meta property="og:description" content="Weinix is the recycling and material recovery engine powering the circular fashion economy. While Re-verse collects post-consumer clothing waste, Weinix transforms it." />
        <meta property="business:contact_data:street_address" content="B-907, Unicus Shyamal, Shyamal Cross Road" />
        <meta property="business:contact_data:locality" content="Ahmedabad" />
        <meta property="business:contact_data:region" content="Gujarat" />
        <meta property="business:contact_data:postal_code" content="380015" />
        <meta property="business:contact_data:country_name" content="India" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Weinix" />
        <meta property="og:url" content="https://www.weinix.com/" />
        <meta property="og:image" content="https://www.weinix.com/icon-weinix.svg" />
        <meta property="og:description" content="Weinix is the recycling and material recovery engine powering the circular fashion economy. We transform textile waste into valuable resources, building the industrial backbone for a future where no garment ends its life in a landfill." />

        <meta property="og:type" content="profile" />
        <meta property="og:title" content="Weinix" />
        <meta property="og:url" content="https://www.weinix.com/" />
        <meta property="og:image" content="https://www.weinix.com/icon-weinix.svg" />
        <meta property="og:description" content="Weinix is the recycling and material recovery engine powering the circular fashion economy. While Re-verse collects post-consumer clothing waste, Weinix transforms it." />
        <meta property="profile:first_name" content="Laksh" />
        <meta property="profile:last_name" content="Sharma" />
      </head>
      <body
        className={`${geistSans.variable} ${inter.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <AppShell>{children}</AppShell>
        </SessionProviderWrapper>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NRT8G1B1TZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NRT8G1B1TZ');
          `}
        </Script>
        <script 
  src="https://va.vercel-scripts.com/v1/script.js"
  defer
  data-endpoint={`${process.env.NEXT_PUBLIC_DORY_DOMAIN}/api/analytics/${process.env.NEXT_PUBLIC_DORY_ID}`}
/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": siteConfig.name,
              "url": getSiteUrl(),
              "logo": `${getSiteUrl()}/icon-weinix.svg`,
              "description": siteConfig.description,
              "sameAs": [
                "https://www.instagram.com/weinix.in",
                "https://www.linkedin.com/in/imdivyanshmv/"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
