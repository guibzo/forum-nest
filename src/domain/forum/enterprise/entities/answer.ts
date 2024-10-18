import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerCreatedEvent } from '../events/answer-created-event'
import { AnswerAttachmentsList } from './answer-attachments-list'

export type AnswerProps = {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  attachments: AnswerAttachmentsList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get content() {
    return this.props.content
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get summary() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set attachments(attachments: AnswerAttachmentsList) {
    this.props.attachments = attachments
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'>, id?: UniqueEntityID) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentsList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    const isNewAnswer = !id
    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
