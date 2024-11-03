import { z } from 'zod'

export const editQuestionRouteParamSchema = z.string()

export type EditQuestionRouteParamSchema = z.infer<typeof editQuestionRouteParamSchema>

export const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>
