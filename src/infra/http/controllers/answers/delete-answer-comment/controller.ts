import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  deleteAnswerCommentRouteParamSchema,
  type DeleteAnswerCommentRouteParamSchema,
} from './schemas'

@ApiTags('Answers')
@Controller('/answers/comments/:commentId')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiResponse({
    description: 'Delete a answer comment',
    status: 204,
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId', new ZodValidationPipe(deleteAnswerCommentRouteParamSchema))
    commentId: DeleteAnswerCommentRouteParamSchema
  ) {
    const userId = user.sub

    const result = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId: commentId,
    })

    if (result.isFailure()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
