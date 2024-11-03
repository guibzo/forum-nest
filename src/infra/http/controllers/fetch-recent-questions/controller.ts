import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpQuestionPresenter } from '@/infra/http/presenters/http-question-presenter'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import {
  fetchRecentQuestionsPageQueryParamSchema,
  fetchRecentQuestionsResponseSchema,
  type FetchRecentQuestionsPageQueryParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase) {}

  @Get()
  @ApiQuery({
    name: 'page',
    schema: zodToOpenAPI(fetchRecentQuestionsPageQueryParamSchema),
    required: false,
  })
  @ApiResponse({
    schema: zodToOpenAPI(fetchRecentQuestionsResponseSchema),
    description: 'Fetch a list of questions ordened by creation date',
  })
  async handle(
    @Query('query', new ZodValidationPipe(fetchRecentQuestionsPageQueryParamSchema))
    page: FetchRecentQuestionsPageQueryParamSchema
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
