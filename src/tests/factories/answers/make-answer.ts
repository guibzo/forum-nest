import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, type AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { PrismaAnswerMapper } from '@/infra/database/prisma/repositories/forum/answers/mappers/prisma-answer-mapper'
import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'

export const makeAnswer = (override: Partial<AnswerProps> = {}, id?: UniqueEntityID) => {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return answer
}

/* eslint-disable */
@Injectable()
export class AnswerFactory {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.client.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })

    return answer
  }
}
