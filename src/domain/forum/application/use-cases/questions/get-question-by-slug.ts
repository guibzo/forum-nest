import { failure, success, type Either } from '@/core/either-failure-or-success'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities//question'

type GetQuestionBySlugUseCaseRequest = {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    return success({
      question,
    })
  }
}
