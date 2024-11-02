import { Either, failure, success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import {
  type QuestionAttachmenttsRepositoryInterface,
  type QuestionsRepositoryInterface,
} from '@/domain/forum/application/repositories'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentsList } from '@/domain/forum/enterprise/entities/question-attachments-list'

type EditQuestionUseCaseRequest = {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepositoryInterface,
    private questionAttachmentsRepository: QuestionAttachmenttsRepositoryInterface
  ) {}

  async execute({
    authorId,
    content,
    title,
    questionId,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentsList = new QuestionAttachmentsList(currentQuestionAttachments)

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentsList.update(questionAttachments)

    question.attachments = questionAttachmentsList
    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return success({
      question,
    })
  }
}
