import { Module } from '@nestjs/common'

import { UploaderInterface } from '@/domain/forum/application/gateways/storage/uploader'
import { EnvModule } from '../env/env.module'
import { R2Storage } from './r2-storage'

@Module({
  providers: [{ provide: UploaderInterface, useClass: R2Storage }, R2Storage],
  exports: [UploaderInterface],
  imports: [EnvModule],
})
export class StorageModule {}
