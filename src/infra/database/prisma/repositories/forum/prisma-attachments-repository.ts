import { AttachmentsRepositoryInterface } from '@/domain/forum/application/repositories'
import type { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaAttachmentMapper } from './mappers/prisma-attachment-mapper'

/* eslint-disable */
@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepositoryInterface {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.client.attachment.create({
      data,
    })
  }
}
