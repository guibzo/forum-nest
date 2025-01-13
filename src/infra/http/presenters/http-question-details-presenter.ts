import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { HttpAttachmentPresenter } from './http-attachment-presenter'

export class HttpQuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      id: questionDetails.questionId.toString(),
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
      author: {
        id: questionDetails.author.id.toString(),
        name: questionDetails.author.name,
      },
      attachments: questionDetails.attachments.map((attachment) =>
        HttpAttachmentPresenter.toHTTP(attachment)
      ),
    }
  }
}
