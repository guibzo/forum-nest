import { z } from 'zod'

export const deleteQuestionRouteParamSchema = z.string()

export type DeleteQuestionRouteParamSchema = z.infer<typeof deleteQuestionRouteParamSchema>
