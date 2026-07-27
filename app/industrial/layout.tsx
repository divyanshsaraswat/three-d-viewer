import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const industrialDescription =
  "WEINIX Industrial supplies bulk recovered fibers, insulation, composite boards and recycled textile materials to manufacturers, construction firms, fashion brands and distributors across 25+ countries. Request a wholesale quote.";

export const metadata: Metadata = {
  title: "WEINIX Industrial | Bulk Recycled Textile Materials for Manufacturers & Distributors",
  description: industrialDescription,
  keywords: [
    "recycled textile supplier",
    "bulk recovered fiber",
    "industrial textile recycling",
    "B2B sustainable materials",
    "OEM textile manufacturing",
    "wholesale insulation panels",
    "circular economy supplier",
  ],
  alternates: {
    canonical: "/industrial",
  },
  openGraph: {
    title: `${siteConfig.name} Industrial | Bulk Recycled Textile Materials for Global Industries`,
    description:
      "Sustainable textile recycling solutions for manufacturers, wholesalers, importers, exporters and industrial buyers. 500+ business partners across 25+ countries.",
    url: "/industrial",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "WEINIX Industrial - Bulk Recycled Textile Materials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WEINIX Industrial | Bulk Recycled Textile Materials",
    description:
      "Sustainable textile recycling solutions for manufacturers, wholesalers, importers, exporters and industrial buyers.",
    images: ["/og-img.webp"],
  },
};

export default function IndustrialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
