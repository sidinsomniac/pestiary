import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { CustomerInquiry, TriageResult, PestEvaluation } from "@/types";
import { CANDIDATE_PESTS, matchServiceForPest, estimatePrice } from "./services";
import { ACTIVE_MODEL, DEEPSEEK_BASE_URL } from "./config";

const PestScoreSchema = z.object({
  id: z.string(),
  pest_name: z.string(),
  metrics: z.object({
    symptom_match: z.number().min(0).max(10),
    behavioral_cues: z.number().min(0).max(10),
    visual_cues: z.number().min(0).max(10),
    environmental_fit: z.number().min(0).max(10),
    timing_pattern: z.number().min(0).max(10),
    damage_signature: z.number().min(0).max(10),
  }),
  evidence_rationale: z.string(),
  evidence_quote: z.string(),
});

const EvaluationSchema = z.object({
  evaluations: z.array(PestScoreSchema),
});

const WhatsAppSchema = z.object({
  language: z.enum(["English", "Hindi", "Bengali"]),
  message: z.string(),
});

const EVALUATION_SYSTEM_PROMPT = `You are a pest identification expert assisting "Apex Pest Solutions", a pest control company in Bangalore, India.

Given a customer's pest problem description and property details, you will evaluate how strongly the evidence supports each of the following candidate pest types:
{candidate_list}

For EACH pest, score 0-10 (in 0.5 increments) on these six evidence dimensions:
1. **symptom_match** — described symptoms (skin reactions, bites, droppings, sounds) match this pest's typical signs.
2. **behavioral_cues** — described behavior (night activity, swarming, flight, hiding, group/solitary) matches.
3. **visual_cues** — described physical features (size, color, wings, shell, body shape) match.
4. **environmental_fit** — the described environment (kitchen, bedding, walls, outdoor) matches where this pest is commonly found.
5. **timing_pattern** — timing (seasonal, sudden onset, recurring) matches typical patterns for this pest.
6. **damage_signature** — described damage patterns (chewed wood, drilled holes, fabric damage, droppings) match.

For each pest, also provide:
- **evidence_rationale**: 1-2 sentences explaining why this pest scores the way it does.
- **evidence_quote**: a specific phrase from the customer description (verbatim) that most strongly supports the score. If no specific evidence in the description, use "No direct evidence".

You MUST return an evaluation object for every candidate pest in the list, using its exact "id" and "name".
If a pest is clearly NOT supported by the evidence, score it low (1-3) rather than zero — small uncertainty is realistic.
If the description is ambiguous, score uncertainly (4-6) rather than forcing a clear winner.
Use the full range of the scale.`;

const EVALUATION_HUMAN_PROMPT = `Customer description: {description}
Property type: {property_type}
Square footage: {sqft}
Location in property: {location}
Preferred language: {language}

Evaluate each candidate pest against this evidence.`;

const WHATSAPP_SYSTEM_PROMPT = `You are a customer-facing assistant for Apex Pest Solutions, a pest control company in Bangalore.

Generate a polite, professional WhatsApp message in the customer's preferred language ({language}) that:
1. Acknowledges the customer's problem warmly (without sounding scripted).
2. Confirms the likely pest identified ({pest_name}).
3. Recommends the service ({service_name}) with a 1-line reason.
4. Quotes the estimated price range (Rs {price_min} - Rs {price_max}).
5. Invites them to schedule a visit, providing both phone numbers: +91 80 4567 8900 and +91 98860 12345.
6. Signs off with: "— Apex Pest Solutions Team".

Keep it under 6 lines. Use formal Bengali/Hindi script appropriately. Avoid overly technical language.
For Hindi, use Devanagari script. For Bengali, use Bengali script. For English, use clear professional English.
Output ONLY the message text itself — no labels, no JSON, no field names, no "language:" prefix.`;

function createModel() {
  return new ChatOpenAI({
    model: ACTIVE_MODEL,
    temperature: 0.3, // Lower temperature for evidence-based scoring (more deterministic)
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: DEEPSEEK_BASE_URL },
  });
}

