import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createquestionBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createquestionBodySchema>

@Controller('/sessions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createquestionBodySchema))
  async handle(@Body() body: CreateQuestionBodySchema) {}
}
