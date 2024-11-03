import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/repositories/forum/mappers/prisma-answer-comment-mapper'
import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'

export const makeAnswerComment = (
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID
) => {
  const answerComment = AnswerComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return answerComment
}

/* eslint-disable */
@Injectable()
export class QuestionFactory {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prisma.client.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    })

    return answerComment
  }
}
