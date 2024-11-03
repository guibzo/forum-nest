import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases'
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
  editAnswerBodySchema,
  EditAnswerBodySchema,
  editAnswerRouteParamSchema,
  EditAnswerRouteParamSchema,
} from './schemas'

@ApiTags('Answers')
@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiBody({ type: createZodDto(editAnswerBodySchema) })
  @ApiParam({
    name: 'id',
    schema: zodToOpenAPI(editAnswerRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Edit a answer',
  })
  async handle(
    @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id', new ZodValidationPipe(editAnswerRouteParamSchema))
    answerId: EditAnswerRouteParamSchema
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.editAnswer.execute({
      answerId,
      content,
      authorId: userId,
      attachmentsIds: [],
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
