import { Collection } from "mongodb"
import { AddSurveyModel } from "../../../../domain/usecases/add-survey"
import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'

describe('Survey Mongo Repository', () =>{

  let surveyCollection: Collection

  beforeAll(async ()=>{
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async ()=>{
    await MongoHelper.disconnect()
  })

  beforeEach(async ()=>{
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    MockDate.reset()
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }],
    date: new Date()
  })

  test('Should return an survey on add success', async () => {
    const sut = makeSut()
    const data = makeFakeSurveyData()
    await sut.add(data)

    const survey = await surveyCollection.findOne({question:'any_question'})
    expect(survey).toBeTruthy()
  })
})
