import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification, NotificationProps } from '@/domain/notification/enterprise/notification'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { PrismaNotificationMapper } from '@/infra/database/prisma/repositories/notification/mappers/prisma-notifications-mapper'
import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'

export const makeNotification = (
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID
) => {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id
  )

  return notification
}

/* eslint-disable */
@Injectable()
export class NotificationFactory {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async makePrismaNotification(data: Partial<NotificationProps> = {}): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.client.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })

    return notification
  }
}
