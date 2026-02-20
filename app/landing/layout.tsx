import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const landingDescription =
  "Explore a high-impact architecture landing experience with bold visuals, animated storytelling, and modern design sections.";

export const metadata: Metadata = {
  title: "Architecture Landing",
  description: landingDescription,
  alternates: {
    canonical: "/landing",
  },
  openGraph: {
    title: `Architecture Landing | ${siteConfig.name}`,
    description: landingDescription,
    url: "/landing",
    images: [
      {
        url: "/build-1.png",
        width: 1200,
        height: 630,
        alt: "Architecture landing page preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Architecture Landing | ${siteConfig.name}`,
    description: landingDescription,
    images: ["/build-1.png"],
  },
};

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
