import { MongoClient,Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

interface AccountMongoRepositoryStub {
  sut: AccountMongoRepository
}

let accountCollection: Collection

describe('Account Mongo Repository', ()=>{
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = ():AccountMongoRepositoryStub =>{
    const sut = new AccountMongoRepository()
    return {sut}
  }

  const makeFakeAccount = ():AddAccountModel =>({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

  test('Should return an account on add success', async ()=>{
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccount())
    expect(account.name).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async ()=>{
    const { sut } = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account.name).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByEmail fails', async ()=>{
    const { sut } = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async ()=>{
    const { sut } = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const fakeAccount = await accountCollection.findOne({_id: res.insertedId})

    expect(fakeAccount.accessToken).toBeFalsy()
    await sut.updateAccessToken(fakeAccount._id.toString(),'any_token')
    const account = await accountCollection.findOne({_id: fakeAccount._id})
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
