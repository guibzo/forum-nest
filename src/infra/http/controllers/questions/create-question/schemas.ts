import { z } from 'zod'

export const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()).default([]),
})

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>
