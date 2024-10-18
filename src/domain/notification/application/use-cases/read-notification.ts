import { failure, success, type Either } from '@/core/either-failure-or-success'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Notification } from '../../enterprise/notification'
import type { NotificationsRepository } from '../repositories/notifications-repository'

type ReadNotificationUseCaseRequest = {
  notificationId: string
  recipientId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return failure(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return failure(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return success({
      notification,
    })
  }
}
