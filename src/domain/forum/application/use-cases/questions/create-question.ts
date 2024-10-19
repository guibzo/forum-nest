import { success, type Either } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities//question'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities//question-attachment'
import { QuestionAttachmentsList } from '@/domain/forum/enterprise/entities//question-attachments-list'
import { Injectable } from '@nestjs/common'

type CreateQuestionUseCaseRequest = {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<null, { question: Question }>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    })

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentsList(questionAttachments)

    await this.questionsRepository.create(question)

    return success({
      question,
    })
  }
}
