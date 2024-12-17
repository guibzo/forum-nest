import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities//answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentsRepositoryInterface {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findManyByAnswerId: (
    answerId: string,
    params: PaginationParams
  ) => Promise<AnswerComment[]>
  abstract findManyByAnswerIdWithAuthor: (
    answerId: string,
    params: PaginationParams
  ) => Promise<CommentWithAuthor[]>

  abstract findById(id: string): Promise<AnswerComment | null>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
