import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './save-survey-result-controller'

describe('DbSaveSurveyResult', () => {
  beforeAll(()=>{
    MockDate.set(new Date())
  })

  afterAll(()=>{
    MockDate.reset()
  })

  const makefakeSurveyResultData = (): SaveSurveyResultParams => ({
    surveyId: 'survey_id',
    accountId: 'account_id',
    answer: 'any_answer',
    date: new Date()
  })

  const makefakeSurveyResult = (): SurveyResultModel => ({
    surveyId: 'survey_id',
    accountId: 'account_id',
    answers: [{
      image: 'any_image',
      answer: 'any_answer',
      count: 1,
      percent: 1
    }],
    date: new Date()
  })


  type SutTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultStub : SaveSurveyResultRepository
  }

  const makeSut = (): SutTypes => {
    const saveSurveyResultStub = MakeDbSaveSurveyResult()
    const sut = new DbSaveSurveyResult(saveSurveyResultStub)
    return {
      sut,
      saveSurveyResultStub
    }
  }

  const MakeDbSaveSurveyResult = (): SaveSurveyResultRepository =>{
    class SaveSurveyResultStub implements SaveSurveyResultRepository {
      async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return new Promise(resolve=>resolve(makefakeSurveyResult()))
      }
    }
    return new SaveSurveyResultStub()
  }

  test('Should Call SaveSurveyResultRepository with correct values', async () => {
    const { sut,saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.save(makefakeSurveyResultData())
    expect(saveSpy).toHaveBeenCalledWith(makefakeSurveyResultData())
  })

  test('Should return Survey on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save(makefakeSurveyResultData())
    expect(response).toEqual(makefakeSurveyResult())
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut,saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve,reject)=>reject(new Error())))
    const promise = sut.save(makefakeSurveyResultData())
    expect(promise).rejects.toThrow()
  })
})
