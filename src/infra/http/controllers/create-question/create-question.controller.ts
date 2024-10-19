import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import type { UserPayload } from '@/infra/auth/jwt-strategy'
import type { ExtendedPrismaClient } from '@/infra/database/prisma/prisma.create-with-slug'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { CustomPrismaService } from 'nestjs-prisma'
import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import {
  createQuestionBodySchema,
  createQuestionResponseSchema,
  type CreateQuestionBodySchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  @Post()
  @ApiBody({ type: createZodDto(createQuestionBodySchema) })
  @ApiOkResponse({
    schema: zodToOpenAPI(createQuestionResponseSchema),
    description: 'Create a question',
  })
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content, title } = body
    const userId = user.sub

    console.log('USERIDIDSAJDUAJSDHUADHU', userId)

    const question = await this.prisma.client.question.createWithSlug({
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
