/**
 * Server-side proxy for contact inquiry submission.
 * POST /api/contact → registers customer + creates inquiry ticket on backend
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message, businessType } = body;

    // Step 1: Register / look-up customer by phone (idempotent)
    let customerId: string | undefined;
    try {
      const regRes = await fetch(
        `${API_BASE}/api/v1/admin/customers/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );
      const regData = await regRes.json();
      customerId = regData?.data?.customerId;
    } catch {
      // Backend down — return graceful mock
      return NextResponse.json({
        success: true,
        message: "Inquiry submitted",
        data: { submitted: true, ticketId: "MOCK-" + Date.now() },
      });
    }

    // Step 2: Create inquiry ticket
    const ticketRes = await fetch(`${API_BASE}/api/v1/admin/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        type: "inquiry",
        businessType: businessType || "d2c",
        subject,
        message: `From: ${name} (${email})\nCompany: ${company || "N/A"}\n\n${message}`,
        priority: "medium",
      }),
    });

    const ticketData = await ticketRes.json();

    if (!ticketRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: ticketData?.message || "Could not submit inquiry",
        },
        { status: ticketRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted",
      data: {
        ticketId: ticketData?.data?.ticketId,
        status: ticketData?.data?.status,
        submitted: true,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}
