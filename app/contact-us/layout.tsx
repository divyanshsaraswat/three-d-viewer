import type { Metadata } from "next";

const contactTitle = "Contact | Textile Waste Recycling Solutions | Weinix";
const contactDescription =
  "Get in touch with Weinix for sustainable circular building materials, recycled textile solutions, B2B partnerships, and eco-friendly material enquiries.";

export const metadata: Metadata = {
  title: { absolute: contactTitle },
  description: contactDescription,
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: {
    title: contactTitle,
    description: contactDescription,
    url: "/contact-us",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "Contact WEINIX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: contactTitle,
    description: contactDescription,
    images: ["/og-img.webp"],
  },
};

export default function ContactUsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
