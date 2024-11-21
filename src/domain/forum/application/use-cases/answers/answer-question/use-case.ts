import { success, type Either } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswersRepositoryInterface } from '@/domain/forum/application/repositories'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsList } from '@/domain/forum/enterprise/entities/answer-attachments-list'
import { Injectable } from '@nestjs/common'

type AnswerQuestionUseCaseRequest = {
  authorId: string
  questionId: string
  attachmentsIds: string[]
  content: string
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepositoryInterface) {}

  async execute({
    questionId,
    authorId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentsList(answerAttachments)

    await this.answersRepository.create(answer)

    return success({
      answer,
    })
  }
}
