import MockDate from 'mockdate'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

describe('DbAddSurvey UseCase', () => {

  beforeAll(()=>{
    MockDate.set(new Date())
  })

  afterAll(()=>{
    MockDate.reset()
  })

  const makefakeSurvey = (): AddSurveyModel =>({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepositoryStub : AddSurveyRepository
  }

  const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
      sut,
      addSurveyRepositoryStub
    }
  }

  const makeAddSurveyRepositoryStub = (): AddSurveyRepository =>{
    class AddSurveyRepository implements AddSurveyRepository {
      async add(surveyData: AddSurveyModel): Promise<void>{
        return new Promise(resolve=>resolve())
      }
    }
    return new AddSurveyRepository()
  }

  describe('AddSurveyAddSurveyRepository', () => {
    beforeAll(()=>{
      MockDate.set('2022-04-25')
    })

    afterAll(()=>{
      MockDate.reset()
    })
    test('Should Call AddSurveyRepository with correct values', async () => {
      const { sut,addSurveyRepositoryStub } = makeSut()
      const surveyData = makefakeSurvey()
      const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
      await sut.add(surveyData)
      expect(addSpy).toHaveBeenCalledWith(makefakeSurvey())
    })

    test('Should throw if AddSurveyRepository throws', async () => {
      const { sut,addSurveyRepositoryStub } = makeSut()
      jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
      const promise = sut.add(makefakeSurvey())
      expect(promise).rejects.toThrow()
    })
  })
})
