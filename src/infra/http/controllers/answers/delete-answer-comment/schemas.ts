import { z } from 'zod'

export const deleteAnswerCommentRouteParamSchema = z.string()

export type DeleteAnswerCommentRouteParamSchema = z.infer<
  typeof deleteAnswerCommentRouteParamSchema
>
