/**
 * Contact / inquiry API function.
 *
 * Client-side calls go to `/api/contact` proxy route.
 * The proxy handles customer registration + ticket creation server-side.
 */

import { apiFetch, type ApiResult } from "./apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  businessType: "b2b" | "d2c";
}

export interface ContactInquiryResult {
  ticketId?: string;
  status?: string;
  submitted: boolean;
}

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

/**
 * Submit a contact-us inquiry via server-side proxy.
 */
export function submitContactInquiry(
  payload: ContactInquiryPayload,
  signal?: AbortSignal
): Promise<ApiResult<ContactInquiryResult>> {
  return apiFetch<ContactInquiryResult>("/contact", {
    method: "POST",
    body: payload,
    signal,
  });
}
