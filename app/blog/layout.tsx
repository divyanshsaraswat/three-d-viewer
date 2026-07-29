import type { Metadata } from "next";

const blogTitle = "Sustainable Materials & Circular Economy Blog/Insights | Weinix";
const blogDescription =
  "Explore the Weinix blog for insights on circular building materials, textile recycling, sustainable innovation, green construction, and the circular economy.";

export const metadata: Metadata = {
  title: { absolute: blogTitle },
  description: blogDescription,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: "/blog",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "WEINIX Journal - Insights into Circularity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: blogTitle,
    description: blogDescription,
    images: ["/og-img.webp"],
  },
};

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
