import { Failure, Success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases'
import { makeQuestionComment } from '@/tests/factories/questions/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/questions/in-memory-question-comments-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment by id', async () => {
    const newQuestion = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-comment-1')
    )

    await inMemoryQuestionCommentsRepository.create(newQuestion)

    const result = await sut.execute({
      questionCommentId: 'question-comment-1',
      authorId: 'author-1',
    })

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const newQuestion = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-comment-1')
    )

    await inMemoryQuestionCommentsRepository.create(newQuestion)

    const result = await sut.execute({
      questionCommentId: 'question-comment-1',
      authorId: 'author-2',
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
