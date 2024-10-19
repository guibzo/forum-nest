import { Module } from '@nestjs/common'
import { CustomPrismaModule } from 'nestjs-prisma'
import { extendedPrismaClient } from './prisma/prisma.create-with-slug'
import { PrismaService } from './prisma/prisma.service'
import {
  PrismaAnswerAttachmentsRepository,
  PrismaAnswerCommentsRepository,
  PrismaAnswersRepository,
  PrismaQuestionAttachmentsRepository,
  PrismaQuestionCommentsRepository,
  PrismaQuestionsRepository,
} from './prisma/repositories/index'

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient
      },
    }),
  ],
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
  exports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient
      },
    }),
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
})
export class DatabaseModule {}
