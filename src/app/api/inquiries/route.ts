import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { loadInquiriesFromSheet } from "@/lib/inquiries";
import type { CustomerInquiry } from "@/types";

// Lists customer inquiries for the operator console.
// Prefers the live Google Sheet; falls back to the bundled samples so the
// demo always works even without Sheets credentials configured.
export async function GET(): Promise<NextResponse> {
  let inquiries: CustomerInquiry[] = [];
  let source: "sheet" | "sample" = "sheet";

  try {
    inquiries = await loadInquiriesFromSheet();
    if (inquiries.length === 0) throw new Error("no rows");
  } catch {
    source = "sample";
    try {
      const p = path.join(process.cwd(), "public", "data", "sample_inquiries.json");
      inquiries = JSON.parse(fs.readFileSync(p, "utf-8")) as CustomerInquiry[];
    } catch {
      inquiries = [];
    }
  }

  // Newest first, capped.
  const list = [...inquiries]
    .sort((a, b) => (b.submitted_at || "").localeCompare(a.submitted_at || ""))
    .slice(0, 20);

  return NextResponse.json({ source, inquiries: list });
}
