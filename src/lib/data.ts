import fs from "fs";
import path from "path";
import type { TriageResult } from "@/types";

export async function getTriageResult(): Promise<TriageResult> {
  // In production, swap this env var to point at your CDN-hosted triage_result.json
  const remoteUrl = process.env.NEXT_PUBLIC_RESULTS_URL;

  if (remoteUrl) {
    const res = await fetch(remoteUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch triage result: ${res.status}`);
    }
    return res.json() as Promise<TriageResult>;
  }

  // Development fallback: read directly from public/data/triage_result.json
  const filePath = path.join(process.cwd(), "public", "data", "triage_result.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as TriageResult;
}
