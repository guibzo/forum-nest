import { QuestionAttachmentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaQuestionAttachmentMapper } from './mappers/prisma-question-attachment-mapper'

/* eslint-disable */
@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepositoryInterface {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const answerAttachemnts = await this.prisma.client.attachment.findMany({
      where: {
        questionId,
      },
    })

    return answerAttachemnts.map((answerAttachemnt) =>
      PrismaQuestionAttachmentMapper.toDomain(answerAttachemnt)
    )
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.client.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
