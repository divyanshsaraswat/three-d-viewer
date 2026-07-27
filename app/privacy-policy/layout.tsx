import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const privacyDescription =
  "How WEINIX collects, uses, and protects your personal information across our website and services.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: privacyDescription,
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description: privacyDescription,
    url: "/privacy-policy",
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
