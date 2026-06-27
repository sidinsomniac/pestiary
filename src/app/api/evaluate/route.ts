import { NextResponse } from "next/server";
import { writeFileSync } from "fs";
import path from "path";
import { loadLatestInquiry } from "@/lib/inquiries";
import { evaluateInquiry } from "@/lib/evaluate";

export async function POST(): Promise<NextResponse> {
  try {
    // Demo flow: read the most recent inquiry from the linked Google Sheet.
    const inquiry = await loadLatestInquiry();
    const result = await evaluateInquiry(inquiry);

    const outputPath = path.join(
      process.cwd(),
      "public",
      "data",
      "triage_result.json"
    );
    writeFileSync(outputPath, JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      identified_pest: result.identified_pest.pest_name,
      confidence_pct: result.identified_pest.confidence_pct,
    });
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
