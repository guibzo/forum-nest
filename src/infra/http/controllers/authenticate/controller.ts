import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import {
  authenticateBodySchema,
  AuthenticateBodySchema,
  authenticateResponseSchema,
} from './schemas'

@ApiTags('Authentication')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @ApiBody({ type: createZodDto(authenticateBodySchema) })
  @ApiResponse({
    schema: zodToOpenAPI(authenticateResponseSchema),
    description: 'Authenticate with email and password',
    status: 201,
  })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isFailure()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      accessToken: result.value.accessToken,
    }
  }
}
