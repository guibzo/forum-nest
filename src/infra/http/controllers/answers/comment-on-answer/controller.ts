import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import {
  commentOnAnswerBodySchema,
  CommentOnAnswerBodySchema,
  CommentOnAnswerRouteParamSchema,
  commentOnAnswerRouteParamSchema,
} from './schemas'

@ApiTags('Answers')
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @ApiBody({ type: createZodDto(commentOnAnswerBodySchema) })
  @ApiResponse({
    description: 'Comment on a answer',
    status: 201,
  })
  @ApiParam({
    name: 'answerId',
    schema: zodToOpenAPI(commentOnAnswerRouteParamSchema),
    required: true,
  })
  async handle(
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema)) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId', new ZodValidationPipe(commentOnAnswerRouteParamSchema))
    answerId: CommentOnAnswerRouteParamSchema
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    })

    if (result.isFailure()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
