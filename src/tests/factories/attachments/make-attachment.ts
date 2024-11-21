import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment, type AttachmentProps } from '@/domain/forum/enterprise/entities/attachment'
import type { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/repositories/forum/attachments/mappers/prisma-attachment-mapper'
import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import type { CustomPrismaService } from 'nestjs-prisma'

export const makeAttachment = (override: Partial<AttachmentProps> = {}, id?: UniqueEntityID) => {
  const attachment = Attachment.create(
    {
      title: faker.lorem.words(),
      url: faker.lorem.slug(),
      ...override,
    },
    id
  )

  return attachment
}

/* eslint-disable */
@Injectable()
export class AttachmentFactory {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prisma.client.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
