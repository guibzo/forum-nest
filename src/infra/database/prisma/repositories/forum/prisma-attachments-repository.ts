// import { AttachmentsRepositoryInterface } from '@/domain/forum/application/repositories'
// import { Student } from '@/domain/forum/enterprise/entities/student'
// import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
// import { Inject, Injectable } from '@nestjs/common'
// import { CustomPrismaService } from 'nestjs-prisma'
// import { PrismaStudentMapper } from './mappers/prisma-student-mapper'
// import type { Attachment } from '@prisma/client'

// /* eslint-disable */
// @Injectable()
// export class PrismaAttachmentsRepository implements AttachmentsRepositoryInterface {
//   constructor(
//     @Inject('PrismaService')
//     private prisma: CustomPrismaService<ExtendedPrismaClient>
//   ) {}

//   async findByEmail(email: string): Promise<Student | null> {
//     const student = await this.prisma.client.user.findUnique({
//       where: {
//         email,
//       },
//     })

//     if (!student) {
//       return null
//     }

//     return PrismaStudentMapper.toDomain(student)
//   }

//   async create(attachment: Attachment): Promise<void> {
//     await this.prisma.client.attachment.create({
//       attachment
//     })
//   }
// }
