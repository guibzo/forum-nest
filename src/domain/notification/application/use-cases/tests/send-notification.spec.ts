import { Success } from '@/core/either-failure-or-success'
import { InMemoryNotificationsRepository } from '@/tests/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '../send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send notification ', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Test title',
      content: 'Test content',
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification
    )
  })
})
