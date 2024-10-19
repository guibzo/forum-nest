import type { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/questions/create-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import type { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
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
  constructor(private createQuestion: CreateQuestionUseCase) {}

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

    await this.createQuestion.execute({ content, title, authorId: userId, attachmentsIds: [] })
  }
}
