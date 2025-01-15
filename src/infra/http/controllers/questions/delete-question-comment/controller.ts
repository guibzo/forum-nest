import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases'
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
  deleteQuestionCommentRouteParamSchema,
  type DeleteQuestionCommentRouteParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions/comments/:commentId')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @ApiResponse({
    description: 'Delete a question comment',
    status: 204,
  })
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId', new ZodValidationPipe(deleteQuestionCommentRouteParamSchema))
    commentId: DeleteQuestionCommentRouteParamSchema
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId: commentId,
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
