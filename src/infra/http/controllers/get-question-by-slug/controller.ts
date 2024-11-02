import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/questions/get-question-by-slug'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpQuestionPresenter } from '@/infra/http/presenters/http-question-presenter'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
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
  @ApiQuery({
    name: 'slug',
    schema: zodToOpenAPI(getQuestionBySlugRouteParamSchema),
    required: true,
  })
  @ApiOkResponse({
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

    const questionFormatted = HttpQuestionPresenter.toHTTP(result.value.question)

    return {
      question: questionFormatted,
    }
  }
}
