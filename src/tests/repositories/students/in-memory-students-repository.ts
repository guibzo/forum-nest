import { StudentsRepositoryInterface } from '@/domain/forum/application/repositories'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepositoryInterface {
  public items: Student[] = []

  constructor() {}

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email.toString() === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
