import { AccountModel } from "@/domain/models/account"
import { SurveyModel } from "@/domain/models/survey"
import MockDate from 'mockdate'
import { Collection, ObjectId } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository"

describe('Save Survey Result', () => {
  let surveyCollection: Collection
  let surveyResultCollection: Collection
  let accountCollection: Collection

  beforeAll(async ()=>{
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async ()=>{
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  const makeFakeAccount = async (): Promise<AccountModel> => {
    const object = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
    const res = await accountCollection.findOne({_id: new ObjectId(object.insertedId)})
    return res && MongoHelper.map(res)
  }

  const makeFakeSurveyData = async (): Promise<SurveyModel> => {
    const object =  await surveyCollection.insertOne({
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
    const res = await surveyCollection.findOne({_id: new ObjectId(object.insertedId)})
    return res && MongoHelper.map(res)
  }

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeFakeSurveyData()
      const account = await makeFakeAccount()
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('Should update survey result if its not new', async () => {
      const survey = await makeFakeSurveyData()
      const account = await makeFakeAccount()

      const response = await surveyResultCollection.insertOne({
        accountId: new ObjectId(account.id),
        suveryId: new ObjectId(survey.id),
        answer: survey.answers[1].answer,
        date: new Date()
      })

      const sut = makeSut()

      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(response.insertedId.toString())
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})
