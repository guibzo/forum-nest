import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import {
  commentOnQuestionBodySchema,
  CommentOnQuestionBodySchema,
  CommentOnQuestionRouteParamSchema,
  commentOnQuestionRouteParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @ApiBody({ type: createZodDto(commentOnQuestionBodySchema) })
  @ApiResponse({
    description: 'Comment on a question',
    status: 201,
  })
  async handle(
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema)) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId', new ZodValidationPipe(commentOnQuestionRouteParamSchema))
    questionId: CommentOnQuestionRouteParamSchema
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
