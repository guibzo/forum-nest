import { Success } from '@/core/either-failure-or-success'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { makeAttachment } from '@/tests/factories/attachments/make-attachment'
import { makeQuestion } from '@/tests/factories/questions/make-question'
import { makeQuestionAttachment } from '@/tests/factories/questions/make-question-attachment'
import { makeStudent } from '@/tests/factories/students/make-student'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/attachments/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/questions/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/questions/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question details by its slug', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const slug = 'example-question-title'
    const question = makeQuestion({
      slug: Slug.create(slug),
      authorId: student.id,
    })

    await inMemoryQuestionsRepository.create(question)

    const attachment = makeAttachment({
      title: 'my-attachment',
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      })
    )

    const result = await sut.execute({
      slug,
    })

    expect(result).toBeInstanceOf(Success)
    if (result instanceof Success) {
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: question.title,
          content: question.content,
          slug: question.slug,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
          author: expect.objectContaining({
            id: student.id,
            name: student.name,
          }),
          attachments: expect.arrayContaining([
            expect.objectContaining({
              title: attachment.title,
              url: attachment.url,
            }),
          ]),
        }),
      })
    }
  })
})
