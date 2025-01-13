import { Success } from '@/core/either-failure-or-success'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases'
import { makeQuestion } from '@/tests/factories/questions/make-question'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/attachments/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/questions/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/questions/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/questions/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    )
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    )

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    )
  })

  it('should be able to comment on a question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comment content',
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('Comment content')
  })
})
