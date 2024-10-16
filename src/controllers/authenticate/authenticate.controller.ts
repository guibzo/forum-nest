import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  authenticateBodySchema,
  authenticateResponseSchema,
  type AuthenticateBodySchema,
} from './schemas'

@ApiTags('Authentication')
@ApiOkResponse({
  status: 201,
  schema: authenticateResponseSchema,
})
@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const isPasswordCorrect = await compare(password, user.password)

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return {
      acess_token: accessToken,
    }
  }
}
