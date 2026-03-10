/**
 * Server-side proxy for single ticket operations.
 * GET   /api/portal/tickets/[ticketId] → backend GET   /api/v1/portal/tickets/:ticketId
 * PATCH /api/portal/tickets/[ticketId] → backend PATCH /api/v1/portal/tickets/:ticketId/close
 * POST  /api/portal/tickets/[ticketId] → backend POST  /api/v1/portal/tickets/:ticketId/messages
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const token = req.headers.get("authorization") || "";

    const res = await fetch(
      `${API_BASE}/api/v1/portal/tickets/${encodeURIComponent(ticketId)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const token = req.headers.get("authorization") || "";
    const body = await req.json();

    const res = await fetch(
      `${API_BASE}/api/v1/portal/tickets/${encodeURIComponent(ticketId)}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const token = req.headers.get("authorization") || "";

    const res = await fetch(
      `${API_BASE}/api/v1/portal/tickets/${encodeURIComponent(ticketId)}/close`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}
