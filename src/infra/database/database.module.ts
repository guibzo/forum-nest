import {
  QuestionsRepositoryInterface,
  StudentsRepositoryInterface,
} from '@/domain/forum/application/repositories'
import { Module } from '@nestjs/common'
import { CustomPrismaModule } from 'nestjs-prisma'
import { getExtendedPrismaClient } from './prisma/get-extended-prisma-client'
import { PrismaService } from './prisma/prisma.service'
import { PrismaStudentsRepository } from './prisma/repositories/forum/prisma-students-repository'
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
        const extendedPrismaClient = getExtendedPrismaClient()
        return extendedPrismaClient
      },
    }),
  ],
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaStudentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    {
      provide: QuestionsRepositoryInterface,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepositoryInterface,
      useClass: PrismaStudentsRepository,
    },
  ],
  exports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        const extendedPrismaClient = getExtendedPrismaClient()
        return extendedPrismaClient
      },
    }),
    PrismaService,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    QuestionsRepositoryInterface,
    StudentsRepositoryInterface,
  ],
})
export class DatabaseModule {}
