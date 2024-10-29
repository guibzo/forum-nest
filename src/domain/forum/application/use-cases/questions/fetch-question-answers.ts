import { success, type Either } from '@/core/either-failure-or-success'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities//answer'

type FetchQuestionAnswersUseCaseRequest = {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<null, { answers: Answer[] }>

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

    return success({
      answers,
    })
  }
}
