// Evidence dimensions for pest identification (6 dimensions).
export interface Metrics {
  symptom_match: number; // described symptoms match this pest's signs
  behavioral_cues: number; // behavior (night activity, swarming, flight, hiding)
  visual_cues: number; // physical features (size, color, wings, shell)
  environmental_fit: number; // environment matches (kitchen, bedding, walls)
  timing_pattern: number; // timing (seasonal, sudden, recurring)
  damage_signature: number; // damage patterns (chewed wood, holes, droppings)
}

// A single candidate pest evaluation.
export interface PestEvaluation {
  id: string;
  pest_name: string; // e.g., "German Cockroach"
  scientific_name?: string; // e.g., "Blattella germanica"
  total_score: number;
  confidence_pct: number; // 0..100
  metrics: Metrics;
  evidence_rationale: string; // 1-2 sentences explaining the match
  evidence_quote: string; // specific phrase from customer description
}

// The "winning" pest = highest-confidence match.
export interface IdentifiedPest {
  id: string;
  pest_name: string;
  scientific_name?: string;
  total_score: number;
  confidence_pct: number;
  evidence_rationale: string;
  evidence_quote: string;
}

// Customer-facing inquiry input.
export interface CustomerInquiry {
  id: string;
  customer_name: string;
  contact_number: string;
  description: string;
  property_type: "Home" | "Office" | "Restaurant" | "Warehouse" | "Other";
  square_footage: number;
  location_in_property: string; // free text: "Kitchen", "Bedroom", "Whole house"
  language: "English" | "Hindi" | "Bengali";
  submitted_at: string; // ISO string
}

// Service recommendation.
export interface ServiceRecommendation {
  service_name: string; // e.g., "Intelligent Gel Treatment"
  service_description: string;
  estimated_price_min: number; // INR
  estimated_price_max: number; // INR
  estimated_visits: number;
  warranty_months: number;
}

// Bilingual WhatsApp reply.
export interface WhatsAppReply {
  language: "English" | "Hindi" | "Bengali";
  message: string;
}

// The full triage result for one customer inquiry.
export interface TriageResult {
  inquiry: CustomerInquiry;
  identified_pest: IdentifiedPest;
  candidate_pests: PestEvaluation[]; // sorted desc by total_score
  recommended_service: ServiceRecommendation;
  whatsapp_reply: WhatsAppReply;
  generated_at: string;
}

// Recharts-compatible radar data point: one row per metric, one key per pest.
export interface RadarDataPoint {
  metric: string;
  [pest_name: string]: string | number;
}

// Event/header details retained for header + reveal UI.
export interface EventDetails {
  title: string; // "Pestiary"
  inquiry_id: string;
  reveal_status: "published" | "pending";
}
