import { PrismaClient } from '@prisma/client'
import { createWithSlugFn } from 'prisma-extension-create-with-slug'

export function getExtendedPrismaClient() {
  return new PrismaClient({ log: ['warn', 'error'] }).$extends(createWithSlugFn())
}

export type ExtendedPrismaClient = ReturnType<typeof getExtendedPrismaClient>
