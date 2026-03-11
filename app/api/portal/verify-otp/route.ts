/**
 * Server-side proxy for portal auth: verify-otp
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");
const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (IS_DEV) {
      console.log("[VERIFY-OTP] Request body:", JSON.stringify(body));
    }

    const res = await fetch(`${API_BASE}/api/v1/portal/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (IS_DEV) {
      console.log("[VERIFY-OTP] Backend response:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    if (IS_DEV) {
      console.log("[VERIFY-OTP] Backend unreachable");
    }
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}
