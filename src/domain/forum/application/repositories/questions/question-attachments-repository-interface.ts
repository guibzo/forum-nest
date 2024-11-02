import { QuestionAttachment } from '@/domain/forum/enterprise/entities//question-attachment'

export type QuestionAttachmenttsRepositoryInterface = {
  findManyByQuestionId: (questionId: string) => Promise<QuestionAttachment[]>
  deleteManyByQuestionId: (questionId: string) => Promise<void>
}
