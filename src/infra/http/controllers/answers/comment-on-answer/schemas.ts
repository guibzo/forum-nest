import { z } from 'zod'

export const commentOnAnswerRouteParamSchema = z.string()

export type CommentOnAnswerRouteParamSchema = z.infer<typeof commentOnAnswerRouteParamSchema>

export const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

export type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>
