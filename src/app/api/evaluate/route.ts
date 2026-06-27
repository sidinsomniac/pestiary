import { NextResponse } from "next/server";
import { loadLatestInquiry } from "@/lib/inquiries";
import { evaluateInquiry } from "@/lib/evaluate";

// Convenience endpoint: evaluate the most recent Sheet submission and return
// the full result. (No filesystem write — the operator console drives triage
// per-inquiry via /api/triage.)
export async function POST(): Promise<NextResponse> {
  try {
    const inquiry = await loadLatestInquiry();
    const result = await evaluateInquiry(inquiry);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Triage pipeline failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
