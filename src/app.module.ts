import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { envSchema } from './env'
import { PrismaService } from './prisma/prisma.service'

import {
  AuthenticateController,
  CreateAccountController,
  CreateQuestionController,
} from './controllers'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController],
  providers: [PrismaService],
})
export class AppModule {}
