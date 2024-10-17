import { CurrentUser } from '@//auth/current-user.decorator'
import { JwtAuthGuard } from '@//auth/jwt-auth.guard'
import type { UserPayload } from '@//auth/jwt-strategy'
import { ZodValidationPipe } from '@//pipes/zod-validation.pipe'
import { PrismaService } from '@//prisma/prisma.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import {
  createQuestionBodySchema,
  createQuestionResponseSchema,
  type CreateQuestionBodySchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOkResponse({
    schema: createQuestionResponseSchema,
    description: 'Create a question',
  })
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content, title } = body
    const userId = user.sub

    // @ts-ignore
    const question = await this.prisma.question.createWithSlug({
      data: {
        authorId: userId,
        title,
        content,
      },
      sourceField: 'title',
      targetField: 'slug',
      unique: true,
    })

    return { id: question.id }
  }
}
