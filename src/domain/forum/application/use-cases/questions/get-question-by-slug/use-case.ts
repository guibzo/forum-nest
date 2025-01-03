import { failure, success, type Either } from '@/core/either-failure-or-success'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionsRepositoryInterface } from '@/domain/forum/application/repositories'
import { Question } from '@/domain/forum/enterprise/entities//question'
import { Injectable } from '@nestjs/common'

type GetQuestionBySlugUseCaseRequest = {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepositoryInterface) {}

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
