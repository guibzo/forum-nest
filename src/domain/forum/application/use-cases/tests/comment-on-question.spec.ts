import { Success } from '@/core/either-failure-or-success'
import { makeQuestion } from '@/tests/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from '../comment-on-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()

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
