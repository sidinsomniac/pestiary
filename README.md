# Pestiary — AI Pest Identification

Pestiary turns a customer's plain-language pest complaint into an actionable, mobile-first triage. Someone describes their problem (in English, Hindi, or Bengali); an LLM weighs the evidence across **10 candidate pests** on six dimensions, names the most likely culprit with a confidence score, explains *why*, recommends a treatment with an estimated INR quote, and drafts a ready-to-send reply.

Built as a demo for **Apex Pest Solutions** (a pest-control brand, Bangalore). Designed phone-first, with a view to shipping as a mobile app.

## How it works

Pestiary is an **operator console** for Apex staff: open it, see the inbox of customer form submissions, pick one, and get the AI triage. It evaluates one inquiry at a time and **ranks the candidate pests** (it does not rank submissions):

- `GET /api/inquiries` lists customer submissions from the linked Google Sheet (newest first). If no Sheet is configured, it falls back to the bundled `public/data/sample_inquiries.json` so the demo always works.
- Selecting an inquiry `POST`s it to `/api/triage`, which sends it to **DeepSeek** (OpenAI-compatible API via LangChain's `ChatOpenAI`). The model scores all 10 candidate pests across `symptom_match`, `behavioral_cues`, `visual_cues`, `environmental_fit`, `timing_pattern`, and `damage_signature`.
- Scores are totalled and sorted; **#1 is the diagnosis**, mapped to an Apex service + price estimate, with a reply drafted in the customer's language. The full `TriageResult` is returned to the client (no filesystem write — fully serverless-safe). Results are cached per session so re-opening an inquiry is instant.

DeepSeek's JSON-schema response format isn't currently available, so the pipeline uses a prompt-engineered, zod-validated JSON path (with a structured-output attempt first for forward-compatibility).

## The app (mobile-first)

A phone-style app shell:
- **Inbox** (landing) — the queue of customer inquiries with a Refresh button; a "Live from Google Sheet" / sample-fallback indicator and a "✓ triaged" badge on ones already evaluated.
- Selecting an inquiry plays an **"identifying…" bug-scan animation**, then opens the result view:
  - **Top bar** with a back arrow to the inbox; **bottom tab bar** (Diagnosis · Evidence · Service · Reply) scroll-navigates and highlights the active section.
  - **Diagnosis** — the customer's words, the identified pest (confidence ring, scientific name, evidence quote, rationale, six metric badges), and an "also considered" row.
  - **Evidence** — a comparative radar of the top candidates, with a toggle to expand the full 10-pest breakdown.
  - **Service** — recommended treatment, INR quote, visits, warranty.
  - **Reply** — the bilingual message with a Copy button.

Light green theme; Space Grotesk + Inter.

## Triggering a triage

1. **Operator console (primary)** — open the app, pick an inquiry from the inbox; it runs the live pipeline and shows the result.
2. **Manual API** — `POST /api/triage` with a `CustomerInquiry` body returns a full `TriageResult`.
3. **Evaluate latest** — `POST /api/evaluate` triages the most recent Sheet submission and returns the result.

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
