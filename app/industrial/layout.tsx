import type { Metadata } from "next";

// Maps to the "B-2-B Page" entry in the SEO meta sheet — that row's
// recommended URL (/b2b-solutions) doesn't exist in this codebase; this page
// (/industrial) is our actual B2B/bulk-supply page, so the meta lands here.
const industrialTitle = "Textile Board Manufacturer & Wholesale Supplier | Weinix";
const industrialDescription =
  "Weinix is a trusted textile board manufacturer and wholesale supplier, converting textile waste into premium building materials. Request a bulk quote today.";

export const metadata: Metadata = {
  title: { absolute: industrialTitle },
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
    title: industrialTitle,
    description: industrialDescription,
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
    title: industrialTitle,
    description: industrialDescription,
    images: ["/og-img.webp"],
  },
};

export default function IndustrialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
