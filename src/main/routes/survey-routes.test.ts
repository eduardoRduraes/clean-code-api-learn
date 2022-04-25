import { sign } from 'jsonwebtoken'
import { Collection, ObjectId } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'
import env from '../config/env'


let surveyCollection: Collection
let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)

  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })

const makeFakeSurveyData = (): any => ({
        question: 'Question',
        answers:[
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          },
        ]
      })

describe('Survey Routes',()=> {
  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async() => {
      await request(await setupApp())
      .post('/api/surveys')
      .send(makeFakeSurveyData())
      .expect(403)
    })

  test('Should return 204 on add survey with valid accessToken', async() => {
      accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: '123',
        role: 'admin'
      })
      const response = await accountCollection.findOne({email: 'any_email@mail.com'})
      const accessToken = sign({id: response._id}, env.jwtSecret)

      await accountCollection.updateOne({
        _id: new ObjectId(response._id)
      },
      {
        $set:{
          accessToken
        }
      })

      await request(await setupApp())
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeSurveyData())
      .expect(204)
    })
  })
})

