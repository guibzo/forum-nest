import { failure, success, type Either } from '@/core/either-failure-or-success'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AnswersRepositoryInterface } from '@/domain/forum/application/repositories'

type DeleteAnswerUseCaseRequest = {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {}>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepositoryInterface) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return success({})
  }
}