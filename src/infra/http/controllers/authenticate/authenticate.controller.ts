import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { compare } from 'bcryptjs'
import { createZodDto, zodToOpenAPI } from 'nestjs-zod'
import {
  authenticateBodySchema,
  authenticateResponseSchema,
  type AuthenticateBodySchema,
} from './schemas'

@ApiTags('Authentication')
@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: createZodDto(authenticateBodySchema) })
  @ApiOkResponse({
    schema: zodToOpenAPI(authenticateResponseSchema),
    description: 'Authenticate with email and password',
  })
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
      access_token: accessToken,
    }
  }
}
