import { sign } from 'jsonwebtoken'
import { Collection, ObjectId } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'
import env from '../config/env'
import MockDate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection
beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
  MockDate.set(new Date())

})

afterAll(async () => {
  await MongoHelper.disconnect()
  MockDate.reset()
})

beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('surveys')
  await surveyCollection.deleteMany({})
  accountCollection = await MongoHelper.getCollection('accounts')
  await surveyCollection.deleteMany({})
})


const makeFakeSurveyData = (): any => ({
  question:'Question',
    answers:[{
      answer: 'Answer 1',
      image: 'http://image-name.com'
    },{
      answer: 'Answer 2'
    }],
    date: new Date()
})

const makeAccessToken = async():Promise<string> =>{
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

  return accessToken
}

describe('PUT /surveys/:surveyId/results', () => {
  test('Should return 403 on save survey without accessToken', async() => {
    await request(await setupApp())
    .put('/api/surveys/any_yd/results')
    .send({
      answer: 'any_answer'
    })
    .expect(403)
  })

  test('Should return 200 on save survey with valid accessToken', async() => {
    const response = await surveyCollection.insertOne(makeFakeSurveyData())
    const accessToken = await makeAccessToken()
    await request(await setupApp())
    .put(`/api/surveys/${response.insertedId.toString()}/results`)
    .set('x-access-token', accessToken)
    .send({
      answer: 'Answer 1'
    })
    .expect(200)
  })
})

describe('GET /surveys/:surveyId/results', () => {
  test('Should return 403 on load survey without accessToken', async() => {
    await request(await setupApp())
    .get('/api/surveys/any_yd/results')
    .expect(403)
  })

  test('Should return 200 on load survey with valid accessToken', async() => {
    const response = await surveyCollection.insertOne(makeFakeSurveyData())
    const accessToken = await makeAccessToken()
    await request(await setupApp())
    .get(`/api/surveys/${response.insertedId.toString()}/results`)
    .set('x-access-token', accessToken)
    .expect(200)
  })
})
