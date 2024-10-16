import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

export const authenticateResponseSchema = zodToJsonSchema(
  z.object({
    access_token: z.string(),
  })
) as SchemaObject
