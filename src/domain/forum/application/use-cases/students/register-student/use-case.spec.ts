import { Success } from '@/core/either-failure-or-success'
import { FakeHasher } from '@/tests/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '@/tests/repositories/students/in-memory-students-repository'
import { RegisterStudentUseCase } from './use-case'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Create question', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result).toBeInstanceOf(Success)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result).toBeInstanceOf(Success)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
