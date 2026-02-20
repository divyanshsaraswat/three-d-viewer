import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const editorDescription =
  "Upload and inspect 3D files in the browser, adjust scene settings, and save your preferred viewer configuration.";

export const metadata: Metadata = {
  title: "3D Editor",
  description: editorDescription,
  alternates: {
    canonical: "/editor",
  },
  openGraph: {
    title: `3D Editor | ${siteConfig.name}`,
    description: editorDescription,
    url: "/editor",
    images: [
      {
        url: "/build-1.png",
        width: 1200,
        height: 630,
        alt: "3D editor interface preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `3D Editor | ${siteConfig.name}`,
    description: editorDescription,
    images: ["/build-1.png"],
  },
};

export default function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
