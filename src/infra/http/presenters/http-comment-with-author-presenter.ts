import type { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class HttpCommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      id: commentWithAuthor.commentId.toString(),
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
      author: {
        name: commentWithAuthor.author.name,
        id: commentWithAuthor.author.id.toString(),
      },
    }
  }
}
