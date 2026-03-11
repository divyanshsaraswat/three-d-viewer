/**
 * Server-side proxy for customer profile.
 * GET  /api/portal/profile/[id] → backend GET  /api/v1/admin/customers/:id
 * PATCH /api/portal/profile/[id] → backend PATCH /api/v1/admin/customers/:id/profile
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");
const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (IS_DEV) {
      console.log("[PROFILE-PROXY] GET profile for customer:", id);
    }

    const res = await fetch(
      `${API_BASE}/api/v1/admin/customers/${encodeURIComponent(id)}`,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = await res.json();

    if (IS_DEV) {
      console.log("[PROFILE-PROXY] GET response:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    if (IS_DEV) {
      console.log("[PROFILE-PROXY] GET — Backend unreachable");
    }
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (IS_DEV) {
      console.log("[PROFILE-PROXY] PATCH profile for customer:", id, "body:", JSON.stringify(body));
    }

    const res = await fetch(
      `${API_BASE}/api/v1/admin/customers/${encodeURIComponent(id)}/profile`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (IS_DEV) {
      console.log("[PROFILE-PROXY] PATCH response:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(data, { status: res.status });
  } catch {
    if (IS_DEV) {
      console.log("[PROFILE-PROXY] PATCH — Backend unreachable");
    }
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}
