import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface BcryptAdapterStub{
  sut : BcryptAdapter
  salt: number
}

jest.mock('bcrypt',() =>({
  async hash(): Promise<string>{
    return new Promise(resolve=>resolve('hash'))
  },

  async compare(): Promise<boolean>{
    return new Promise(resolve=>resolve(true))
  }
}))

const makeSut = (): BcryptAdapterStub =>{
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () =>{
  test('Should call hash with correct values', async () =>{
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on hash success', async () =>{
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should trhow if bcrypt throws', async () =>{
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve,reject)=> reject(new Error())
    ))
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () =>{
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value','any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value','any_hash')
  })

   test('Should return true when compare success', async () =>{
    const { sut } = makeSut()
    const isvalid = await sut.compare('any_value','any_hash')
    expect(isvalid).toBe(true)
  })
})
