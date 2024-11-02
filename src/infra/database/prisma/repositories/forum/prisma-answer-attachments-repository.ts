import { AnswerAttachmenttsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Inject, Injectable } from '@nestjs/common'
import type { CustomPrismaService } from 'nestjs-prisma'
import type { ExtendedPrismaClient } from '../../get-extended-prisma-client'
import { PrismaAnswerAttachmentMapper } from './mappers/prisma-answer-attachment-mapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmenttsRepository {
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
