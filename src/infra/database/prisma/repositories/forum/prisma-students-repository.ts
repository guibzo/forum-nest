import { StudentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'
import { PrismaStudentMapper } from './mappers/prisma-student-mapper'

/* eslint-disable */
@Injectable()
export class PrismaStudentsRepository implements StudentsRepositoryInterface {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.client.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.client.user.create({
      data,
    })
  }
}
