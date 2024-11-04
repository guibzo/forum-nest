import { z } from 'zod'

export const chooseQuestionBestAnswerRouteParamSchema = z.string()

export type ChooseQuestionBestAnswerRouteParamSchema = z.infer<
  typeof chooseQuestionBestAnswerRouteParamSchema
>

export const chooseQuestionBestAnswerBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type ChooseQuestionBestAnswerBodySchema = z.infer<typeof chooseQuestionBestAnswerBodySchema>
