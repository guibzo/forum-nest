import { success, type Either } from '@/core/either-failure-or-success'
import { QuestionsRepositoryInterface } from '@/domain/forum/application/repositories'
import { Question } from '@/domain/forum/enterprise/entities//question'
import { Injectable } from '@nestjs/common'

type FetchRecentQuestionsUseCaseRequest = {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<null, { questions: Question[] }>

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepositoryInterface) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return success({
      questions,
    })
  }
}
