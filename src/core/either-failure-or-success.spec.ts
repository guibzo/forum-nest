import { Either, Failure, Success, failure, success } from './either-failure-or-success'

function doSomeThing(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return success(10)
  }

  return failure('error')
}

test('success result', () => {
  const result = doSomeThing(true)

  expect(result).toBeInstanceOf(Success)
})

test('error result', () => {
  const result = doSomeThing(false)

  expect(result).toBeInstanceOf(Failure)
})
