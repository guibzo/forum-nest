import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/notification'
import { Notification as PrismaNotification, type Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        createdAt: raw.createdAt,
        readAt: raw.readAt ? raw.readAt : undefined,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      content: notification.content,
      title: notification.title,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
