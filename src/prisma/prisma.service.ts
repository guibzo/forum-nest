import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { createWithSlugFn } from 'prisma-extension-create-with-slug'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const extendedClient = new PrismaClient({ log: ['warn', 'error'] }).$extends(createWithSlugFn())

    super()

    Object.assign(this, extendedClient)
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
