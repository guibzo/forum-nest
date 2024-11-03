import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import {
  answerQuestionBodySchema,
  AnswerQuestionBodySchema,
  AnswerQuestionRouteParamSchema,
  answerQuestionRouteParamSchema,
} from './schemas'

@ApiTags('Answers')
@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @ApiBody({ type: createZodDto(answerQuestionBodySchema) })
  @ApiResponse({
    description: 'Answer a question',
    status: 201,
  })
  async handle(
    @Body(new ZodValidationPipe(answerQuestionBodySchema)) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId', new ZodValidationPipe(answerQuestionRouteParamSchema))
    questionId: AnswerQuestionRouteParamSchema
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
