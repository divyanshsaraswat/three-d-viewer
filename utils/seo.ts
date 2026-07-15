const FALLBACK_SITE_URL = "https://test.weinix.com";

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
    "Weinix is the recycling and material recovery engine powering the circular fashion economy. We transform textile waste into valuable resources, building the industrial backbone for a future where no garment ends its life in a landfill.",
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
  const envSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!envSiteUrl) {
    return FALLBACK_SITE_URL;
  }

  return normalizeSiteUrl(envSiteUrl);
}