export async function evaluateInquiry(inquiry: CustomerInquiry): Promise<TriageResult> {
  const model = createModel();

  // Step 1: Evaluate candidate pests against the evidence.
  const candidateList = CANDIDATE_PESTS.map(
    (p) => `- id: "${p.id}", name: "${p.pest_name}", scientific: "${p.scientific_name}"`
  ).join("\n");

  const evalPrompt = ChatPromptTemplate.fromMessages([
    ["system", EVALUATION_SYSTEM_PROMPT],
    ["human", EVALUATION_HUMAN_PROMPT],
  ]);

  const evalInput = {
    candidate_list: candidateList,
    description: inquiry.description,
    property_type: inquiry.property_type,
    sqft: inquiry.square_footage,
    location: inquiry.location_in_property,
    language: inquiry.language,
  };

  // Try structured output; fall back to prompt-engineered JSON parsing if needed.
  // DeepSeek's tool/function-calling support varies between models, so the fallback is essential.
  let evaluation: z.infer<typeof EvaluationSchema>;
  try {
    const structured = model.withStructuredOutput(EvaluationSchema);
    const chain = evalPrompt.pipe(structured);
    evaluation = await chain.invoke(evalInput);
  } catch (err) {
    console.warn("withStructuredOutput failed, falling back to JSON parse", err);
    const fallbackPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        EVALUATION_SYSTEM_PROMPT +
          '\n\nIMPORTANT: Reply with ONLY valid JSON matching this shape: {{ "evaluations": [ {{ "id", "pest_name", "metrics": {{ "symptom_match", "behavioral_cues", "visual_cues", "environmental_fit", "timing_pattern", "damage_signature" }}, "evidence_rationale", "evidence_quote" }} ] }}. No prose, no markdown fences.',
      ],
      ["human", EVALUATION_HUMAN_PROMPT],
    ]);
    const raw = await fallbackPrompt.pipe(model).invoke(evalInput);
    const text = typeof raw.content === "string" ? raw.content : "";
    const clean = text.replace(/```json|```/g, "").trim();
    evaluation = EvaluationSchema.parse(JSON.parse(clean));
  }

  // Compute totals and rank.
  const scored: PestEvaluation[] = evaluation.evaluations.map((e) => {
    const total =
      e.metrics.symptom_match +
      e.metrics.behavioral_cues +
      e.metrics.visual_cues +
      e.metrics.environmental_fit +
      e.metrics.timing_pattern +
      e.metrics.damage_signature;
    const confidence = Math.round((total / 60) * 100);
    return {
      id: e.id,
      pest_name: e.pest_name,
      scientific_name: CANDIDATE_PESTS.find((c) => c.id === e.id)?.scientific_name,
      total_score: Math.round(total * 10) / 10,
      confidence_pct: confidence,
      metrics: e.metrics,
      evidence_rationale: e.evidence_rationale,
      evidence_quote: e.evidence_quote,
    };
  });

  scored.sort((a, b) => b.total_score - a.total_score);
  const winner = scored[0];

  // Step 2: Service recommendation.
  const mapping = matchServiceForPest(winner.pest_name);
  if (!mapping) {
    throw new Error(`No service mapping found for pest: ${winner.pest_name}`);
  }
  const priceRange = estimatePrice(mapping, inquiry.square_footage);

  // Step 3: Bilingual WhatsApp reply.
  const whatsappPrompt = ChatPromptTemplate.fromMessages([
    ["system", WHATSAPP_SYSTEM_PROMPT],
    ["human", "Customer's original message: {description}\n\nGenerate the WhatsApp reply."],
  ]);

  const wsInput = {
    language: inquiry.language,
    pest_name: winner.pest_name,
    service_name: mapping.service.service_name,
    price_min: priceRange.min,
    price_max: priceRange.max,
    description: inquiry.description,
  };
  let whatsappMessage: string;
  try {
    const wsStructured = model.withStructuredOutput(WhatsAppSchema);
    const r = await whatsappPrompt.pipe(wsStructured).invoke(wsInput);
    whatsappMessage = r.message;
  } catch (err) {
    console.warn("WhatsApp structured output failed, falling back to plain text", err);
    const raw = await whatsappPrompt.pipe(model).invoke(wsInput);
    whatsappMessage = typeof raw.content === "string" ? raw.content : "";
  }
  // Safety net: strip any leaked "language: X" line or stray markdown fences.
  whatsappMessage = whatsappMessage
    .replace(/```[a-z]*|```/gi, "")
    .replace(/^\s*language\s*:.*$/im, "")
    .trim();
  const whatsappReply = { language: inquiry.language, message: whatsappMessage };

  return {
    inquiry,
    identified_pest: {
      id: winner.id,
      pest_name: winner.pest_name,
      scientific_name: winner.scientific_name,
      total_score: winner.total_score,
      confidence_pct: winner.confidence_pct,
      evidence_rationale: winner.evidence_rationale,
      evidence_quote: winner.evidence_quote,
    },
    candidate_pests: scored,
    recommended_service: {
      ...mapping.service,
      estimated_price_min: priceRange.min,
      estimated_price_max: priceRange.max,
    },
    whatsapp_reply: whatsappReply,
    generated_at: new Date().toISOString(),
  };
}
