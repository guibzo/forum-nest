import { z } from 'zod'

export const editAnswerRouteParamSchema = z.string()

export type EditAnswerRouteParamSchema = z.infer<typeof editAnswerRouteParamSchema>

export const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()),
})

export type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>
