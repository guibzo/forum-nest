import { z } from 'zod'

export const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

export const createAccountResponseSchema = z.object({
  id: z.string().uuid(),
})
