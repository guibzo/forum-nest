import { z } from 'zod'

export const editAnswerRouteParamSchema = z.string()

export type EditAnswerRouteParamSchema = z.infer<typeof editAnswerRouteParamSchema>

export const editAnswerBodySchema = z.object({
  content: z.string(),
})

export type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>
