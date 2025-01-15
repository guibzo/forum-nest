import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/tests/factories/attachments/make-attachment'
import { QuestionFactory } from '@/tests/factories/questions/make-question'
import { StudentFactory } from '@/tests/factories/students/make-student'
import { waitFor } from '@/tests/utils/wait-for'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('On answer created (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when a answer is created', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
    const questionId = question.id.toString()

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New answer title',
        content: 'New answer content',
      })

    await waitFor(async () => {
      const notificationOnDB = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      })

      expect(notificationOnDB).toBeTruthy()
    })
  })
})
