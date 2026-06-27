import type { ServiceRecommendation } from "@/types";

interface PestServiceMapping {
  pest_keywords: string[]; // pest names this service treats
  service: ServiceRecommendation;
  price_per_sqft: number; // INR
  base_price: number; // INR — minimum charge
}

export const PEST_SERVICES: PestServiceMapping[] = [
  {
    pest_keywords: ["german cockroach", "american cockroach", "cockroach"],
    service: {
      service_name: "Intelligent Gel Treatment",
      service_description:
        "Targeted gel-based treatment for cockroaches. Safe for households, no smell, no need to vacate the premises. Destroys the entire colony.",
      estimated_price_min: 800,
      estimated_price_max: 2000,
      estimated_visits: 1,
      warranty_months: 3,
    },
    price_per_sqft: 0.08,
    base_price: 800,
  },
  {
    pest_keywords: ["subterranean termite", "drywood termite", "termite", "white ant"],
    service: {
      service_name: "Intelligent Termite Service",
      service_description:
        "Comprehensive termite treatment using chemical barriers and direct injection. Protects structural integrity. Includes pre-construction and post-construction options.",
      estimated_price_min: 5500,
      estimated_price_max: 25000,
      estimated_visits: 2,
      warranty_months: 60,
    },
    price_per_sqft: 5.5,
    base_price: 5500,
  },
  {
    pest_keywords: ["house rat", "rat", "rodent", "mouse", "mice"],
    service: {
      service_name: "Rodent Control Service",
      service_description:
        "Bait stations and exclusion techniques. Targets entry points and harborage. Periodic monitoring included.",
      estimated_price_min: 1500,
      estimated_price_max: 6000,
      estimated_visits: 2,
      warranty_months: 6,
    },
    price_per_sqft: 0.15,
    base_price: 1500,
  },
  {
    pest_keywords: ["bed bug", "bedbug"],
    service: {
      service_name: "Bed Bug Treatment",
      service_description:
        "Heat treatment combined with targeted spraying of mattresses, joints, and crevices. Two follow-up visits.",
      estimated_price_min: 2500,
      estimated_price_max: 8000,
      estimated_visits: 3,
      warranty_months: 3,
    },
    price_per_sqft: 0.25,
    base_price: 2500,
  },
  {
    pest_keywords: ["mosquito", "mosquitoes"],
    service: {
      service_name: "Mosquito Control Service",
      service_description:
        "Indoor and outdoor mosquito treatment with larvicide application at breeding sites. Includes drain-line treatment.",
      estimated_price_min: 1200,
      estimated_price_max: 5000,
      estimated_visits: 2,
      warranty_months: 3,
    },
    price_per_sqft: 0.12,
    base_price: 1200,
  },
  {
    pest_keywords: ["ant", "ants"],
    service: {
      service_name: "Ant Control Service",
      service_description:
        "Gel and bait treatment targeting ant colonies. Safe for kitchens and food storage areas.",
      estimated_price_min: 800,
      estimated_price_max: 2500,
      estimated_visits: 1,
      warranty_months: 3,
    },
    price_per_sqft: 0.08,
    base_price: 800,
  },
  {
    pest_keywords: ["wood borer", "borer"],
    service: {
      service_name: "Wood Borer Service",
      service_description:
        "Injection-based treatment of wooden furniture and structural wood. Prevents further damage.",
      estimated_price_min: 1500,
      estimated_price_max: 8000,
      estimated_visits: 2,
      warranty_months: 12,
    },
    price_per_sqft: 0.2,
    base_price: 1500,
  },
  {
    pest_keywords: ["spider", "spiders"],
    service: {
      service_name: "Spider Control Service",
      service_description:
        "Residual spray of corners, ceiling edges, and entry points. Web removal included.",
      estimated_price_min: 1000,
      estimated_price_max: 3500,
      estimated_visits: 1,
      warranty_months: 3,
    },
    price_per_sqft: 0.1,
    base_price: 1000,
  },
  {
    pest_keywords: ["fly", "flies", "housefly"],
    service: {
      service_name: "Fly Control Service",
      service_description:
        "Insecticidal mist and bait station deployment. Useful for kitchens, restaurants, and warehouses.",
      estimated_price_min: 1000,
      estimated_price_max: 4000,
      estimated_visits: 2,
      warranty_months: 3,
    },
    price_per_sqft: 0.1,
    base_price: 1000,
  },
  {
    pest_keywords: ["snake"],
    service: {
      service_name: "Snake Control Service",
      service_description:
        "Site inspection, exclusion, and reactive removal. Note: live capture and relocation only — Apex follows ethical wildlife protocols.",
      estimated_price_min: 2500,
      estimated_price_max: 10000,
      estimated_visits: 1,
      warranty_months: 6,
    },
    price_per_sqft: 0, // pricing is per-visit, not by area
    base_price: 2500,
  },
  {
    pest_keywords: ["silverfish"],
    service: {
      service_name: "Silverfish Control Service",
      service_description:
        "Residual treatment of bookshelves, wardrobes, and damp corners. Targets the moisture-loving harborage silverfish depend on.",
      estimated_price_min: 900,
      estimated_price_max: 3000,
      estimated_visits: 1,
      warranty_months: 3,
    },
    price_per_sqft: 0.09,
    base_price: 900,
  },
  {
    pest_keywords: ["flea", "fleas"],
    service: {
      service_name: "Flea Control Service",
      service_description:
        "Insecticidal treatment of flooring, pet bedding, and cracks. Includes a follow-up to break the egg-to-adult cycle.",
      estimated_price_min: 1200,
      estimated_price_max: 4500,
      estimated_visits: 2,
      warranty_months: 3,
    },
    price_per_sqft: 0.12,
    base_price: 1200,
  },
  {
    pest_keywords: ["honey bee", "bee", "wasp", "hornet"],
    service: {
      service_name: "Bee & Wasp Removal",
      service_description:
        "Safe removal and relocation of nests and hives by trained technicians with protective equipment. Ethical handling of pollinators.",
      estimated_price_min: 1800,
      estimated_price_max: 7000,
      estimated_visits: 1,
      warranty_months: 3,
    },
    price_per_sqft: 0, // priced per nest, not by area
    base_price: 1800,
  },
  {
    pest_keywords: ["gecko", "lizard"],
    service: {
      service_name: "Lizard Control Service",
      service_description:
        "Repellent application around entry points, lights, and ceilings, plus exclusion advice to reduce the insect prey that draws lizards in.",
      estimated_price_min: 1000,
      estimated_price_max: 3500,
      estimated_visits: 1,
      warranty_months: 3,
    },
    price_per_sqft: 0.1,
    base_price: 1000,
  },
  {
    pest_keywords: ["weevil", "grain beetle", "stored product", "pantry"],
    service: {
      service_name: "Stored-Product Pest Control",
      service_description:
        "Treatment of pantry, grain, and storage areas for weevils and grain beetles. Includes guidance on sealing and sanitation of affected stock.",
      estimated_price_min: 1000,
      estimated_price_max: 4000,
      estimated_visits: 1,
      warranty_months: 3,
    },
    price_per_sqft: 0.1,
    base_price: 1000,
  },
];

