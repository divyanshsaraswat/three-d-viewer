/**
 * Server-side proxy for portal auth: logout
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization") || "";

    const res = await fetch(`${API_BASE}/api/v1/portal/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
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
