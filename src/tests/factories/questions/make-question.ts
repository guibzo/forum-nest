import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { PrismaQuestionMapper } from '@/infra/database/prisma/repositories/forum/mappers/prisma-question-mapper'
import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'

export const makeQuestion = (override: Partial<QuestionProps> = {}, id?: UniqueEntityID) => {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  )

  return question
}

/* eslint-disable */
@Injectable()
export class QuestionFactory {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.client.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
