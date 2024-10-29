import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to list recent questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const questions = Array.from({ length: 2 }).map((_, i) => ({
      title: `Question ${i} title`,
      content: `Question ${i} content`,
      slug: `question-${i}`,
      authorId: user.id,
    }))

    await prisma.question.createMany({
      data: questions,
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: questions[0].title,
        }),
        expect.objectContaining({
          title: questions[1].title,
        }),
      ]),
    })
  })
})
