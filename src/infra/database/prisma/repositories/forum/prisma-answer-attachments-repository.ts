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
