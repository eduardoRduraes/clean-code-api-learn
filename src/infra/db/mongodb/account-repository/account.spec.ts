import { MongoHelper } from '../helpers/mongo-helper'

describe('Account Mongo Repository', ()=>{
  const makeSut = () =>{
    const sut = new AccountMongoRepository()
    return {sut}
  }



  beforeAll(async ()=>{
    await MongoHelper.connect(process.env.MONGO_URL)

  })

  afterAll(async ()=>{
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async ()=>{
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
    expect(account.name).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
