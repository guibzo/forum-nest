import { success, type Either } from '@/core/either-failure-or-success'
import { AnswerCommentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Injectable } from '@nestjs/common'

type FetchAnswerCommentsUseCaseRequest = {
  page: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepositoryInterface) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, {
      page,
    })

    return success({
      comments,
    })
  }
}
