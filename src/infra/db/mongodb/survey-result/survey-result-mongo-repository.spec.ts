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
        answer: 'any_answer_1'
      },
      {
        answer: 'any_answer_2'
      },
      {
        answer: 'any_answer_3'
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

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        "surveyId": new ObjectId(survey.id),
        "accountId": new ObjectId(account.id)
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update survey result if its not new', async () => {
      const survey = await makeFakeSurveyData()
      const account = await makeFakeAccount()

      await surveyResultCollection.insertOne({
        accountId: new ObjectId(account.id),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const sut = makeSut()
      await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.find({
        "surveyId": new ObjectId(survey.id),
        "accountId": new ObjectId(account.id)
      }).toArray()
      console.log(surveyResult[0])
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
      expect(surveyResult[0].answer).toBe(survey.answers[1].answer)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = await makeFakeSurveyData()
      const account = await makeFakeAccount()

      await surveyResultCollection.insertMany([{
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },{
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },{
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          date: new Date()
        },{
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId.toString()).toBe(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  })
})
