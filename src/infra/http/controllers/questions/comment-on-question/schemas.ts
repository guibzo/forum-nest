import { z } from 'zod'

export const commentOnQuestionRouteParamSchema = z.string()

export type CommentOnQuestionRouteParamSchema = z.infer<typeof commentOnQuestionRouteParamSchema>

export const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

export type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>
