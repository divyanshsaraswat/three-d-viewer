import { NextRequest, NextResponse } from "next/server";

const API_BASE = (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");
const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get("authorization");

    if (IS_DEV) {
      console.log(`[TICKETS-PROXY] GET tickets?${searchParams.toString()}`);
    }

    const res = await fetch(`${API_BASE}/api/v1/portal/tickets?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    if (IS_DEV) console.error("[TICKETS-PROXY] GET error:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    if (IS_DEV) {
      console.log("[TICKETS-PROXY] POST ticket payload:", JSON.stringify(body));
    }

    const res = await fetch(`${API_BASE}/api/v1/portal/tickets`, {
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
    if (IS_DEV) console.error("[TICKETS-PROXY] POST error:", error);
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}
