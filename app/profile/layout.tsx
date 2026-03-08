import type { Metadata } from "next";
import { siteConfig } from "@/utils/seo";

const profileDescription =
  "Manage your WEINIX account, saved 3D materials, and circularity contributions.";

export const metadata: Metadata = {
  title: "Profile | My Circular Hub",
  description: profileDescription,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `Profile | ${siteConfig.name}`,
    description: profileDescription,
    url: "/profile",
  },
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
