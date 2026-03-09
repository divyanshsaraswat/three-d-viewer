import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const editorDescription =
  "High-fidelity 3D material inspection. Upload, view, and analyze your architectural surfaces with precision using the WEINIX Material Editor.";

export const metadata: Metadata = {
  title: "Material Editor | Inspect Circularity",
  description: editorDescription,
  alternates: {
    canonical: "/editor",
  },
  openGraph: {
    title: `Material Editor | ${siteConfig.name}`,
    description: editorDescription,
    url: "/editor",
    images: [
      {
        url: "/og-img.webp",
        width: 1200,
        height: 630,
        alt: "WEINIX Material Editor - 3D Surface Inspection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Material Editor | ${siteConfig.name}`,
    description: editorDescription,
    images: ["/og-img.webp"],
  },
};

export default function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
