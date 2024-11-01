import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/questions/fetch-recent-questions'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { HttpQuestionPresenter } from '../../presenters/http-question-presenter'
import {
  fetchRecentQuestionsPageParamSchema,
  fetchRecentQuestionsResponseSchema,
  type FetchRecentQuestionsPageParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase) {}

  @Get()
  @ApiQuery({
    name: 'page',
    schema: zodToOpenAPI(fetchRecentQuestionsPageParamSchema),
    required: false,
  })
  @ApiOkResponse({
    schema: zodToOpenAPI(fetchRecentQuestionsResponseSchema),
    description: 'Get a list of questions ordened by creation date',
  })
  async handle(
    @Query('query', new ZodValidationPipe(fetchRecentQuestionsPageParamSchema))
    page: FetchRecentQuestionsPageParamSchema
  ) {
    const result = await this.fetchRecentQuestionsUseCase.execute({ page })

    if (result.isFailure()) {
      throw new BadRequestException()
    }

    const questionsFormatted = result.value.questions.map((question) =>
      HttpQuestionPresenter.toHTTP(question)
    )

    return {
      questions: questionsFormatted,
    }
  }
}
