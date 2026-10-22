// Zod schemas, inferred types, bridge interface
import * as z from "zod";
import { LIMITS } from "./limits";

const SourceUrlSchema = z.string()
  .trim()
  .max(LIMITS.sourceUrl.max)
  .refine(
    (value) => {
      if (value === '') return true
      try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
    },
    { message: 'Enter a valid HTTP or HTTPS URL.' }
  )
  .transform((value) => (value === '' ? undefined : value))
  .optional()

export const SourceInputSchema = z.strictObject({
  title: z.string().trim().min(1).max(LIMITS.sourceTitle.max),
  url: SourceUrlSchema,
  excerpt: z.string().max(LIMITS.excerpt.maxPerSource)
})

const SourcesSchema = z.array(SourceInputSchema)
  .min(LIMITS.sources.min)
  .max(LIMITS.sources.max)
  .superRefine((sources, ctx) => {
    if (!sources.some((source) => source.excerpt.trim().length > 0)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Paste an excerpt into at least one source.'
      })
    }

    const total = sources.reduce(
      (sum, source) => sum + source.excerpt.length,
      0
    )

    if (total > LIMITS.excerpt.maxTotal) {
      ctx.addIssue({
        code: 'custom',
        message: 'Combined excerpts must not exceed 30,000 characters.'
      })
    }
  })

export const StartRunInputSchema = z.strictObject({
  task: z.string().trim().min(1).max(LIMITS.task.max),
  sources: SourcesSchema
})

export const ModelConfigSchema = z.strictObject({
  modelId: z.string().trim().min(1).max(LIMITS.modelId.max),
  outputTokenCap: z
    .number()
    .int()
    .min(LIMITS.outputTokens.min)
    .max(LIMITS.outputTokens.max)
    .default(LIMITS.outputTokens.default)
})

export const ModelTextSchema = z.string().max(LIMITS.modelText.max)

export type StartRunInput = z.output<typeof StartRunInputSchema>
export type SourceInput = z.output<typeof SourceInputSchema>
export type ModelConfig = z.output<typeof ModelConfigSchema>