import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'

import {
  AnswerQuestionUseCase,
  AuthenticateStudentUseCase,
  ChooseQuestionBestAnswerUseCase,
  CommentOnQuestionUseCase,
  CreateQuestionUseCase,
  DeleteAnswerUseCase,
  DeleteQuestionUseCase,
  EditAnswerUseCase,
  EditQuestionUseCase,
  FetchQuestionAnswersUseCase,
  FetchRecentQuestionsUseCase,
  GetQuestionBySlugUseCase,
  RegisterStudentUseCase,
} from '@/domain/forum/application/use-cases'
import {
  AnswerQuestionController,
  AuthenticateController,
  ChooseQuestionBestAnswerController,
  CommentOnQuestionController,
  CreateAccountController,
  CreateQuestionController,
  DeleteAnswerController,
  DeleteQuestionController,
  EditAnswerController,
  EditQuestionController,
  FetchQuestionAnswersController,
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
    EditAnswerController,
    DeleteQuestionController,
    AnswerQuestionController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    EditAnswerUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
  ],
})
export class HttpModule {}
