import { success, type Either } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotificationsRepositoryInterface } from '@/domain/notification/application/repositories/notifications-repository-interface'
import { Notification } from '@/domain/notification/enterprise/notification'
import { Injectable } from '@nestjs/common'

export type SendNotificationUseCaseRequest = {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepositoryInterface) {}

  async execute({
    recipientId,
    content,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      content,
      title,
    })

    await this.notificationsRepository.create(notification)

    return success({
      notification,
    })
  }
}
