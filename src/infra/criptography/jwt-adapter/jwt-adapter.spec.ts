import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock('jsonwebtoken', () =>( {
  sign: async (): Promise<string> => {
    return new Promise(resolve=>resolve('any_token'))
  }
}))

interface SutTypes {
  sut: JwtAdapter
}
const makeSut = (secret: string):SutTypes => {
  const sut = new JwtAdapter(secret)
  return {
    sut
  }
}
describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const {sut} = makeSut('secret')
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({id:'any_id'}, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const {sut} = makeSut('secret')
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const {sut} = makeSut('secret')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(()=>{ throw new Error()})
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
