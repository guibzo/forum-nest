import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaAnswerCommentMapper } from './mappers/prisma-answer-comment-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepositoryInterface {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.client.comment.findUnique({
      where: {
        id,
      },
    })

    if (!answerComment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
    const perPage = 10
    const skipHowManyItems = (page - 1) * perPage

    const answerComments = await this.prisma.client.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: skipHowManyItems,
    })

    return answerComments.map((answerComment) => PrismaAnswerCommentMapper.toDomain(answerComment))
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.client.comment.create({
      data,
    })
  }

  async save(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.client.comment.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.client.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    })
  }
}
