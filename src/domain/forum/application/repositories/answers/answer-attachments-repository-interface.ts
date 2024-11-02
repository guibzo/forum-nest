import { AnswerAttachment } from '@/domain/forum/enterprise/entities//answer-attachment'

export type AnswerAttachmenttsRepositoryInterface = {
  findManyByAnswerId: (answerId: string) => Promise<AnswerAttachment[]>
  deleteManyByAnswerId: (answerId: string) => Promise<void>
}
