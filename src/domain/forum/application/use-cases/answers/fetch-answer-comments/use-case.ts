import { success, type Either } from '@/core/either-failure-or-success'
import { AnswerCommentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { AnswerComment } from '@/domain/forum/enterprise/entities//answer-comment'
import { Injectable } from '@nestjs/common'

type FetchAnswerCommentsUseCaseRequest = {
  page: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepositoryInterface) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page,
    })

    return success({
      answerComments,
    })
  }
}
