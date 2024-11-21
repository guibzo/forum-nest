import { Success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/answers/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/answers/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './use-case'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe('Answer question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create a answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: 'author-1',
      content: 'Response content',
      attachmentsIds: ['attachment-1', 'attachment-2'],
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-2') }),
    ])
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Test content',
      attachmentsIds: ['attachment-1', 'attachment-2'],
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-2') }),
      ])
    )
  })
})
