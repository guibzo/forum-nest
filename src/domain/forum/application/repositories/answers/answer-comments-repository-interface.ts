import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities//answer-comment'

export type AnswerCommentsRepositoryInterface = {
  create(answerComment: AnswerComment): Promise<void>
  findManyByAnswerId: (answerId: string, params: PaginationParams) => Promise<AnswerComment[]>
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
}
