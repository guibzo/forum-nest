import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it('should be able to authenticate', async () => {
    const authenticationData = {
      email: 'johndoe@example.com',
      password: '123456',
    }

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: authenticationData.email,
        password: await hash(authenticationData.password, 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send(authenticationData)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
