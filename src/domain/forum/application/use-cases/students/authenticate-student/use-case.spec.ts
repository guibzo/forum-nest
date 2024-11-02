import { Failure, Success } from '@/core/either-failure-or-success'
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error'
import { FakeEncrypter } from '@/tests/cryptography/fake-encrypter'
import { FakeHasher } from '@/tests/cryptography/fake-hasher'
import { makeStudent } from '@/tests/factories/students/make-student'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './use-case'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Create question', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate as a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result).toBeInstanceOf(Success)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong password', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '111111',
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
