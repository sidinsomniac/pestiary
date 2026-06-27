# Pestiary — AI Pest Identification

Pestiary turns a customer's plain-language pest complaint into an actionable, mobile-first triage. Someone describes their problem (in English, Hindi, or Bengali); an LLM weighs the evidence across **10 candidate pests** on six dimensions, names the most likely culprit with a confidence score, explains *why*, recommends a treatment with an estimated INR quote, and drafts a ready-to-send reply.

Built as a demo for **Apex Pest Solutions** (a pest-control brand, Bangalore). Designed phone-first, with a view to shipping as a mobile app.

## How it works

**It evaluates ONE inquiry and ranks the PESTS** (it does not rank submissions):

- `POST /api/evaluate` reads the **latest row** of the linked Google Sheet (the most recent form submission) → one `CustomerInquiry`.
- That inquiry goes to **DeepSeek** (OpenAI-compatible API via LangChain's `ChatOpenAI`), which scores all 10 candidate pests across `symptom_match`, `behavioral_cues`, `visual_cues`, `environmental_fit`, `timing_pattern`, and `damage_signature`.
- Scores are totalled and sorted; **#1 is the diagnosis**. It's mapped to an Apex service + price estimate, and a reply is drafted in the customer's language.
- The result is written to `public/data/triage_result.json`.

DeepSeek's JSON-schema response format isn't currently available, so the pipeline uses a prompt-engineered, zod-validated JSON path (with a structured-output attempt first for forward-compatibility).

## The app (mobile-first)

A phone-style app shell:
- **Top bar** with a hamburger menu (drawer holds the sample-inquiry picker + about).
- **Bottom tab bar** — Diagnosis · Evidence · Service · Reply — scroll-navigates the page and highlights the active section.
- **Diagnosis** — the customer's words, the identified pest (confidence ring, scientific name, evidence quote, rationale, six metric badges), and an "also considered" row.
- **Evidence** — a comparative radar of the top candidates, with a toggle to expand the full 10-pest breakdown.
- **Service** — recommended treatment, INR quote, visits, warranty.
- **Reply** — the bilingual message with a Copy button.

Running a new triage plays an "identifying…" bug-scan animation until the result resolves. Light green theme; Space Grotesk + Inter.

## Triggering a triage (three ways)

1. **Google Form submission** — `POST /api/evaluate` reads the latest Sheet row, runs the pipeline, writes `triage_result.json`.
2. **Manual API** — `POST /api/triage` with a `CustomerInquiry` body returns a full `TriageResult` (no Sheet write).
3. **Sample picker** — the in-app drawer offers five sample inquiries (`public/data/sample_inquiries.json`); selecting one re-runs the live pipeline.

```bash
curl -X POST http://localhost:3000/api/triage \
  -H "Content-Type: application/json" \
  -d '{"description":"Many cockroaches in my kitchen at night","property_type":"Home","square_footage":1000,"location_in_property":"Kitchen","language":"English"}'
```

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

`.env.local`:

```env
DEEPSEEK_API_KEY=sk-...                                  # the only LLM key used at runtime
GOOGLE_SERVICE_ACCOUNT_EMAIL=reader@<project>.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=<id from the Sheet URL between /d/ and /edit>
NEXT_PUBLIC_RESULTS_URL=                                 # optional CDN URL for triage_result.json
```

The Google vars are only needed for the live Form → Sheet flow; the sample picker and `/api/triage` work without them. Keep the literal `\n` in `GOOGLE_PRIVATE_KEY` (the code converts them). Helper: `node scripts/sheets-env-from-json.mjs <path-to-service-account.json>` prints the two `GOOGLE_*` lines ready to paste.

The Google Form needs these exact column headers: `Customer Name`, `Contact Number`, `Pest Problem Description`, `Property Type`, `Square Footage`, `Location in Property`, `Preferred Language` (plus the auto `Timestamp`). The response tab must be named `Form Responses 1`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DEEPSEEK_API_KEY` | DeepSeek API key — the only LLM key used at runtime. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account with Viewer access to the inquiry Sheet. |
| `GOOGLE_PRIVATE_KEY` | Service-account private key (literal `\n` preserved). |
| `GOOGLE_SHEETS_ID` | ID of the linked Google Sheet. |
| `NEXT_PUBLIC_RESULTS_URL` | Optional CDN URL for `triage_result.json`. |

## Tech stack

Next.js 16 · React 19 · TypeScript · LangChain (`@langchain/openai` → DeepSeek) · zod · Recharts · Framer Motion · Google Sheets API.
