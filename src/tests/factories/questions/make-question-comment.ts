import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/repositories/forum/mappers/prisma-question-comment-mapper'
import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'

export const makeQuestionComment = (
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID
) => {
  const questionComment = QuestionComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return questionComment
}

/* eslint-disable */
@Injectable()
export class QuestionCommentFactory {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {}
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.client.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    })

    return questionComment
  }
}
