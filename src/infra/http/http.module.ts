import { Module } from '@nestjs/common'
import { CustomPrismaModule } from 'nestjs-prisma'
import { extendedPrismaClient } from '../prisma/prisma.create-with-slug'
import { PrismaService } from '../prisma/prisma.service'
import {
  AuthenticateController,
  CreateAccountController,
  CreateQuestionController,
  FetchRecentQuestionsController,
} from './controllers'

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient
      },
    }),
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
