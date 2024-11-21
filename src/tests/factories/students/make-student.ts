import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student, StudentProps } from '@/domain/forum/enterprise/entities/student'
import { ExtendedPrismaClient } from '@/infra/database/prisma/get-extended-prisma-client'
import { PrismaStudentMapper } from '@/infra/database/prisma/repositories/forum/account/mappers/prisma-student-mapper'
import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import { CustomPrismaService } from 'nestjs-prisma'

export const makeStudent = (override: Partial<StudentProps> = {}, id?: UniqueEntityID) => {
  const student = Student.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return student
}

/* eslint-disable */
@Injectable()
export class StudentFactory {
  constructor(
    @Inject('PrismaService')
    private prisma: CustomPrismaService<ExtendedPrismaClient>
  ) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data)

    await this.prisma.client.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }
}
