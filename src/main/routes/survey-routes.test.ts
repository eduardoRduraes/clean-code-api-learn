import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'


let surveyCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)

  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
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
  })
})

