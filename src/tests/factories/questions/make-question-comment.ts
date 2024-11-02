import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { faker } from '@faker-js/faker'

export const makeQuestionComment = (
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID
) => {
  const questionComment = QuestionComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return questionComment
}
