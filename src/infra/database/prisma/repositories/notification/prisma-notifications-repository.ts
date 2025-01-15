import { NotificationsRepositoryInterface } from '@/domain/notification/application/repositories/notifications-repository-interface'
import { Notification } from '@/domain/notification/enterprise/notification'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaNotificationMapper } from './mappers/prisma-notifications-mapper'

/* eslint-disable */
@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepositoryInterface {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.client.notification.findUnique({
      where: {
        id,
      },
    })

    if (!notification) {
      return null
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.client.notification.create({
      data,
    })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.client.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
