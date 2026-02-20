import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/editor`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/landing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
