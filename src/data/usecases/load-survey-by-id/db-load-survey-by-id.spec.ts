import MockDate from 'mockdate'
import { SurveyModel } from '../load-surveys/db-load-surveys-protocols'
import { LoadSurveyByIdRepository } from '../../protocols/db/survey/load-surveys-by-id-repository'
import { DbLoadSurveyById } from './db-load-survey-by-id'

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  type SutTypes = {
    sut: DbLoadSurveyById,
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  }

  const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return {
      sut,
      loadSurveyByIdRepositoryStub
    }
  }

  const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository =>{
    class LoadSurveyRepositoryStub implements LoadSurveyByIdRepository {
      loadById(surveyId: string): Promise<SurveyModel> {
        return new Promise(resolve=>resolve(makeFakeSurveys()))
      }
    }

    return new LoadSurveyRepositoryStub()
  }

  const makeFakeSurveys = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [{
          image:'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }
  }

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut,loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById(makeFakeSurveys().id)
    expect(loadByIdSpy).toHaveBeenCalledWith(makeFakeSurveys().id)
  })

  test('Should throw if LoadSurveyByIdRepository throws', () => {
    const { sut,loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise =  sut.loadById(makeFakeSurveys().id)
    expect(promise).rejects.toThrow()
  })

  test('Should return Survey on success', async () => {
    const { sut } = makeSut()
    const survey =  await sut.loadById(makeFakeSurveys().id)
    expect(survey).toEqual(makeFakeSurveys())
  })

})
