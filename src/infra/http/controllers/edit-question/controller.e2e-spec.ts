import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from '@/tests/factories/questions/make-question'
import { StudentFactory } from '@/tests/factories/students/make-student'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Edit question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to edit a question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
    const questionId = question.id.toString()

    const questionEditedData = {
      title: 'New question title',
      content: 'New question content',
    }

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(questionEditedData)

    expect(response.status).toBe(204)

    const questionOnDB = await prisma.question.findFirst({
      where: {
        title: questionEditedData.title,
        content: questionEditedData.content,
      },
    })

    expect(questionOnDB).toBeTruthy()
  })
})