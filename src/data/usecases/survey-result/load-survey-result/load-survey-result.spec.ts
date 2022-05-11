import MockDate from 'mockdate'
import { DbLoadSurveyResult } from './load-survey-result'
import { LoadSurveyResultRepository, SurveyResultModel } from './load-survey-result-protocols'

type SutTypes = {
  sut: DbLoadSurveyResult,
  loadResultRepositoryStub: LoadSurveyResultRepository
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
    accountId: 'account_id',
    answers: [{
      image: 'any_image',
      answer: 'any_answer',
      count: 1,
      percent: 1
    }],
    date: new Date()
  })

  const makeSut = (): SutTypes => {
    const loadResultRepositoryStub = makeLoadResultRepository()
    const sut = new DbLoadSurveyResult(loadResultRepositoryStub)
    return {
      sut,
      loadResultRepositoryStub
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

  test('Should call LoadSurveyResultRepository', async () => {
    const {sut, loadResultRepositoryStub} = makeSut()
    const loadBySurveyByIdSpy = jest.spyOn(loadResultRepositoryStub,'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
