import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'

import { envSchema } from './env/env'
import { EnvService } from './env/env.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HttpModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
