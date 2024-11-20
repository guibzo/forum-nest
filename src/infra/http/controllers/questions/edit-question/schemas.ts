import { z } from 'zod'

export const editQuestionRouteParamSchema = z.string()

export type EditQuestionRouteParamSchema = z.infer<typeof editQuestionRouteParamSchema>

export const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()),
})

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>
