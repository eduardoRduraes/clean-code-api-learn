import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

import request from 'supertest'
import { setupApp } from '../config/app'
describe('SignUp Routes',()=>{
  beforeAll(async ()=>{
    await MongoHelper.connect(process.env.MONGO_URL)

  })

  afterAll(async ()=>{
    await MongoHelper.disconnect()
  })

  beforeEach(async ()=>{
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async() =>{
    await request(await setupApp())
    .post('/api/signup')
    .send({
      name: 'Eduardo ',
      email: 'eduardoduraes.bsi@gmail.com',
      password: '123',
      passwordConfirmation: '123'
    })
    .expect(200)
  })
})
