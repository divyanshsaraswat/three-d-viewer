import { NextRequest, NextResponse } from "next/server";

const API_BASE = (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");
const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    if (IS_DEV) {
      console.log(`[TICKETS-PROXY] POST message to ticket: ${id}`, JSON.stringify(body));
    }

    const res = await fetch(`${API_BASE}/api/v1/portal/tickets/${encodeURIComponent(id)}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    if (IS_DEV) console.error("[TICKETS-PROXY] POST Message error:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}
