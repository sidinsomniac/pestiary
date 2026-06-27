import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateInquiry } from "@/lib/evaluate";

// Minimal validation for a manually-supplied CustomerInquiry payload.
// Powers the live-demo flows (manual API trigger + sample inquiry picker)
// without requiring a Google Form / Sheet round-trip.
const InquirySchema = z.object({
  id: z.string().default("manual_inquiry"),
  customer_name: z.string().default("Customer"),
  contact_number: z.string().default(""),
  description: z.string().min(1, "description is required"),
  property_type: z
    .enum(["Home", "Office", "Restaurant", "Warehouse", "Other"])
    .default("Home"),
  square_footage: z.number().nonnegative().default(1000),
  location_in_property: z.string().default(""),
  language: z.enum(["English", "Hindi", "Bengali"]).default("English"),
  submitted_at: z.string().default(() => new Date().toISOString()),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = InquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid inquiry payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await evaluateInquiry(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Manual triage failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
