import { z } from 'zod'

export const fetchAnswerCommentsPageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export type FetchAnswerCommentsPageQueryParamSchema = z.infer<
  typeof fetchAnswerCommentsPageQueryParamSchema
>

export const fetchAnswerCommentsPageRouteParamSchema = z.string()

export type FetchAnswerCommentsPageRouteParamSchema = z.infer<
  typeof fetchAnswerCommentsPageRouteParamSchema
>

export const fetchAnswerCommentsResponseSchema = z.object({
  comments: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().optional(),
      authorId: z.string(),
    })
  ),
})
