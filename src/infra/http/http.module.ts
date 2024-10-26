import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/questions/fetch-recent-questions'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import {
  AuthenticateController,
  CreateAccountController,
  CreateQuestionController,
  FetchRecentQuestionsController,
} from './controllers'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
