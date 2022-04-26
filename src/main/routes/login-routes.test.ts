import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import request from 'supertest'
import { setupApp } from '../config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection
  beforeAll(async ()=> {
    await MongoHelper.connect(process.env.MONGO_URL)

  })

  afterAll(async ()=> {
    await MongoHelper.disconnect()
  })

  beforeEach(async ()=> {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

describe('Login Routes',()=> {
  describe('POST /signup', () => {
      test('Should return 200 on signup', async() => {
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
})

describe('POST /login', () => {
  test('Should return 200 on login', async ()=> {
    const password = await hash('123', 12)
    await accountCollection.insertOne({
      name: 'Eduardo ',
      email: 'eduardoduraes.bsi@gmail.com',
      password
    })

    await request(await setupApp())
    .post('/api/login')
    .send({
      email: 'eduardoduraes.bsi@gmail.com',
      password: '123'
    })
    .expect(200)
  })

  test('Should return 401 on login', async ()=> {
    await request(await setupApp())
    .post('/api/login')
    .send({
      email: 'eduardoduraes.bsi@gmail.com',
      password: '123'
    })
    .expect(401)
  })
})
