import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export const fetchRecentQuestionsPageParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

export type FetchRecentQuestionsPageParamSchema = z.infer<
  typeof fetchRecentQuestionsPageParamSchema
>

export const fetchRecentQuestionsResponseSchema = zodToJsonSchema(
  z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().optional(),
      authorId: z.string(),
    })
  )
) as SchemaObject
