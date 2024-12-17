import { z } from 'zod'

export const fetchQuestionCommentsPageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export type FetchQuestionCommentsPageQueryParamSchema = z.infer<
  typeof fetchQuestionCommentsPageQueryParamSchema
>

export const fetchQuestionCommentsPageRouteParamSchema = z.string()

export type FetchQuestionCommentsPageRouteParamSchema = z.infer<
  typeof fetchQuestionCommentsPageRouteParamSchema
>

export const fetchQuestionCommentsResponseSchema = z.object({
  comments: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().optional().nullable(),
      author: z.object({
        name: z.string(),
        id: z.string(),
      }),
    })
  ),
})
