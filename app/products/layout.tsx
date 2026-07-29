import type { Metadata } from "next";

const productsTitle = "Textile Boards & Green Building Materials Products | Weinix";
const storeDescription =
  "Weinix offers premium textile boards and green building materials made from recycled textiles, engineered for reality with certified quality. Contact us today.";

export const metadata: Metadata = {
  title: { absolute: productsTitle },
  description: storeDescription,
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: productsTitle,
    description: storeDescription,
    url: "/products",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "WEINIX Circular Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: productsTitle,
    description: storeDescription,
    images: ["/og-img.webp"],
  },
};

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
