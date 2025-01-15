import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepositoryInterface } from '@/domain/forum/application/repositories'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification/use-case'

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepositoryInterface,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerChosenNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    )
  }

  private async sendQuestionBestAnswerChosenNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida como a melhor!`,
        content: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat('...')}" foi escolhida como a melhor pelo autor!`,
      })
    }
  }
}
