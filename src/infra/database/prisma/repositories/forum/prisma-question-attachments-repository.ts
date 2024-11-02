import { QuestionAttachmenttsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { ExtendedPrismaClient } from '../../get-extended-prisma-client'
import { PrismaQuestionAttachmentMapper } from './mappers/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmenttsRepository {
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
