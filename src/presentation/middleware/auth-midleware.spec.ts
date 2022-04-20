import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols/http'
import { AuthMiddleware } from './auth-midleware'

interface SutTypes {
  sut: AuthMiddleware,
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

  const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role)
    return {
      sut,
      loadAccountByTokenStub
    }
  }

  const makeLoadAccountByToken = (): LoadAccountByToken => {
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

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const {sut, loadAccountByTokenStub} = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token',role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const {sut, loadAccountByTokenStub} = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken throws', async () => {
    const {sut} = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should return 500 if LoadAccountByToken returns an account', async () => {
    const {sut,loadAccountByTokenStub} = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
