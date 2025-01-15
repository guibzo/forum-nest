import { Notification } from '../../enterprise/notification'

export abstract class NotificationsRepositoryInterface {
  abstract create: (notification: Notification) => Promise<void>
  abstract save: (notification: Notification) => Promise<void>
  abstract findById: (id: string) => Promise<Notification | null>
}
