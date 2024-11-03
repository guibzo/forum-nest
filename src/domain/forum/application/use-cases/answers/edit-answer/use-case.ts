import { failure, success, type Either } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import {
  AnswerAttachmentsRepositoryInterface,
  AnswersRepositoryInterface,
} from '@/domain/forum/application/repositories'
import { Answer } from '@/domain/forum/enterprise/entities//answer'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities//answer-attachment'
import { AnswerAttachmentsList } from '@/domain/forum/enterprise/entities//answer-attachments-list'

type EditAnswerUseCaseRequest = {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepositoryInterface,
    private answerAttachmentsRepository: AnswerAttachmentsRepositoryInterface
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(
      answerId
    )

    const answerAttachmentsList = new AnswerAttachmentsList(currentAnswerAttachments)

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentsList.update(answerAttachments)

    answer.attachments = answerAttachmentsList
    answer.content = content

    await this.answersRepository.save(answer)

    return success({
      answer,
    })
  }
}
