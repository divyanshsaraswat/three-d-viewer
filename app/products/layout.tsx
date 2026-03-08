import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const storeDescription =
  "Zero-compromise apparel and accessories engineered for the circular economy. Premium essentials rebuilt from secondary commodities.";

export const metadata: Metadata = {
  title: "Circular Store",
  description: storeDescription,
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: `Circular Store | ${siteConfig.name}`,
    description: storeDescription,
    url: "/products",
    images: [
      {
        url: "/build-1.png",
        width: 1200,
        height: 630,
        alt: "WEINIX Circular Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Circular Store | ${siteConfig.name}`,
    description: storeDescription,
    images: ["/build-1.png"],
  },
};

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
