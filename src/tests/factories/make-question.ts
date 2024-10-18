import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question, type QuestionProps } from '@/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

export const makeQuestion = (override: Partial<QuestionProps> = {}, id?: UniqueEntityID) => {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  )

  return question
}
