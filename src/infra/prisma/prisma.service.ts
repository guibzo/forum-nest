import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import type { CustomPrismaClientFactory } from 'nestjs-prisma'
import { extendedPrismaClient, type ExtendedPrismaClient } from './prisma.create-with-slug'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, CustomPrismaClientFactory<ExtendedPrismaClient>
{
  createPrismaClient(): ExtendedPrismaClient {
    // you could pass options to your `PrismaClient` instance here
    // Object.assign(this, extendedPrismaClient)

    return extendedPrismaClient
  }

  constructor() {
    super()
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
