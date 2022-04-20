import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols/http'
import { Middleware } from '../protocols/middleware'
import { AuthMiddleware } from './auth-midleware'

interface SutTypes {
  sut: Middleware,
  loadAccountByTokenStub: LoadAccountByToken
}

describe('Auth Middleware', () => {

  const makeFakeRequest = (): HttpRequest =>({
    headers: {
      'x-access-token': 'any_token'
    }
  })

  const makeFakeAccount = (): AccountModel =>({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  })

  const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    return {
      sut,
      loadAccountByTokenStub
    }
  }

  const makeLoadAccountByToken = (): any => {
    class LoadAccountByTokenStub implements LoadAccountByToken  {
      async load (token: string, role?:string): Promise<AccountModel> {
        return new Promise(resolve=>resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByTokenStub()
  }

  test('Should return 403 if no x-access-token is exists in headers', async () => {
    const {sut} = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call loadAccountByToken with correct accessToken', async () => {
    const {sut, loadAccountByTokenStub} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
