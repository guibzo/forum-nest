import type { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/questions/fetch-recent-questions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import {
  fetchRecentQuestionsPageParamSchema,
  fetchRecentQuestionsResponseSchema,
  type FetchRecentQuestionsPageParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions')
@UseGuards(JwtAuthGuard)
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
    // const perPage = 10
    // const skipHowManyItems = (page - 1) * perPage

    const questions = await this.fetchRecentQuestionsUseCase.execute({ page })

    return {
      questions,
    }
  }
}
