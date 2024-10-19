import { PrismaClient } from '@prisma/client'
import { createWithSlugFn } from 'prisma-extension-create-with-slug'

export const extendedPrismaClient = new PrismaClient({ log: ['warn', 'error'] }).$extends(
  createWithSlugFn()
)

export type ExtendedPrismaClient = typeof extendedPrismaClient
