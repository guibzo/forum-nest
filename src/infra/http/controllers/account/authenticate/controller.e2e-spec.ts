import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from '@/tests/factories/students/make-student'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  it('should be able to authenticate', async () => {
    const authenticationData = {
      email: 'johndoe@example.com',
      password: '123456',
    }

    await studentFactory.makePrismaStudent({
      email: authenticationData.email,
      password: await hash(authenticationData.password, 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send(authenticationData)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    })
  })
})
