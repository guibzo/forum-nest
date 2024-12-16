import { z } from 'zod'

export const getQuestionBySlugRouteParamSchema = z.string()

export type GetQuestionBySlugRouteParamSchema = z.infer<typeof getQuestionBySlugRouteParamSchema>

export const getQuestionBySlugResponseSchema = z.object({
  question: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
    authorId: z.string(),
  }),
})