// The candidate list the LLM should evaluate against. Must align with pest_keywords above.
export const CANDIDATE_PESTS = [
  { id: "german_cockroach", pest_name: "German Cockroach", scientific_name: "Blattella germanica" },
  { id: "american_cockroach", pest_name: "American Cockroach", scientific_name: "Periplaneta americana" },
  { id: "subterranean_termite", pest_name: "Subterranean Termite", scientific_name: "Coptotermes spp." },
  { id: "drywood_termite", pest_name: "Drywood Termite", scientific_name: "Cryptotermes spp." },
  { id: "house_rat", pest_name: "House Rat", scientific_name: "Rattus rattus" },
  { id: "bed_bug", pest_name: "Bed Bug", scientific_name: "Cimex lectularius" },
  { id: "mosquito", pest_name: "Mosquito", scientific_name: "Culex / Aedes spp." },
  { id: "common_ant", pest_name: "Common Ant", scientific_name: "Monomorium / Solenopsis spp." },
  { id: "carpenter_ant", pest_name: "Carpenter Ant", scientific_name: "Camponotus spp." },
  { id: "wood_borer", pest_name: "Wood Borer", scientific_name: "Lyctus spp." },
  { id: "spider", pest_name: "Spider", scientific_name: "Araneae" },
  { id: "housefly", pest_name: "Housefly", scientific_name: "Musca domestica" },
  { id: "silverfish", pest_name: "Silverfish", scientific_name: "Lepisma saccharina" },
  { id: "flea", pest_name: "Flea", scientific_name: "Ctenocephalides spp." },
  { id: "bee_wasp", pest_name: "Honey Bee / Wasp", scientific_name: "Apis / Vespa spp." },
  { id: "house_gecko", pest_name: "House Gecko", scientific_name: "Hemidactylus spp." },
  { id: "stored_grain_weevil", pest_name: "Stored-Grain Weevil", scientific_name: "Sitophilus spp." },
  { id: "snake", pest_name: "Snake", scientific_name: "Serpentes" },
];

export function matchServiceForPest(pestName: string): PestServiceMapping | undefined {
  const normalized = pestName.toLowerCase();
  return PEST_SERVICES.find((s) =>
    s.pest_keywords.some((kw) => normalized.includes(kw.toLowerCase()))
  );
}

export function estimatePrice(
  mapping: PestServiceMapping,
  sqft: number
): { min: number; max: number } {
  const min = Math.max(mapping.base_price, Math.round(mapping.price_per_sqft * sqft * 0.8));
  const max = Math.max(min * 1.5, Math.round(mapping.price_per_sqft * sqft * 1.8));
  return { min, max };
}
