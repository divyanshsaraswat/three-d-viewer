/**
 * Server-side proxy for portal tickets.
 * POST /api/portal/tickets   → backend POST /api/v1/portal/tickets
 * GET  /api/portal/tickets   → backend GET  /api/v1/portal/tickets
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization") || "";
    const body = await req.json();

    const res = await fetch(`${API_BASE}/api/v1/portal/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization") || "";
    const { searchParams } = new URL(req.url);
    const qs = searchParams.toString();

    const res = await fetch(
      `${API_BASE}/api/v1/portal/tickets${qs ? `?${qs}` : ""}`,
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
