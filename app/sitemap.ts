import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/seo";
import { sanityClient } from "@/lib/sanity/client";
import { allSlugsQuery } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const postSlugs: string[] = await sanityClient.fetch(allSlugsQuery).catch(() => []);
  const postEntries: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/about-us`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact-us`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...postEntries,
  ];
}
