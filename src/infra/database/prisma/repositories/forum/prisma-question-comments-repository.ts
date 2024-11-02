import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaQuestionCommentMapper } from './mappers/prisma-question-comment-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.client.comment.findUnique({
      where: {
        id,
      },
    })

    if (!questionComment) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const perPage = 10
    const skipHowManyItems = (page - 1) * perPage

    const questionComments = await this.prisma.client.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: skipHowManyItems,
    })

    return questionComments.map((questionComment) =>
      PrismaQuestionCommentMapper.toDomain(questionComment)
    )
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.client.comment.create({
      data,
    })
  }

  async save(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.client.comment.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.client.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }
}
