import { Module } from '@nestjs/common'
import { CustomPrismaModule } from 'nestjs-prisma'
import { getExtendedPrismaClient } from './prisma/get-extended-prisma-client'
import { PrismaService } from './prisma/prisma.service'

import {
  AnswerAttachmentsRepositoryInterface,
  AnswerCommentsRepositoryInterface,
  AnswersRepositoryInterface,
  AttachmentsRepositoryInterface,
  QuestionAttachmentsRepositoryInterface,
  QuestionCommentsRepositoryInterface,
  QuestionsRepositoryInterface,
  StudentsRepositoryInterface,
} from '@/domain/forum/application/repositories'
import { NotificationsRepositoryInterface } from '@/domain/notification/application/repositories/notifications-repository-interface'
import {
  PrismaAnswerAttachmentsRepository,
  PrismaAnswerCommentsRepository,
  PrismaAnswersRepository,
  PrismaAttachmentsRepository,
  PrismaQuestionAttachmentsRepository,
  PrismaQuestionCommentsRepository,
  PrismaQuestionsRepository,
  PrismaStudentsRepository,
} from './prisma/repositories/index'
import { PrismaNotificationsRepository } from './prisma/repositories/notification/prisma-notifications-repository'

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
    {
      useClass: PrismaQuestionsRepository,
      provide: QuestionsRepositoryInterface,
    },
    {
      useClass: PrismaStudentsRepository,
      provide: StudentsRepositoryInterface,
    },
    {
      useClass: PrismaQuestionCommentsRepository,
      provide: QuestionCommentsRepositoryInterface,
    },
    {
      useClass: PrismaAnswersRepository,
      provide: AnswersRepositoryInterface,
    },
    {
      useClass: PrismaAnswerCommentsRepository,
      provide: AnswerCommentsRepositoryInterface,
    },
    {
      useClass: PrismaAnswerAttachmentsRepository,
      provide: AnswerAttachmentsRepositoryInterface,
    },
    {
      provide: QuestionsRepositoryInterface,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepositoryInterface,
      useClass: PrismaStudentsRepository,
    },
    {
      useClass: PrismaAttachmentsRepository,
      provide: AttachmentsRepositoryInterface,
    },
    {
      useClass: PrismaQuestionAttachmentsRepository,
      provide: QuestionAttachmentsRepositoryInterface,
    },
    {
      useClass: PrismaNotificationsRepository,
      provide: NotificationsRepositoryInterface,
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
    AnswerAttachmentsRepositoryInterface,
    AttachmentsRepositoryInterface,
    AnswerCommentsRepositoryInterface,
    QuestionAttachmentsRepositoryInterface,
    AnswersRepositoryInterface,
    QuestionCommentsRepositoryInterface,
    QuestionsRepositoryInterface,
    StudentsRepositoryInterface,
    NotificationsRepositoryInterface,
  ],
})
export class DatabaseModule {}
