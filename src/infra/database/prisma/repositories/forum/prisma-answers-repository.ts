import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaAnswerMapper } from './mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.client.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
    const perPage = 10
    const skipHowManyItems = (page - 1) * perPage

    const answers = await this.prisma.client.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: skipHowManyItems,
    })

    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer))
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.client.answer.create({
      data,
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.client.answer.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.client.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }
}
