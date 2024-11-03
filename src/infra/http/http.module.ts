import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'

import {
  AuthenticateStudentUseCase,
  CreateQuestionUseCase,
  EditQuestionUseCase,
  FetchRecentQuestionsUseCase,
  GetQuestionBySlugUseCase,
  RegisterStudentUseCase,
} from '@/domain/forum/application/use-cases'
import {
  AuthenticateController,
  CreateAccountController,
  CreateQuestionController,
  EditQuestionController,
  FetchRecentQuestionsController,
  GetQuestionBySlugController,
} from './controllers'

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
  ],
})
export class HttpModule {}
