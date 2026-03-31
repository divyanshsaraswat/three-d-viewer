/**
 * Server-side proxy for contact inquiry submission.
 * POST /api/contact → creates inquiry on backend
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  (process.env.API_ENDPOINT || "http://localhost:8000").replace(/\/+$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message, businessType } = body;

    const res = await fetch(`${API_BASE}/api/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: name,
        email,
        phone,
        company: company || "",
        businessType: businessType || "d2c",
        subject,
        message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Could not submit inquiry",
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Inquiry submitted",
      data: {
        ticketId: data?.data?.inquiryId, // Map inquiryId to ticketId for frontend consistency
        inquiryId: data?.data?.inquiryId,
        submitted: true,
      },
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}
