import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { createQuestionBodySchema, type CreateQuestionBodySchema } from './schemas'

@ApiTags('Questions')
@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  @ApiBody({ type: createZodDto(createQuestionBodySchema) })
  @ApiResponse({
    description: 'Create a question',
  })
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content, title } = body
    const userId = user.sub

    const result = await this.createQuestion.execute({
      content,
      title,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
