import type { Metadata } from "next";

const aboutTitle = "About Us | Textile Waste Recycling & Circular Economy | Weinix";
const aboutDescription =
  "Discover how Weinix leads textile waste recycling with innovative circular economy solutions, premium materials, and certified quality. Learn more about our mission today.";

export const metadata: Metadata = {
  title: { absolute: aboutTitle },
  description: aboutDescription,
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: aboutTitle,
    description: aboutDescription,
    url: "/about-us",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "About WEINIX - Mission and Vision",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: aboutTitle,
    description: aboutDescription,
    images: ["/og-img.webp"],
  },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
