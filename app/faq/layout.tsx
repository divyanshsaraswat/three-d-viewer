import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const faqDescription =
  "Answers to common questions about WEINIX and our recycled textile-based building materials — panels, sheets, and brick-style solutions for sustainable, circular construction.";

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions",
  description: faqDescription,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: `FAQ | ${siteConfig.name}`,
    description: faqDescription,
    url: "/faq",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "WEINIX - Frequently Asked Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `FAQ | ${siteConfig.name}`,
    description: faqDescription,
    images: ["/og-img.webp"],
  },
};

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
