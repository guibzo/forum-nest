import { Either, failure, success } from '@/core/either-failure-or-success'
import { HashGenerator } from '@/domain/forum/application/gateways/cryptography/hash-generator'
import { StudentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { StudentAlreadyExistsError } from '../../@errors/student-already-exists-error'

type RegisterStudentUseCaseRequest = {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<StudentAlreadyExistsError, { student: Student }>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepositoryInterface,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return failure(new StudentAlreadyExistsError(email))
    }

    const hashedPasswored = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPasswored,
    })

    this.studentsRepository.create(student)

    return success({
      student,
    })
  }
}
