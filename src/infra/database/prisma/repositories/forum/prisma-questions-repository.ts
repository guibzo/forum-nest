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

  findBySlug: (slug: string) => Promise<Question | null>

  findManyRecent: (params: PaginationParams) => Promise<Question[]>

  create: (question: Question) => Promise<void>

  delete: (question: Question) => Promise<void>

  save: (question: Question) => Promise<void>
}
