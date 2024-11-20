import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/tests/factories/attachments/make-attachment'
import { QuestionAttachmentFactory } from '@/tests/factories/attachments/make-question-attachment'
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
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to edit a question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const [attachment1, attachment2, attachment3] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ])

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
    const questionId = question.id.toString()

    await Promise.all([
      questionAttachmentFactory.makePrismaQuestionAttachment({
        questionId: question.id,
        attachmentId: attachment1.id,
      }),
      questionAttachmentFactory.makePrismaQuestionAttachment({
        questionId: question.id,
        attachmentId: attachment2.id,
      }),
    ])

    const updatedTitle = 'New question title'
    const updatedContent = 'New question content'

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: updatedTitle,
        content: updatedContent,
        attachmentsIds: [attachment1.id.toString(), attachment3.id.toString()],
      })

    expect(response.status).toBe(204)

    const updatedQuestionOnDB = await prisma.question.findFirst({
      where: {
        title: 'New question title',
        content: 'New question content',
      },
    })

    expect(updatedQuestionOnDB).toMatchObject({
      title: updatedTitle,
      content: updatedContent,
    })

    const attachmentsOnDB = await prisma.attachment.findMany({
      where: {
        questionId: updatedQuestionOnDB?.id,
      },
    })

    expect(attachmentsOnDB).toHaveLength(2)
    expect(attachmentsOnDB).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ])
    )
  })
})
