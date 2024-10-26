import { PrismaClient } from '@prisma/client'
import { createWithSlugFn } from 'prisma-extension-create-with-slug'

export function getExtendedPrismaClient() {
  console.log('databaseurl', process.env.DATABASE_URL)
  return new PrismaClient({ log: ['warn', 'error'] }).$extends(createWithSlugFn())
}

export type ExtendedPrismaClient = ReturnType<typeof getExtendedPrismaClient>
