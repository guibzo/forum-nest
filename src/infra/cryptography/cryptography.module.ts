import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/forum/application/gateways/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/gateways/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/gateways/cryptography/hash-generator'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    BcryptHasher,
    JwtEncrypter,
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
