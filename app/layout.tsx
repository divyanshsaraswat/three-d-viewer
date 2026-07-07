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
        url: "/og-img.jpg",
        width: 1200,
        height: 630,
        alt: "WEINIX - Sustainable Building Materials",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Circular Architectural Surfaces`,
    description: siteConfig.description,
    images: ["/og-img.jpg"],
  },
  verification: {
    google: "CSVwFUQQQ1EMQgAb1uKX9XpBPmYg9Eo4uxTtFBN4R1c",
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
