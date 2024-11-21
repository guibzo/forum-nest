import { AnswerAttachmentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaAnswerAttachmentMapper } from './mappers/prisma-answer-attachment-mapper'

/* eslint-disable */
@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepositoryInterface {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const data = await PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.client.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
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

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachemnts = await this.prisma.client.attachment.findMany({
      where: {
        answerId,
      },
    })

    return answerAttachemnts.map((answerAttachemnt) =>
      PrismaAnswerAttachmentMapper.toDomain(answerAttachemnt)
    )
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.client.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }
}
