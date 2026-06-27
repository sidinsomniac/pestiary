/**
 * Available DeepSeek models for pest-evidence evaluation.
 * DeepSeek exposes an OpenAI-compatible API, so we drive it via ChatOpenAI.
 * Update `ACTIVE_MODEL` to switch which model the pipeline uses.
 */
export const DeepSeekModels = {
  CHAT: "deepseek-chat", // V3 — general purpose, fast, cheaper
  REASONER: "deepseek-reasoner", // R1 — slower, more accurate for evaluation
} as const;

export type DeepSeekModel = (typeof DeepSeekModels)[keyof typeof DeepSeekModels];

/** The model currently used by the evaluation pipeline. */
export const ACTIVE_MODEL: DeepSeekModel = DeepSeekModels.CHAT;

/** OpenAI-compatible base URL for the DeepSeek API. */
export const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
