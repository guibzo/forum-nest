import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  QuestionAttachmentsRepositoryInterface,
  QuestionsRepositoryInterface,
} from '@/domain/forum/application/repositories'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaQuestionDetailsMapper } from './mappers/prisma-question-details-mapper'
import { PrismaQuestionMapper } from './mappers/prisma-question-mapper'

/* eslint-disable */
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepositoryInterface {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
    private cacheRepository: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepositoryInterface
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

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)
      return cachedData
    }

    const question = await this.prisma.client.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    await this.cacheRepository.set(`question:${slug}:details`, JSON.stringify(questionDetails))

    return questionDetails
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

    await this.prisma.client.question.createWithSlug({
      data,
      sourceField: 'title',
      targetField: 'slug',
      unique: true,
    })

    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      this.prisma.client.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(question.attachments.getNewItems()),
      this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems()),
      this.cacheRepository.delete(`question:${data.slug}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.client.question.delete({
      where: {
        id: question.id.toString(),
      },
    })
  }
}
