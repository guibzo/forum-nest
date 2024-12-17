import { Success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases'
import { makeAnswerComment } from '@/tests/factories/answers/make-answer-comment'
import { makeStudent } from '@/tests/factories/students/make-student'
import { InMemoryAnswerCommentsRepository } from '@/tests/repositories/answers/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await Promise.all([
      inMemoryAnswerCommentsRepository.create(comment1),
      inMemoryAnswerCommentsRepository.create(comment2),
      inMemoryAnswerCommentsRepository.create(comment3),
    ])

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result).toBeInstanceOf(Success)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: expect.objectContaining({
            name: 'John Doe',
          }),
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: expect.objectContaining({
            name: 'John Doe',
          }),
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: expect.objectContaining({
            name: 'John Doe',
          }),
          commentId: comment3.id,
        }),
      ])
    )
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 0; i <= 21; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        })
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result).toBeInstanceOf(Success)
    expect(result.value?.comments).toHaveLength(2)
  })
})
