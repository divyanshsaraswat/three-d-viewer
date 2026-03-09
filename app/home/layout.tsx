import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const landingDescription =
  "Revolutionary building materials crafted from recycled textiles. Structural strength meets environmental conscience. Build sustainable with WEINIX.";

export const metadata: Metadata = {
  title: "Live Purposeful",
  description: landingDescription,
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    title: `Live Purposeful | ${siteConfig.name}`,
    description: landingDescription,
    url: "/home",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "WEINIX - Sustainable Architectural Surfaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Live Purposeful | ${siteConfig.name}`,
    description: landingDescription,
    images: ["/og-img.webp"],
  },
};

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
