/**
 * Public product API functions.
 *
 * Client-side calls go to `/api/products` proxy routes.
 * The proxy forwards to the real backend server-side.
 */

import { apiFetch, qs, type ApiResult, type PaginationMeta } from "./apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface ProductVariant {
  design: string;
  material: string;
  article: string;
  images: {
    withBacklit: ProductImage[];
    withoutBacklit: ProductImage[];
  };
  pricing: {
    unit: string;
    pricePerUnit: number;
    currency: string;
    bulkDiscounts: { minQuantity: number; discountPercentage: number }[];
  };
  specifications: {
    dimensions: { length: number; width: number; thickness: number; unit: string };
    weight: { value: number; unit: string };
    finish: string;
    sustainability: {
      ecoRating: number;
      certifications: string[];
      recycledContent: number;
    };
  };
  availability: {
    inStock: boolean;
    stockQuantity: number;
    productionTimeline: string;
  };
  sku: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: "brick" | "sheet" | "tile" | "panel";
  description: { short: string; long: string };
  story: string;
  stance: string;
  variants: ProductVariant[];
  tags: string[];
  status: "active" | "inactive" | "discontinued";
  analytics: { views: number; clicks: number; inquiries: number };
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
  createdBy?: unknown;
  updatedBy?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsListData {
  products: Product[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Query params
// ---------------------------------------------------------------------------

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Fetch a paginated list of products (via server-side proxy).
 */
export function getProducts(
  params: ProductsQueryParams = {},
  signal?: AbortSignal
): Promise<ApiResult<ProductsListData>> {
  return apiFetch<ProductsListData>(`/products${qs(params as Record<string, unknown>)}`, { signal });
}

/**
 * Fetch a single product by its URL slug (via server-side proxy).
 */
export function getProductBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<ApiResult<{ product: Product }>> {
  return apiFetch<{ product: Product }>(`/products/${encodeURIComponent(slug)}`, {
    signal,
  });
}
