import type { Metadata } from "next";

const faqTitle = "FAQs | Textile Waste Recycling & Green Building Materials | Weinix";
const faqDescription =
  "Find answers to common questions about Weinix, textile waste recycling, green building materials, and circular economy solutions. Explore our FAQs today.";

export const metadata: Metadata = {
  title: { absolute: faqTitle },
  description: faqDescription,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: faqTitle,
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
    title: faqTitle,
    description: faqDescription,
    images: ["/og-img.webp"],
  },
};

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
