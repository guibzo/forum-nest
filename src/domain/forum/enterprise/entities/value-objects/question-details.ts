import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import type { Attachment } from '../attachment'
import type { Slug } from './slug'

export interface QuestionDetailsProps {
  questionId: UniqueEntityID
  content: string
  title: string
  slug: Slug
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityID | null
  author: {
    id: UniqueEntityID
    name: string
  }
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get author() {
    return this.props.author
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
