import type {
  UploaderInterface,
  UploadParams,
} from '@/domain/forum/application/gateways/storage/uploader'
import { randomUUID } from 'node:crypto'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements UploaderInterface {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `https://fake-url/${fileName}/${randomUUID()}`
    this.uploads.push({ fileName, url })

    return { url }
  }
}
