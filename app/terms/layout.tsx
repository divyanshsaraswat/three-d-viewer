import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const termsDescription =
  "Terms and conditions for using the WEINIX website, products, and services.";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: termsDescription,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: `Terms & Conditions | ${siteConfig.name}`,
    description: termsDescription,
    url: "/terms",
  },
};

export default function TermsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
