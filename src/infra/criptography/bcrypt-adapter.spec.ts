import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface BcryptAdapterStub{
  sut : BcryptAdapter
  salt: number
}

jest.mock('bcrypt',() =>({
  async hash(): Promise<string>{
    return new Promise(resolve=>resolve('hash'))
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
  test('Should call bcrypt with correct values', async () =>{
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () =>{
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
})
