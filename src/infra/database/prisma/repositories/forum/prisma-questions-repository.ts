import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { Inject, Injectable } from '@nestjs/common'
import type { CustomPrismaService } from 'nestjs-prisma'
import type { ExtendedPrismaClient } from '../../prisma.create-with-slug'
import { PrismaQuestionMapper } from './mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.client.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.client.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const perPage = 10
    const skipHowManyItems = (page - 1) * perPage

    const questions = await this.prisma.client.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: skipHowManyItems,
    })

    return questions.map((question) => PrismaQuestionMapper.toDomain(question))
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.client.question.create({
      data,
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.client.question.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.client.question.delete({
      where: {
        id: data.id,
      },
    })
  }
}
