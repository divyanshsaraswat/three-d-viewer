import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const aboutDescription =
  "Weinix is the recycling and material recovery engine powering the circular fashion economy. We transform post-consumer clothing waste into industrial-grade raw materials.";

export const metadata: Metadata = {
  title: "About Us | Infrastructure for Circularity",
  description: aboutDescription,
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: `About Us | ${siteConfig.name}`,
    description: aboutDescription,
    url: "/about-us",
    images: [
      {
        url: "/build-1.png",
        width: 1200,
        height: 630,
        alt: "About WEINIX - Mission and Vision",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us | ${siteConfig.name}`,
    description: aboutDescription,
    images: ["/build-1.png"],
  },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
