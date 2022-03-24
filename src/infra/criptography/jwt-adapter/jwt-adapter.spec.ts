import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

describe('Jwt Adapter', () => {
  interface SutTypes {
    sut: JwtAdapter
  }
  const makeSut = (secret: string):SutTypes => {
    const sut = new JwtAdapter(secret)
    return {
      sut
    }
  }


  test('Should call sign with correct values', async () => {
    const {sut} = makeSut('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({id:'any_id'}, 'secret')
  })
})
