import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtStrategy } from './jwt-strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const jwtSecret = env.get('JWT_PRIVATE_KEY')
        const jwtPublic = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: {
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(jwtSecret, 'base64'),
          publicKey: Buffer.from(jwtPublic, 'base64'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
