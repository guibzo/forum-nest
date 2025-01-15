import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/@errors/student-already-exists-error'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import {
  createAccountBodySchema,
  CreateAccountBodySchema,
  createAccountResponseSchema,
} from './schemas'

@ApiTags('Account')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @ApiBody({ type: createZodDto(createAccountBodySchema) })
  @ApiResponse({
    schema: zodToOpenAPI(createAccountResponseSchema),
    description: 'Create account with email and password',
    status: 201,
  })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({ name, email, password })

    if (result.isFailure()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { id: result.value.student.id }
  }
}
