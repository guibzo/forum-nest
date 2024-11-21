import { AnswerAttachmentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepositoryInterface {
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter((item) => item.answerId.toString() === answerId)

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter((item) => item.answerId.toString() !== answerId)

    this.items = answerAttachments
  }

  async createMany(attachments: AnswerAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })
  }
}
