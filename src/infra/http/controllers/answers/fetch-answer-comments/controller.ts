import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpCommentPresenter } from '@/infra/http/presenters/http-comment-presenter'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import {
  fetchAnswerCommentsPageQueryParamSchema,
  fetchAnswerCommentsPageRouteParamSchema,
  fetchAnswerCommentsResponseSchema,
  type FetchAnswerCommentsPageQueryParamSchema,
  type FetchAnswerCommentsPageRouteParamSchema,
} from './schemas'

@ApiTags('Answers')
@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  @ApiQuery({
    name: 'page',
    schema: zodToOpenAPI(fetchAnswerCommentsPageQueryParamSchema),
    required: false,
  })
  @ApiParam({
    name: 'answerId',
    schema: zodToOpenAPI(fetchAnswerCommentsPageRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    schema: zodToOpenAPI(fetchAnswerCommentsResponseSchema),
    description: 'Fetch a list of a answer comments',
  })
  async handle(
    @Query('query', new ZodValidationPipe(fetchAnswerCommentsPageQueryParamSchema))
    page: FetchAnswerCommentsPageQueryParamSchema,
    @Param('answerId', new ZodValidationPipe(fetchAnswerCommentsPageRouteParamSchema))
    answerId: FetchAnswerCommentsPageRouteParamSchema
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({ page, answerId })

    if (result.isFailure()) {
      throw new BadRequestException()
    }

    const commentsFormatted = result.value.answerComments.map((comment) =>
      HttpCommentPresenter.toHTTP(comment)
    )

    return {
      comments: commentsFormatted,
    }
  }
}
