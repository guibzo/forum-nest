import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, type AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { faker } from '@faker-js/faker'

export const makeAnswer = (override: Partial<AnswerProps> = {}, id?: UniqueEntityID) => {
  const answer = Answer.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id
  )

  return answer
}
