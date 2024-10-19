import { Success } from '@/core/either-failure-or-success'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/questions/get-question-by-slug'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { makeQuestion } from '@/tests/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question-title'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'example-question-title',
    })

    expect(result).toBeInstanceOf(Success)
    if (result instanceof Success) {
      expect(result.value?.question.id).toBeTruthy()
      expect(result.value?.question.title).toEqual(newQuestion.title)
    }
  })
})
