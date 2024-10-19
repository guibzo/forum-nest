import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases'
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
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
