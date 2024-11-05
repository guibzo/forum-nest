import { z } from 'zod'

export const deleteQuestionCommentRouteParamSchema = z.string()

export type DeleteQuestionCommentRouteParamSchema = z.infer<
  typeof deleteQuestionCommentRouteParamSchema
>
