import type { AnswerAttachmenttsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmenttsRepository {
  findManyByAnswerId: (answerId: string) => Promise<AnswerAttachment[]>
  deleteManyByAnswerId: (answerId: string) => Promise<void>
}
