import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about-us", "/products", "/industrial", "/blog", "/contact-us", "/faq", "/terms", "/privacy-policy"],
      disallow: ["/api/", "/profile", "/editor", "/studio", "/bni"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
