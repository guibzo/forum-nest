import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from '@/tests/factories/answers/make-answer'
import { AnswerCommentFactory } from '@/tests/factories/answers/make-answer-comment'
import { QuestionFactory } from '@/tests/factories/questions/make-question'
import { StudentFactory } from '@/tests/factories/students/make-student'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to list a answer comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })
    const answerId = answer.id.toString()

    const comments = Array.from({ length: 2 }).map((_, i) => ({
      content: `Answer ${i} comment content`,
      authorId: user.id,
      questionId: question.id,
    }))

    await Promise.all(
      comments.map(async (item) => {
        await answerCommentFactory.makePrismaAnswerComment({
          authorId: user.id,
          content: item.content,
          answerId: answer.id,
        })
      })
    )

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: comments[0].content,
          author: expect.objectContaining({
            name: 'John Doe',
            id: comments[0].authorId.toString(),
          }),
        }),
        expect.objectContaining({
          content: comments[1].content,
          author: expect.objectContaining({
            name: 'John Doe',
            id: comments[1].authorId.toString(),
          }),
        }),
      ]),
    })
  })
})
