import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/tests/factories/answers/make-answer'
import { AnswerAttachmentFactory } from '@/tests/factories/answers/make-answer-attachment'
import { AttachmentFactory } from '@/tests/factories/attachments/make-attachment'
import { QuestionFactory } from '@/tests/factories/questions/make-question'
import { StudentFactory } from '@/tests/factories/students/make-student'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to edit a answer', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const [attachment1, attachment2, attachment3] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ])

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })
    const answerId = answer.id.toString()

    await Promise.all([
      answerAttachmentFactory.makePrismaAnswerAttachment({
        answerId: answer.id,
        attachmentId: attachment1.id,
      }),
      answerAttachmentFactory.makePrismaAnswerAttachment({
        answerId: answer.id,
        attachmentId: attachment2.id,
      }),
    ])

    const updatedContent = 'New answer content'

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: updatedContent,
        attachmentsIds: [attachment1.id.toString(), attachment3.id.toString()],
      })

    const updatedAnswerOnDB = await prisma.answer.findFirst({
      where: {
        content: updatedContent,
      },
    })

    expect(updatedAnswerOnDB).toMatchObject({
      content: updatedContent,
    })

    const attachmentsOnDB = await prisma.attachment.findMany({
      where: {
        answerId: updatedAnswerOnDB?.id,
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
