import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import {
  chooseQuestionBestAnswerRouteParamSchema,
  ChooseQuestionBestAnswerRouteParamSchema,
} from './schemas'

@ApiTags('Answers')
@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiParam({
    name: 'answerId',
    schema: zodToOpenAPI(chooseQuestionBestAnswerRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Choose a question best answer',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId', new ZodValidationPipe(chooseQuestionBestAnswerRouteParamSchema))
    answerId: ChooseQuestionBestAnswerRouteParamSchema
  ) {
    const userId = user.sub

    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId,
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
