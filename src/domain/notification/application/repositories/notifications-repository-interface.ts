import { Notification } from '../../enterprise/notification'

export type NotificationsRepositoryInterface = {
  create: (notification: Notification) => Promise<void>
  save: (notification: Notification) => Promise<void>
  findById: (id: string) => Promise<Notification | null>
}
