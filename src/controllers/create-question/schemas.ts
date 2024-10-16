import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

export const createQuestionResponseSchema = zodToJsonSchema(
  z.object({
    content: z.string(),
    title: z.string(),
    id: z.string(),
    slug: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
    authorId: z.string(),
  })
) as SchemaObject
