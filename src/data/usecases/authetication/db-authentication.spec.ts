import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../../../domain/models/account"
import { AuthenticationModel } from "../../../domain/usecases/authenticatoin"
import { DBAuthentication } from "./db-authentication"
import { HashComparer } from "../../protocols/criptography/hash-comparer"

describe('DBAuthentication UseCase', ()=> {

  const makeFakeAccount = (): AccountModel =>({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  })

  const makeFakeAuthentication = (): AuthenticationModel =>({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

  const makeHashComparer = (): HashComparer =>{
    class HashComparerStub implements HashComparer {
      async compare(value: string, hash: string):Promise<boolean>{
        return new Promise(resolve => resolve(true))
      }
    }
    return new HashComparerStub()
  }

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
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const sut = new DBAuthentication(loadAccountByEmailRepository,hashComparerStub)

    return {
      sut,
      loadAccountByEmailRepository,
      hashComparerStub
    }
  }

  test('Shoud call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Shoud throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    expect(promise).rejects.toThrow()
  })

  test('Shoud return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Shoud call HashComparer with correct value', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Shoud throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    expect(promise).rejects.toThrow()
  })
})
