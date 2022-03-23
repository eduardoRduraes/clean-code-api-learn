import { LoadAccountByEmailRepository } from "../../../data/protocols/load-account-by-email-repository"
import { AccountModel } from "../../../domain/models/account"
import { DBAuthentication } from "./db-authentication"

describe('DBAuthentication UseCase', ()=> {

  const makeLoadAccountByEmailRepository = () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel>{
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
        }
        return new Promise(resolve=>resolve(account))
      }
    }

    return new LoadAccountByEmailRepositoryStub()
  }

  const makeSut = (): any => {
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
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
