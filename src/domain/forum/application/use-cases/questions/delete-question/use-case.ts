import { failure, success, type Either } from '@/core/either-failure-or-success'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionsRepositoryInterface } from '@/domain/forum/application/repositories'
import { Injectable } from '@nestjs/common'

type DeleteQuestionUseCaseRequest = {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {}>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepositoryInterface) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return success({})
  }
}
