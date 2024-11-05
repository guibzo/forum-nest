import { success, type Either } from '@/core/either-failure-or-success'
import { QuestionCommentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { QuestionComment } from '@/domain/forum/enterprise/entities//question-comment'
import { Injectable } from '@nestjs/common'

type FetchQuestionCommentsUseCaseRequest = {
  page: number
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[] }>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepositoryInterface) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
      questionId,
      { page }
    )

    return success({
      questionComments,
    })
  }
}
