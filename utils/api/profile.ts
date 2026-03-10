/**
 * Customer self-serve profile API functions.
 *
 * Client-side calls go to `/api/portal/profile/:id` proxy routes.
 */

import { apiFetch, type ApiResult } from "./apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CustomerAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface CustomerProfile {
  _id: string;
  phone: string;
  isPhoneVerified: boolean;
  profile: {
    name: string;
    email: string;
    company?: string;
    businessType?: "b2b" | "d2c" | "both";
    address?: CustomerAddress;
    gstNumber?: string;
  };
  preferences: {
    interestedProducts: unknown[];
    communicationChannel?: "whatsapp" | "sms" | "email" | "all";
  };
  activityLog: unknown[];
  status: "active" | "inactive" | "blocked";
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  company?: string;
  businessType?: "b2b" | "d2c";
  address?: CustomerAddress;
  gstNumber?: string;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Fetch the authenticated customer's own profile.
 */
export function getCustomerProfile(
  customerId: string,
  signal?: AbortSignal
): Promise<ApiResult<{ customer: CustomerProfile }>> {
  return apiFetch<{ customer: CustomerProfile }>(
    `/portal/profile/${encodeURIComponent(customerId)}`,
    { signal }
  );
}

/**
 * Update the authenticated customer's profile fields.
 */
export function updateCustomerProfile(
  customerId: string,
  data: UpdateProfilePayload,
  signal?: AbortSignal
): Promise<ApiResult<{ customer: CustomerProfile }>> {
  return apiFetch<{ customer: CustomerProfile }>(
    `/portal/profile/${encodeURIComponent(customerId)}`,
    {
      method: "PATCH",
      body: data,
      signal,
    }
  );
}
