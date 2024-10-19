import type { QuestionAttachmenttsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmenttsRepository {
  findManyByQuestionId: (questionId: string) => Promise<QuestionAttachment[]>
  deleteManyByQuestionId: (questionId: string) => Promise<void>
}
