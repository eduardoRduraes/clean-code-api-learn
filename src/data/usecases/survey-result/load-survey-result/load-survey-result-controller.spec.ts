import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import MockDate from 'mockdate'
import { SurveyModel } from '../../survey/load-surveys/db-load-surveys-protocols'
import { DbLoadSurveyResult } from './load-survey-result-controller'
import { LoadSurveyResultRepository, SurveyResultModel } from './load-survey-result-controller-protocols'

type SutTypes = {
  sut: DbLoadSurveyResult,
  loadResultRepositoryStub: LoadSurveyResultRepository,
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(()=>{
    MockDate.set(new Date())
  })

  afterAll(()=>{
    MockDate.reset()
  })

  const makefakeSurveyResult = (): SurveyResultModel => ({
    surveyId: 'survey_id',
    question: 'question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer',
      count: 1,
      percent: 1
    }],
    date: new Date()
  })
  const makefakeSurveyResultData = (): SurveyResultModel => ({
    surveyId: 'survey_id',
    question: 'question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer',
      count: 0,
      percent: 0
    }],
    date: new Date()
  })

  const makefakeSurveyModel = (): SurveyModel => ({
    id: 'survey_id',
    question: 'question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  const makeSut = (): SutTypes => {
    const loadResultRepositoryStub = makeLoadResultRepository()
    const loadSurveyByIdRepositoryStub = makeloadSurveyByIdRepository()
    const sut = new DbLoadSurveyResult(loadResultRepositoryStub,loadSurveyByIdRepositoryStub)
    return {
      sut,
      loadResultRepositoryStub,
      loadSurveyByIdRepositoryStub
    }
  }

  const makeLoadResultRepository = () =>{
    class LoadResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        return new Promise(resolve=>resolve(makefakeSurveyResult()))
      }
    }
    return new LoadResultRepositoryStub()
  }

  const makeloadSurveyByIdRepository = () =>{
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
      loadById(surveyId: string): Promise<SurveyModel> {
        return new Promise(resolve=>resolve(makefakeSurveyModel()))
      }
    }
    return new LoadSurveyByIdRepositoryStub()
  }

  test('Should call LoadSurveyResultRepository', async () => {
    const {sut, loadResultRepositoryStub} = makeSut()
    const loadBySurveyByIdSpy = jest.spyOn(loadResultRepositoryStub,'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should resturn surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(makefakeSurveyResult())
  })

  test('Should throw if LoadSurveyResultRepository throws', () => {
    const { sut,loadResultRepositoryStub } = makeSut()
    jest.spyOn(loadResultRepositoryStub,'loadBySurveyId').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.load('any_survey_id')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut } = makeSut()
     const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(makefakeSurveyResult())
  })

  test('Should call LoadSurveyByIdResultRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadResultRepositoryStub,'loadBySurveyId').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    await sut.load('any_survey_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResultModel with all answer with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadResultRepositoryStub } = makeSut()
    jest.spyOn(loadResultRepositoryStub,'loadBySurveyId').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(makefakeSurveyResultData())
  })
})
