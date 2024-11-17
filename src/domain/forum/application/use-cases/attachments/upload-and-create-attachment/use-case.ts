import { failure, success, type Either } from '@/core/either-failure-or-success'
import { InvalidAttachmentTypeError } from '@/core/errors/invalid-attachment-type'
import type { UploaderInterface } from '@/domain/forum/application/gateways/storage/uploader'
import { AttachmentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'

type UploadAndCreateAttachmentUseCaseRequest = {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepositoryInterface,
    private uploader: UploaderInterface
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    // jpg/jpeg/png/pdf regex
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return failure(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return success({
      attachment,
    })
  }
}
