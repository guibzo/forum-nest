import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases'
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
import { ReadNotificationRouteParamSchema, readNotificationRouteParamSchema } from './schemas'

@ApiTags('Notifications')
@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @ApiParam({
    name: 'notificationId',
    schema: zodToOpenAPI(readNotificationRouteParamSchema),
    required: true,
  })
  @ApiResponse({
    description: 'Read a notification',
    status: 204,
  })
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId', new ZodValidationPipe(readNotificationRouteParamSchema))
    notificationId: ReadNotificationRouteParamSchema
  ) {
    const userId = user.sub

    const result = await this.readNotification.execute({
      notificationId,
      recipientId: userId,
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
