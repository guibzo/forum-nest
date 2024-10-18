import type { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export type QuestionAttachmenttsRepository = {
  findManyByQuestionId: (questionId: string) => Promise<QuestionAttachment[]>
  deleteManyByQuestionId: (questionId: string) => Promise<void>
}
