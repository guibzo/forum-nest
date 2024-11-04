import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpAnswerPresenter } from '@/infra/http/presenters/http-answer-presenter'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import {
  fetchQuestionAnswersPageQueryParamSchema,
  fetchQuestionAnswersPageRouteParamSchema,
  fetchQuestionAnswersResponseSchema,
  type FetchQuestionAnswersPageQueryParamSchema,
  type FetchQuestionAnswersPageRouteParamSchema,
} from './schemas'

@ApiTags('Answers')
@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase) {}

  @Get()
  @ApiQuery({
    name: 'page',
    schema: zodToOpenAPI(fetchQuestionAnswersPageQueryParamSchema),
    required: false,
  })
  @ApiParam({
    name: 'id',
    schema: zodToOpenAPI(fetchQuestionAnswersPageRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    schema: zodToOpenAPI(fetchQuestionAnswersResponseSchema),
    description: 'Fetch a list of questions ordened by creation date',
  })
  async handle(
    @Query('query', new ZodValidationPipe(fetchQuestionAnswersPageQueryParamSchema))
    page: FetchQuestionAnswersPageQueryParamSchema,
    @Param('questionId', new ZodValidationPipe(fetchQuestionAnswersPageRouteParamSchema))
    questionId: FetchQuestionAnswersPageRouteParamSchema
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({ page, questionId })

    if (result.isFailure()) {
      throw new BadRequestException()
    }

    const answersFormatted = result.value.answers.map((answer) =>
      HttpAnswerPresenter.toHTTP(answer)
    )

    return {
      answers: answersFormatted,
    }
  }
}
