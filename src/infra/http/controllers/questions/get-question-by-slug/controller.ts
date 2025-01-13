import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpQuestionDetailsPresenter } from '@/infra/http/presenters/http-question-details-presenter'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import {
  GetQuestionBySlugRouteParamSchema,
  getQuestionBySlugResponseSchema,
  getQuestionBySlugRouteParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlugUseCase: GetQuestionBySlugUseCase) {}

  @Get()
  @ApiParam({
    name: 'slug',
    schema: zodToOpenAPI(getQuestionBySlugRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    schema: zodToOpenAPI(getQuestionBySlugResponseSchema),
    description: 'Get a question by slug',
  })
  async handle(
    @Param('slug', new ZodValidationPipe(getQuestionBySlugRouteParamSchema))
    slug: GetQuestionBySlugRouteParamSchema
  ) {
    const result = await this.getQuestionBySlugUseCase.execute({ slug })

    if (result.isFailure()) {
      throw new BadRequestException()
    }

    const questionFormatted = HttpQuestionDetailsPresenter.toHTTP(result.value.question)

    return {
      question: questionFormatted,
    }
  }
}
