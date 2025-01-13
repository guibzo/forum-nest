import { failure, success, type Either } from '@/core/either-failure-or-success'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionsRepositoryInterface } from '@/domain/forum/application/repositories'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Injectable } from '@nestjs/common'

type GetQuestionBySlugUseCaseRequest = {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: QuestionDetails }>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepositoryInterface) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(slug)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    return success({
      question,
    })
  }
}
