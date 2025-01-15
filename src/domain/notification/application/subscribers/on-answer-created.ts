import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepositoryInterface } from '@/domain/forum/application/repositories'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification/use-case'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepositoryInterface,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name)
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.summary,
      })
    }
  }
}
