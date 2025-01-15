import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import {
  editQuestionBodySchema,
  EditQuestionBodySchema,
  editQuestionRouteParamSchema,
  EditQuestionRouteParamSchema,
} from './schemas'

@ApiTags('Questions')
@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @ApiBody({ type: createZodDto(editQuestionBodySchema) })
  @ApiParam({
    name: 'id',
    schema: zodToOpenAPI(editQuestionRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Edit a question',
  })
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id', new ZodValidationPipe(editQuestionRouteParamSchema))
    questionId: EditQuestionRouteParamSchema
  ) {
    const { content, title, attachmentsIds } = body
    const userId = user.sub

    const result = await this.editQuestion.execute({
      content,
      title,
      authorId: userId,
      attachmentsIds,
      questionId,
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
