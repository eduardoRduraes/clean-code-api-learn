import { AddSurveyModel } from "@/domain/usecases/add-survey"
import MockDate from 'mockdate'
import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyMongoRepository } from './survey-mongo-repository'

describe('Survey Mongo Repository', () =>{

  let surveyCollection: Collection

  beforeAll(async ()=>{
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async ()=>{
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async ()=>{
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
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

  describe('add()', () => {
    test('Should return an survey on add success', async () => {
      const sut = makeSut()
      const data = makeFakeSurveyData()
      await sut.add(data)

      const survey = await surveyCollection.findOne({question:'any_question'})
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([makeFakeSurveyData(),makeFakeSurveyData()])

      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('any_question')
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load surveys by id on success', async () => {
      const response = await surveyCollection.insertOne(makeFakeSurveyData())
      const sut = makeSut()
      const survey = await sut.loadById(response.insertedId.toString())
      expect(survey).toBeTruthy()
    })
  })
})
