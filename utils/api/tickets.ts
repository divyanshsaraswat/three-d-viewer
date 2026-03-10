/**
 * Portal ticket API functions.
 *
 * Authenticated routes → `/api/v1/portal/tickets/*`
 * All require the customer's JWT (accessToken).
 */

import { apiFetch, qs, type ApiResult, type PaginationMeta } from "./apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductInterest {
  productId: string;
  variantSku?: string;
  quantity?: number;
  notes?: string;
}

export interface CreateTicketPayload {
  type: "sales" | "support" | "inquiry" | "complaint";
  businessType: "b2b" | "d2c";
  subject: string;
  message: string;
  priority?: "low" | "medium" | "high" | "urgent";
  productInterest?: ProductInterest[];
}

export interface TicketSummary {
  ticketId: string;
  type: string;
  subject: string;
  priority: string;
  status: string;
  unreadCount?: number;
  latestMessage?: {
    sender: string;
    message: string;
    timestamp: string;
  };
  createdAt: string;
}

export interface TicketMessage {
  sender: "customer" | "admin" | "rag";
  senderId?: string;
  senderModel?: string;
  message: string;
  attachments?: unknown[];
  timestamp: string;
  isRead: boolean;
}

export interface TicketDetail {
  ticketId: string;
  customer: unknown;
  type: string;
  businessType: string;
  subject: string;
  priority: string;
  status: string;
  messages: TicketMessage[];
  assignedTo?: unknown;
  productInterest?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketsListData {
  tickets: TicketSummary[];
  pagination: PaginationMeta;
}

export interface TicketsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Create a new support / inquiry ticket.
 */
export function createTicket(
  data: CreateTicketPayload,
  token: string,
  signal?: AbortSignal
): Promise<ApiResult<TicketSummary>> {
  return apiFetch<TicketSummary>("/portal/tickets", {
    method: "POST",
    body: data,
    token,
    signal,
  });
}

/**
 * List the authenticated customer's tickets (paginated).
 */
export function listMyTickets(
  params: TicketsQueryParams = {},
  token: string,
  signal?: AbortSignal
): Promise<ApiResult<TicketsListData>> {
  return apiFetch<TicketsListData>(`/portal/tickets${qs(params as Record<string, unknown>)}`, {
    token,
    signal,
  });
}

/**
 * Get full detail (with messages) for a single ticket.
 */
export function getTicketDetail(
  ticketId: string,
  token: string,
  signal?: AbortSignal
): Promise<ApiResult<TicketDetail>> {
  return apiFetch<TicketDetail>(
    `/portal/tickets/${encodeURIComponent(ticketId)}`,
    { token, signal }
  );
}

/**
 * Reply to an existing ticket thread.
 */
export function replyToTicket(
  ticketId: string,
  message: string,
  token: string,
  signal?: AbortSignal
): Promise<ApiResult<{ ticketId: string; status: string; message: TicketMessage }>> {
  return apiFetch<{ ticketId: string; status: string; message: TicketMessage }>(
    `/portal/tickets/${encodeURIComponent(ticketId)}/messages`,
    {
      method: "POST",
      body: { message },
      token,
      signal,
    }
  );
}

/**
 * Close a ticket from the customer side.
 */
export function closeTicket(
  ticketId: string,
  token: string,
  signal?: AbortSignal
): Promise<ApiResult<{ ticketId: string; status: string }>> {
  return apiFetch<{ ticketId: string; status: string }>(
    `/portal/tickets/${encodeURIComponent(ticketId)}/close`,
    {
      method: "PATCH",
      token,
      signal,
    }
  );
}
