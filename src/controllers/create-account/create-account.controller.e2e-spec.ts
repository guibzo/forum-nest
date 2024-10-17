import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E)', () => {
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

  it('should be able to create a account', async () => {
    const accountCreationData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    }

    const response = await request(app.getHttpServer()).post('/accounts').send(accountCreationData)
    expect(response.status).toBe(201)

    const userOnDB = await prisma.user.findUnique({
      where: {
        email: accountCreationData.email,
      },
    })

    expect(userOnDB).toBeTruthy()
  })
})
