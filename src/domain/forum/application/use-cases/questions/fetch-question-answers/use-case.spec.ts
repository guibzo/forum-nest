import { Success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases'
import { makeAnswer } from '@/tests/factories/answers/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/answers/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/answers/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch question answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result).toBeInstanceOf(Success)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 0; i <= 21; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        })
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result).toBeInstanceOf(Success)
    expect(result.value?.answers).toHaveLength(2)
  })
})
