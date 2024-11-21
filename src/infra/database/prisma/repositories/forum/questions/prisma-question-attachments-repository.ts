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

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const data = await PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.client.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const attachmentIds = attachments.map((attachment) => attachment.id.toString())

    await this.prisma.client.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

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
