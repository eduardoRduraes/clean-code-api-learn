import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../../../domain/models/account"
import { AuthenticationModel } from "../../../domain/usecases/authenticatoin"
import { DBAuthentication } from "./db-authentication"

describe('DBAuthentication UseCase', ()=> {

  const makeFakeAccount = (): AccountModel =>({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  })

  const makeFakeAuthentication = (): AuthenticationModel =>({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

  const makeLoadAccountByEmailRepository = () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel>{
        return new Promise(resolve=>resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  interface SutTypes {
    sut: DBAuthentication,
    loadAccountByEmailRepository: LoadAccountByEmailRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
    const sut = new DBAuthentication(loadAccountByEmailRepository)

    return {
      sut,
      loadAccountByEmailRepository
    }
  }

  test('Shoud call LoadAccountByEmailRepository with correct email', async () => {
    const {sut, loadAccountByEmailRepository} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Shoud throw if LoadAccountByEmailRepository throws', async () => {
    const {sut, loadAccountByEmailRepository} = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    expect(promise).rejects.toThrow()
  })
})
