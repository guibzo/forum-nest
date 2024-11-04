import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from '@/tests/factories/answers/make-answer'
import { QuestionFactory } from '@/tests/factories/questions/make-question'
import { StudentFactory } from '@/tests/factories/students/make-student'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to list a question answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
    const questionId = question.id.toString()

    const answers = Array.from({ length: 2 }).map((_, i) => ({
      content: `Answer ${i} content`,
      authorId: user.id,
      questionId: question.id,
    }))

    await Promise.all([
      answers.map(async (item) => {
        await answerFactory.makePrismaAnswer({
          authorId: user.id,
          content: item.content,
          questionId: item.questionId,
        })
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({
          authorId: answers[0].authorId.toString(),
          questionId: answers[0].questionId.toString(),
          content: answers[0].content,
        }),
        expect.objectContaining({
          authorId: answers[1].authorId.toString(),
          questionId: answers[1].questionId.toString(),
          content: answers[1].content,
        }),
      ]),
    })
  })
})
