import { z } from 'zod'

export const deleteAnswerRouteParamSchema = z.string()

export type DeleteAnswerRouteParamSchema = z.infer<typeof deleteAnswerRouteParamSchema>
