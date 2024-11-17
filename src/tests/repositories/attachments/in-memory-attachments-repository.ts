import { type AttachmentsRepositoryInterface } from '@/domain/forum/application/repositories'
import type { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepositoryInterface {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
