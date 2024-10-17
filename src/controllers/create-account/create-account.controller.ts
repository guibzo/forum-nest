import { ZodValidationPipe } from '@//pipes/zod-validation.pipe'
import { PrismaService } from '@//prisma/prisma.service'
import { Body, ConflictException, Controller, Post, UsePipes } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import {
  createAccountBodySchema,
  createAccountResponseSchema,
  type CreateAccountBodySchema,
} from './schemas'

@ApiTags('Account')
@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOkResponse({
    schema: createAccountResponseSchema,
    description: 'Create account with email and password',
  })
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    const hashedPasswored = await hash(password, 8)

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPasswored,
      },
    })

    return { id: user.id }
  }
}
