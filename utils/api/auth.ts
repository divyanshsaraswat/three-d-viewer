/**
 * Portal authentication API functions.
 *
 * Client-side calls go to `/api/portal/*` proxy routes.
 * The proxy forwards to the real backend server-side.
 */

import { apiFetch, type ApiResult } from "./apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RequestOtpData {
  phone: string;
  flow: "login" | "signup";
}

export interface SignupData {
  phone: string;
  flow: "signup";
}

export interface VerifyOtpCustomer {
  id: string;
  phone: string;
  name: string;
  email: string;
  isPhoneVerified: boolean;
  businessType: string;
}

export interface VerifyOtpData {
  customer: VerifyOtpCustomer;
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  expiresIn: string;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Request an OTP for the given phone number.
 * Returns `flow: "login"` if the phone is registered, `"signup"` if not.
 */
export function requestOtp(
  phone: string,
  signal?: AbortSignal
): Promise<ApiResult<RequestOtpData>> {
  return apiFetch<RequestOtpData>("/portal/request-otp", {
    method: "POST",
    body: { phone },
    signal,
  });
}

/**
 * Register a new customer and send an OTP.
 * Should only be called when `requestOtp` returned `flow: "signup"`.
 */
export function signup(
  phone: string,
  name: string,
  email: string,
  signal?: AbortSignal
): Promise<ApiResult<SignupData>> {
  return apiFetch<SignupData>("/portal/signup", {
    method: "POST",
    body: { phone, name, email },
    signal,
  });
}

/**
 * Verify the OTP code — completes both login and signup flows.
 * On success returns JWT tokens + customer profile.
 */
export function verifyOtp(
  phone: string,
  otp: string,
  signal?: AbortSignal
): Promise<ApiResult<VerifyOtpData>> {
  return apiFetch<VerifyOtpData>("/portal/verify-otp", {
    method: "POST",
    body: { phone, otp },
    signal,
  });
}

/**
 * Logout the current portal session (destroys the server-side session).
 */
export function portalLogout(
  token: string,
  signal?: AbortSignal
): Promise<ApiResult<null>> {
  return apiFetch<null>("/portal/logout", {
    method: "POST",
    token,
    signal,
  });
}
