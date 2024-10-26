import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import type { CustomPrismaClientFactory } from 'nestjs-prisma'
import { getExtendedPrismaClient, type ExtendedPrismaClient } from './get-extended-prisma-client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, CustomPrismaClientFactory<ExtendedPrismaClient>
{
  createPrismaClient(): ExtendedPrismaClient {
    const extendedPrismaClient = getExtendedPrismaClient()
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
