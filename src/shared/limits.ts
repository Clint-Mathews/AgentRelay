// shared input and execution bounds
export const LIMITS = {
    task: { min: 1, max: 4000 },
    sources: { min: 1, max: 5 },
    sourceTitle: { min: 1, max: 200 },
    sourceUrl: { max: 2_048 },
    excerpt: { maxPerSource: 12_000, maxTotal: 30_000 },
    modelId: { min: 1, max: 200 },
    outputTokens: { min: 256, max: 8_192, default: 2_048 },
    modelText: { max: 32_000 },
    httpResponseBytes: 1_024 * 1_024,
    persistedRunBytes: 10 * 1_024 * 1_024
} as const;