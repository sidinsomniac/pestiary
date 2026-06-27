import { google } from "googleapis";
import type { CustomerInquiry } from "@/types";

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

const PROPERTY_TYPES = ["Home", "Office", "Restaurant", "Warehouse", "Other"] as const;
const LANGUAGES = ["English", "Hindi", "Bengali"] as const;

function normalizePropertyType(value: string): CustomerInquiry["property_type"] {
  const match = PROPERTY_TYPES.find((t) => t.toLowerCase() === value.trim().toLowerCase());
  return match ?? "Other";
}

function normalizeLanguage(value: string): CustomerInquiry["language"] {
  const match = LANGUAGES.find((l) => l.toLowerCase() === value.trim().toLowerCase());
  return match ?? "English";
}

export async function loadInquiriesFromSheet(): Promise<CustomerInquiry[]> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Form Responses 1",
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) {
    throw new Error("No inquiries found in the Google Sheet");
  }

  // First row is headers — find column indices dynamically.
  const headers = rows[0].map((h: string) => h.trim());
  const col = (name: string) => {
    const idx = headers.indexOf(name);
    if (idx === -1)
      throw new Error(`Column "${name}" not found in sheet. Headers: ${headers.join(", ")}`);
    return idx;
  };
  // Timestamp is auto-added by Google Forms; optional.
  const optionalCol = (name: string) => headers.indexOf(name);

  const customerNameIdx = col("Customer Name");
  const contactNumberIdx = col("Contact Number");
  const descriptionIdx = col("Pest Problem Description");
  const propertyTypeIdx = col("Property Type");
  const squareFootageIdx = col("Square Footage");
  const locationIdx = col("Location in Property");
  const languageIdx = col("Preferred Language");
  const timestampIdx = optionalCol("Timestamp");

  const dataRows = rows.slice(1);

  return dataRows.map((row: string[], i: number) => ({
    id: `inquiry_${String(i + 1).padStart(2, "0")}`,
    customer_name: row[customerNameIdx] || "Unknown Customer",
    contact_number: row[contactNumberIdx] || "",
    description: row[descriptionIdx] || "",
    property_type: normalizePropertyType(row[propertyTypeIdx] || ""),
    square_footage: Number(row[squareFootageIdx]) || 0,
    location_in_property: row[locationIdx] || "",
    language: normalizeLanguage(row[languageIdx] || ""),
    submitted_at:
      timestampIdx !== -1 && row[timestampIdx]
        ? new Date(row[timestampIdx]).toISOString()
        : new Date().toISOString(),
  }));
}

// For the demo flow: load the LATEST inquiry (last row) only.
export async function loadLatestInquiry(): Promise<CustomerInquiry> {
  const all = await loadInquiriesFromSheet();
  if (all.length === 0) throw new Error("No inquiries found");
  return all[all.length - 1];
}
