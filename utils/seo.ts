const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "WEINIX",
  description:
    "Revolutionizing building materials through circularity. We craft structural-grade architectural surfaces from recycled textiles, merging environmental conscience with premium design.",
  creator: "Divyansh Saraswat",
  keywords: [
    "WEINIX",
    "sustainable building materials",
    "recycled textile panels",
    "circular economy architecture",
    "eco-friendly construction",
    "structural textile surfaces",
    "green building technology",
    "sustainable architectural design",
    "recycled materials in construction",
    "3D material inspection tool",
  ],
} as const;

export function getSiteUrl(): string {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

  if (!envSiteUrl) {
    return FALLBACK_SITE_URL;
  }

  return normalizeSiteUrl(envSiteUrl);
}
