import { Success } from '@/core/either-failure-or-success'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases'
import { makeAnswer } from '@/tests/factories/answers/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/answers/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from '@/tests/repositories/answers/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/answers/in-memory-answers-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    )

    sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository)
  })

  it('should be able to comment on a answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comment content',
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Comment content')
  })
})
