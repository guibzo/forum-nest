import { z } from 'zod'

export const fetchRecentQuestionsPageParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export type FetchRecentQuestionsPageParamSchema = z.infer<
  typeof fetchRecentQuestionsPageParamSchema
>

export const fetchRecentQuestionsResponseSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
    authorId: z.string(),
  })
)
