import type { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export abstract class AttachmentsRepositoryInterface {
  abstract create(attachment: Attachment): Promise<void>
}
