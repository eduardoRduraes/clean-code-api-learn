import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols/http'
import { Middleware } from '../protocols/middleware'
import { AuthMiddleware } from './auth-midleware'
describe('Auth Middleware', () => {

  const makeSut = (): Middleware => {
    const sut = new AuthMiddleware()
    return sut
  }

  const makeFakeRequest = (): HttpRequest =>({
    headers: {

    }
  })

  test('Should return 403 if no x-access-token is exists in headers', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })


})
