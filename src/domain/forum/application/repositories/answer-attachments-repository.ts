import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export type AnswerAttachmenttsRepository = {
  findManyByAnswerId: (answerId: string) => Promise<AnswerAttachment[]>
  deleteManyByAnswerId: (answerId: string) => Promise<void>
}
