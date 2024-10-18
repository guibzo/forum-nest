import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export type AnswerCommentsRepository = {
  create(answerComment: AnswerComment): Promise<void>
  findManyByAnswerId: (answerId: string, params: PaginationParams) => Promise<AnswerComment[]>
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
}
