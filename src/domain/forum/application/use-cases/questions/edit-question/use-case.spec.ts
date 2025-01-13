import { Failure, Success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases'
import { makeQuestion } from '@/tests/factories/questions/make-question'
import { makeQuestionAttachment } from '@/tests/factories/questions/make-question-attachment'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/attachments/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/questions/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/questions/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    )
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      })
    )

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      content: 'Edited question content',
      title: 'Edited question title',
      attachmentsIds: ['attachment-1', 'attachment-3'],
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-3'),
      }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
      content: 'Edited question content',
      title: 'Edited question title',
      attachmentsIds: [],
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed attachments when editing a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      })
    )

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      content: 'Edited question content',
      title: 'Edited question title',
      attachmentsIds: ['attachment-1', 'attachment-3'],
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('attachment-3') }),
      ])
    )
  })
})
