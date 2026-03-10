/**
 * Base API client with AbortController support.
 * All fetch calls go through this module for consistent error handling,
 * auth header injection, and response parsing.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Standard backend JSON envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  errors?: unknown;
}

export interface ApiResult<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
  /** Original HTTP status code */
  status: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  pages?: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * All client-side requests go through Next.js API proxy routes at /api/*.
 * The actual backend URL (API_ENDPOINT) is only used server-side, never
 * exposed to the browser — keeping it secure.
 */
const API_PROXY = "/api";

export const API_V1 = API_PROXY;

// ---------------------------------------------------------------------------
// Core fetcher
// ---------------------------------------------------------------------------

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

/**
 * Generic typed fetch wrapper.
 *
 * ```ts
 * const { data, error } = await apiFetch<{ products: Product[] }>("/products");
 * ```
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  const { method = "GET", body, token, signal, headers: extra } = options;

  const url = path.startsWith("http") ? path : `${API_V1}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extra,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    // Try to parse JSON regardless of status
    let json: ApiResponse<T>;
    try {
      json = await res.json();
    } catch {
      return {
        data: null,
        error: `Unexpected response (HTTP ${res.status})`,
        success: false,
        status: res.status,
      };
    }

    if (!res.ok || !json.success) {
      return {
        data: null,
        error: json.message || `Request failed (HTTP ${res.status})`,
        success: false,
        status: res.status,
      };
    }

    return {
      data: json.data,
      error: null,
      success: true,
      status: res.status,
    };
  } catch (err: unknown) {
    // Don't treat aborts as real errors
    if (err instanceof DOMException && err.name === "AbortError") {
      return { data: null, error: null, success: false, status: 0 };
    }

    const message =
      err instanceof Error ? err.message : "Network error — please try again.";

    return { data: null, error: message, success: false, status: 0 };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a query-string from an object, dropping `undefined`/`null` values. */
export function qs(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}
