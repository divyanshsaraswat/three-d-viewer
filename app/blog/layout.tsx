import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const blogDescription =
  "Insights into the future of circularity, high-volume material recovery, and sustainable manufacturing from the WEINIX team.";

export const metadata: Metadata = {
  title: "Journal | Circular Insights",
  description: blogDescription,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Journal | ${siteConfig.name}`,
    description: blogDescription,
    url: "/blog",
    images: [
      {
        url: "/build-1.png",
        width: 1200,
        height: 630,
        alt: "WEINIX Journal - Insights into Circularity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Journal | ${siteConfig.name}`,
    description: blogDescription,
    images: ["/build-1.png"],
  },
};

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
