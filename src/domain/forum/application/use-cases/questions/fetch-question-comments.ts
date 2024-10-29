import { success, type Either } from '@/core/either-failure-or-success'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities//question-comment'

type FetchQuestionCommentsUseCaseRequest = {
  page: number
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[] }>

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

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
