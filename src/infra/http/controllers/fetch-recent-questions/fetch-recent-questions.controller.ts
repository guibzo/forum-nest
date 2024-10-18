import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
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
  constructor(private prisma: PrismaService) {}

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
    const perPage = 10
    const skipHowManyItems = (page - 1) * perPage

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: skipHowManyItems,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      questions,
    }
  }
}
