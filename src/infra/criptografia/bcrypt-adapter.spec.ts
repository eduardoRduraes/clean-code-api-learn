import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface BcryptAdapterStub{
  bcryptAdapterStub : BcryptAdapter
  salt: number
}

jest.mock('bcrypt',() =>({
  async hash(): Promise<string>{
    return new Promise(resolve=>resolve('hash'))
  }
}))

const makeSut = (): BcryptAdapterStub =>{
  const salt = 12
  const bcryptAdapterStub = new BcryptAdapter(salt)
  return {
    bcryptAdapterStub,
    salt
  }
}

describe('Bcrypt Adapter', () =>{
  test('Should call bcrypt with correct values', async () =>{
    const { bcryptAdapterStub, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await bcryptAdapterStub.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () =>{
    const { bcryptAdapterStub } = makeSut()
    const hash = await bcryptAdapterStub.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
