import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'

export const makeAnswerComment = (
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID
) => {
  const answerComment = AnswerComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return answerComment
}
