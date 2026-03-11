import { apiFetch, type ApiResult, type PaginationMeta } from "./apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TicketType = "sales" | "support" | "inquiry" | "complaint";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "awaiting_customer" | "awaiting_staff" | "closed" | "resolved";

export interface TicketMessage {
  sender: "customer" | "admin" | "rag" | "system";
  message: string;
  timestamp: string;
  isRead?: boolean;
}

export interface TicketProductInterest {
  productId: string | any; // Could be populated
  variantSku?: string;
  quantity?: number;
  notes?: string;
}

export interface Ticket {
  ticketId: string;
  type: TicketType;
  businessType: "b2b" | "d2c" | "both";
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  productInterest?: TicketProductInterest[];
  messages?: TicketMessage[];
  unreadCount?: number;
  latestMessage?: TicketMessage;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPayload {
  type: TicketType;
  businessType: "b2b" | "d2c" | "both";
  subject: string;
  message: string;
  priority?: TicketPriority;
  productInterest?: TicketProductInterest[];
}

export interface ReplyTicketPayload {
  message: string;
}

export interface GetTicketsResponse {
  tickets: Ticket[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export function getTickets(
  token: string,
  params: { page?: number; limit?: number; status?: string } = {},
  signal?: AbortSignal
): Promise<ApiResult<GetTicketsResponse>> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.status) query.append("status", params.status);

  return apiFetch<GetTicketsResponse>(`/portal/tickets?${query.toString()}`, {
    token,
    signal,
  });
}

export function createTicket(
  token: string,
  data: CreateTicketPayload,
  signal?: AbortSignal
): Promise<ApiResult<Ticket>> {
  return apiFetch<Ticket>("/portal/tickets", {
    method: "POST",
    body: data,
    token,
    signal,
  });
}

export function getTicketById(
  token: string,
  ticketId: string,
  signal?: AbortSignal
): Promise<ApiResult<Ticket>> {
  return apiFetch<Ticket>(`/portal/tickets/${encodeURIComponent(ticketId)}`, {
    token,
    signal,
  });
}

export function replyToTicket(
  token: string,
  ticketId: string,
  data: ReplyTicketPayload,
  signal?: AbortSignal
): Promise<ApiResult<{ ticketId: string; status: string; message: TicketMessage }>> {
  return apiFetch<{ ticketId: string; status: string; message: TicketMessage }>(
    `/portal/tickets/${encodeURIComponent(ticketId)}/messages`,
    {
      method: "POST",
      body: data,
      token,
      signal,
    }
  );
}

export function closeTicket(
  token: string,
  ticketId: string,
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
