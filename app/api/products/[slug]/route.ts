/**
 * Server-side proxy for single product by slug.
 * GET /api/products/[slug] → backend GET /api/v1/products/:slug
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const res = await fetch(
      `${API_BASE}/api/v1/products/${encodeURIComponent(slug)}`,
      { headers: { "Content-Type": "application/json" } }
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
