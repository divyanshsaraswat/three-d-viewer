import type { Metadata } from "next";

const privacyTitle = "Privacy Policy | Weinix";
const privacyDescription =
  "Read the Weinix Privacy Policy to understand how we collect, use, protect, and manage your personal information when using our website and services.";

export const metadata: Metadata = {
  title: { absolute: privacyTitle },
  description: privacyDescription,
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: privacyTitle,
    description: privacyDescription,
    url: "/privacy-policy",
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
