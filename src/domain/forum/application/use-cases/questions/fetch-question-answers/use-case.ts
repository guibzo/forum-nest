import { success, type Either } from '@/core/either-failure-or-success'
import { AnswersRepositoryInterface } from '@/domain/forum/application/repositories'
import { Answer } from '@/domain/forum/enterprise/entities//answer'
import { Injectable } from '@nestjs/common'

type FetchQuestionAnswersUseCaseRequest = {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<null, { answers: Answer[] }>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepositoryInterface) {}

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
