import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

export const createAccountResponseSchema = zodToJsonSchema(
  z.object({
    id: z.string().uuid(),
  })
) as SchemaObject
