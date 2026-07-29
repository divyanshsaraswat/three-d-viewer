import type { Metadata } from "next";

const termsTitle = "Terms & Conditions | Weinix";
const termsDescription =
  "Review the Weinix Terms & Conditions to understand the rules, responsibilities, and conditions governing the use of our website, products, and services.";

export const metadata: Metadata = {
  title: { absolute: termsTitle },
  description: termsDescription,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: termsTitle,
    description: termsDescription,
    url: "/terms",
  },
};

export default function TermsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
