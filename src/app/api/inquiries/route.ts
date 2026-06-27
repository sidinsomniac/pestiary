import { NextResponse } from "next/server";
import { loadInquiriesFromSheet } from "@/lib/inquiries";
import type { CustomerInquiry } from "@/types";
// Imported as a module so it is bundled into the serverless function.
// (Files under public/ are CDN-served and NOT readable via fs on Vercel.)
import sampleInquiries from "@/data/sample_inquiries.json";

// Always run on the server at request time — never statically cached.
export const dynamic = "force-dynamic";

// Lists customer inquiries for the operator console.
// Prefers the live Google Sheet; falls back to the bundled samples so the
// demo still works even without Sheets credentials configured.
export async function GET(): Promise<NextResponse> {
  let inquiries: CustomerInquiry[] = [];
  let source: "sheet" | "sample" = "sheet";
  let sheetError: string | null = null;

  try {
    inquiries = await loadInquiriesFromSheet();
    if (inquiries.length === 0) throw new Error("Sheet returned no rows");
  } catch (e) {
    source = "sample";
    sheetError = e instanceof Error ? e.message : String(e);
    inquiries = sampleInquiries as CustomerInquiry[];
  }

  // Newest first, capped.
  const list = [...inquiries]
    .sort((a, b) => (b.submitted_at || "").localeCompare(a.submitted_at || ""))
    .slice(0, 20);

  // Surface the sheet error only when we actually fell back, so the operator
  // can see *why* live data isn't showing (missing env var, key, sharing, etc.).
  // `diag` reports only booleans/lengths — never secret values — to debug deploys.
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? "";
  const diag =
    source === "sample"
      ? {
          hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
          hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          hasPrivateKey: !!rawKey,
          hasSheetId: !!process.env.GOOGLE_SHEETS_ID,
          privateKeyLength: rawKey.length,
          privateKeyHasBeginMarker: rawKey.includes("BEGIN PRIVATE KEY"),
          privateKeyHasEscapedNewlines: rawKey.includes("\\n"),
          privateKeyHasRealNewlines: rawKey.includes("\n"),
        }
      : undefined;

  return NextResponse.json({
    source,
    inquiries: list,
    ...(source === "sample" && sheetError ? { sheetError } : {}),
    ...(diag ? { diag } : {}),
  });
}
