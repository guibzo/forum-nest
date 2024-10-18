import type { AnswerAttachmenttsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmenttsRepository {
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter((item) => item.answerId.toString() === answerId)

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter((item) => item.answerId.toString() !== answerId)

    this.items = answerAttachments
  }
}
