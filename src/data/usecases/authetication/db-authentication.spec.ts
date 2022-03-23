import { TokenGenerator } from "../../../data/protocols/criptography/token-generator"
import { AccountModel } from "../../../domain/models/account"
import { AuthenticationModel } from "../../../domain/usecases/authenticatoin"
import { HashComparer } from "../../protocols/criptography/hash-comparer"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { DBAuthentication } from "./db-authentication"

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

  const makeTokenGenerator = (): any =>{
    class TokenGeneratorStub implements TokenGenerator{
      async generate (id: string): Promise<string>{
        return new Promise(resolve=>resolve('any_token'))
      }
    }
    return new TokenGeneratorStub()
  }

  interface SutTypes {
    sut: DBAuthentication,
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer,
    tokenGeneratorStub: TokenGenerator
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const tokenGeneratorStub = makeTokenGenerator()
    const sut = new DBAuthentication(loadAccountByEmailRepository,hashComparerStub, tokenGeneratorStub)

    return {
      sut,
      loadAccountByEmailRepository,
      hashComparerStub,
      tokenGeneratorStub
    }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct value', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    expect(promise).rejects.toThrow()
  })

   test('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve=>resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

   test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    expect(promise).rejects.toThrow()
  })

  test('Should call TokenGenerator with token', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })
})
