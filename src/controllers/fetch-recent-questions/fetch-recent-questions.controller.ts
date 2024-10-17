import { JwtAuthGuard } from '@//auth/jwt-auth.guard'
import { ZodValidationPipe } from '@//pipes/zod-validation.pipe'
import { PrismaService } from '@//prisma/prisma.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
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
  @ApiOkResponse({
    schema: fetchRecentQuestionsResponseSchema,
    description: 'Get a list of questions ordened by creation date',
  })
  async handle(
    @Query('page', new ZodValidationPipe(fetchRecentQuestionsPageParamSchema))
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
