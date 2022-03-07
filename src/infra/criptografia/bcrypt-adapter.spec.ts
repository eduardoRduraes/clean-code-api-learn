import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface BcryptAdapterStub{
  sut : BcryptAdapter
  salt: number
}

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
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
