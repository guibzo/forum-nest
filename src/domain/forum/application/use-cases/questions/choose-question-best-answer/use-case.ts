import { failure, success, type Either } from '@/core/either-failure-or-success'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import {
  AnswersRepositoryInterface,
  QuestionsRepositoryInterface,
} from '@/domain/forum/application/repositories'
import { Question } from '@/domain/forum/enterprise/entities/question'

type ChooseQuestionBestAnswerUseCaseRequest = {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepositoryInterface,
    private answersRepository: AnswersRepositoryInterface
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return failure(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if (!question) {
      return failure(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return failure(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return success({
      question,
    })
  }
}