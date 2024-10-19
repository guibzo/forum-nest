import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { HttpModule } from './http/http.module'

import { AuthModule } from './auth/auth.module'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
