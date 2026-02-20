const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "3D Model Viewer",
  description:
    "View, inspect, and share OBJ, FBX, GLTF, and STL 3D models directly in your browser with fast loading and interactive controls.",
  creator: "Divyansh Saraswat",
  keywords: [
    "3D model viewer",
    "online 3D viewer",
    "GLTF viewer",
    "OBJ viewer",
    "FBX viewer",
    "STL viewer",
    "Three.js viewer",
    "React Three Fiber",
    "3D asset inspection",
    "web-based 3D editor",
  ],
} as const;

export function getSiteUrl(): string {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

  if (!envSiteUrl) {
    return FALLBACK_SITE_URL;
  }

  return normalizeSiteUrl(envSiteUrl);
}
