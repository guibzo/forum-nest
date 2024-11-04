import { z } from 'zod'

export const fetchQuestionAnswersPageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export type FetchQuestionAnswersPageQueryParamSchema = z.infer<
  typeof fetchQuestionAnswersPageQueryParamSchema
>

export const fetchQuestionAnswersPageRouteParamSchema = z.string()

export type FetchQuestionAnswersPageRouteParamSchema = z.infer<
  typeof fetchQuestionAnswersPageRouteParamSchema
>

export const fetchQuestionAnswersResponseSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
    authorId: z.string(),
  })
)
