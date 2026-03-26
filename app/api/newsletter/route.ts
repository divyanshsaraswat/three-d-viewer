import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

export async function POST(req: NextRequest) {
  try {
    const { email, phone = "" } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      console.error("Brevo configuration missing");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Construct the payload
    const body: any = {
      email: email,
      listIds: [parseInt(BREVO_LIST_ID)],
      updateEnabled: false, // Set to false to detect existing subscriptions
    };

    // Only add SMS if phone is provided and not empty
    if (phone && phone.trim() !== "") {
      body.attributes = {
        SMS: phone.trim(),
      };
    }

    // Brevo API call to create/update contact
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(body),
    });

    let data: any = {};
    const text = await response.text();
    if (text) {
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { message: text };
        }
    }

    if (!response.ok) {
        // Specific handling for existing contact
        if (data.code === 'duplicate_parameter') {
            return NextResponse.json(
              { success: true, message: "You are already subscribed!" },
              { status: 200 } // Return 200 since this is a "soft" success for the user
            );
        }

        return NextResponse.json(
          { 
            success: false, 
            message: data.message || data.code || "Failed to subscribe to Brevo",
            details: data
          },
          { status: response.status }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
