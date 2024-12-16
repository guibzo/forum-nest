import { Success } from '@/core/either-failure-or-success'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases'
import { makeQuestionComment } from '@/tests/factories/questions/make-question-comment'
import { makeStudent } from '@/tests/factories/students/make-student'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/questions/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await Promise.all([
      inMemoryQuestionCommentsRepository.create(comment1),
      inMemoryQuestionCommentsRepository.create(comment2),
      inMemoryQuestionCommentsRepository.create(comment3),
    ])

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 0; i <= 21; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        })
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result).toBeInstanceOf(Success)
    expect(result.value?.comments).toHaveLength(2)
  })
})
