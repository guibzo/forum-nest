import { Success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/attachments/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/questions/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/questions/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'Test content',
      title: 'Test title',
      attachmentsIds: ['attachment-1', 'attachment-2'],
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-2') }),
    ])
  })

  it('should persist attachments when creating a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'Test content',
      title: 'Test title',
      attachmentsIds: ['attachment-1', 'attachment-2'],
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-2') }),
      ])
    )
  })
})
