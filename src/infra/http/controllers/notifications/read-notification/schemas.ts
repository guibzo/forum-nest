import { z } from 'zod'

export const readNotificationRouteParamSchema = z.string()

export type ReadNotificationRouteParamSchema = z.infer<typeof readNotificationRouteParamSchema>
