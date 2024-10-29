import { Either, failure, success } from '@/core/either-failure-or-success'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { Encrypter } from '@/domain/forum/application/gateways/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/gateways/cryptography/hash-comparer'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Injectable } from '@nestjs/common'

type AuthenticateStudentUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return failure(new WrongCredentialsError())
    }

    const isPasswordCorrect = await this.hashComparer.compare(password, student.password)

    if (!isPasswordCorrect) {
      return failure(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return success({
      accessToken,
    })
  }
}
