import { z } from 'zod'

export const answerQuestionRouteParamSchema = z.string()

export type AnswerQuestionRouteParamSchema = z.infer<typeof answerQuestionRouteParamSchema>

export const answerQuestionBodySchema = z.object({
  content: z.string(),
})

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>
