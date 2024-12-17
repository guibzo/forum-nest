import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpCommentWithAuthorPresenter } from '@/infra/http/presenters/http-comment-with-author-presenter'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import {
  fetchQuestionCommentsPageQueryParamSchema,
  fetchQuestionCommentsPageRouteParamSchema,
  fetchQuestionCommentsResponseSchema,
  type FetchQuestionCommentsPageQueryParamSchema,
  type FetchQuestionCommentsPageRouteParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase) {}

  @Get()
  @ApiQuery({
    name: 'page',
    schema: zodToOpenAPI(fetchQuestionCommentsPageQueryParamSchema),
    required: false,
  })
  @ApiParam({
    name: 'questionId',
    schema: zodToOpenAPI(fetchQuestionCommentsPageRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    schema: zodToOpenAPI(fetchQuestionCommentsResponseSchema),
    description: 'Fetch a list of a question comments',
  })
  async handle(
    @Query('query', new ZodValidationPipe(fetchQuestionCommentsPageQueryParamSchema))
    page: FetchQuestionCommentsPageQueryParamSchema,
    @Param('questionId', new ZodValidationPipe(fetchQuestionCommentsPageRouteParamSchema))
    questionId: FetchQuestionCommentsPageRouteParamSchema
  ) {
    const result = await this.fetchQuestionCommentsUseCase.execute({ page, questionId })

    if (result.isFailure()) {
      throw new BadRequestException()
    }

    const commentsFormatted = result.value.comments.map((comment) =>
      HttpCommentWithAuthorPresenter.toHTTP(comment)
    )

    console.log('comments', commentsFormatted)

    return {
      comments: commentsFormatted,
    }
  }
}
